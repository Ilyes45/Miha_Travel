const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Reservation = require("../models/Reservation");
const Voyage = require("../models/Voyage");
const Hotel = require("../models/Hotel");
const auth = require("../middleware/auth");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Récupérer les réservations de l'utilisateur
    const reservations = await Reservation.find({ user: userId })
      .populate({ path: "voyage", populate: "destination" })
      .populate({ path: "hotel", populate: "destination" })
      .lean();

    // 2. Extraire les destinations déjà visitées
    const destinationIds = new Set();
    const destinationNames = new Set();
    reservations.forEach((r) => {
      if (r.voyage?.destination) {
        destinationIds.add(String(r.voyage.destination._id));
        destinationNames.add(r.voyage.destination.nom);
      }
      if (r.hotel?.destination) {
        destinationIds.add(String(r.hotel.destination._id));
        destinationNames.add(r.hotel.destination.nom);
      }
    });

    const destArray = [...destinationIds];

    // 3. Récupérer tous les voyages et hôtels disponibles
    const reservedVoyageIds = reservations.map((r) => r.voyage?._id).filter(Boolean);
    const reservedHotelIds = reservations.map((r) => r.hotel?._id).filter(Boolean);

    const allVoyages = await Voyage.find({ _id: { $nin: reservedVoyageIds } })
      .populate("destination")
      .limit(20)
      .lean();

    const allHotels = await Hotel.find({ _id: { $nin: reservedHotelIds } })
      .populate("destination")
      .limit(20)
      .lean();

    // 4. Construire le contexte pour Groq
    const userProfile = reservations.length > 0
      ? `L'utilisateur a déjà réservé des voyages vers : ${[...destinationNames].join(", ")}.
         Nombre de réservations : ${reservations.length}.
         Budget moyen voyages : ${Math.round(
           reservations.filter(r => r.voyage?.price).reduce((s, r) => s + (r.voyage?.price || 0), 0) /
           Math.max(reservations.filter(r => r.voyage?.price).length, 1)
         )} TND.`
      : "L'utilisateur est nouveau, il n'a pas encore de réservations.";

    const voyagesContext = allVoyages.map((v, i) =>
      `[VOYAGE_${i}] id:${v._id} | titre:${v.title} | destination:${v.destination?.nom} | prix:${v.price} TND | promo:${v.promotion?.actif ? `oui -${v.promotion.reduction}%` : "non"}`
    ).join("\n");

    const hotelsContext = allHotels.map((h, i) =>
      `[HOTEL_${i}] id:${h._id} | nom:${h.nom} | destination:${h.destination?.nom} | etoiles:${h.etoiles} | prix:${h.prix} TND/nuit`
    ).join("\n");

    const prompt = `Tu es un expert en recommandations de voyages pour l'agence Miha Travel.

PROFIL UTILISATEUR :
${userProfile}

VOYAGES DISPONIBLES :
${voyagesContext}

HÔTELS DISPONIBLES :
${hotelsContext}

Ta mission : Sélectionne exactement 3 voyages et 3 hôtels les plus adaptés à ce profil utilisateur.
Priorise les destinations similaires à ses préférences, les bonnes promotions, et la diversité.

Réponds UNIQUEMENT avec ce JSON (sans texte avant ou après) :
{
  "voyageIds": ["id1", "id2", "id3"],
  "hotelIds": ["id1", "id2", "id3"],
  "reason": "Une phrase courte expliquant pourquoi ces choix correspondent à l'utilisateur"
}`;

    // 5. Appel Groq
    const groqResponse = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = groqResponse.choices[0].message.content;

    // 6. Parser la réponse JSON
    let voyageIds = [];
    let hotelIds = [];
    let reason = "";

    try {
      const clean = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      voyageIds = parsed.voyageIds || [];
      hotelIds = parsed.hotelIds || [];
      reason = parsed.reason || "";
    } catch {
      // Si Groq ne retourne pas un JSON valide, fallback sur logique simple
      console.log("Fallback recommandations sans IA");
    }

    // 7. Récupérer les voyages/hôtels recommandés par Groq
    let recommendedVoyages = allVoyages.filter((v) =>
      voyageIds.includes(String(v._id))
    );
    let recommendedHotels = allHotels.filter((h) =>
      hotelIds.includes(String(h._id))
    );

    // Fallback si Groq n'a pas retourné assez de résultats
    if (recommendedVoyages.length < 3) {
      const extras = allVoyages
        .filter((v) => !voyageIds.includes(String(v._id)))
        .slice(0, 3 - recommendedVoyages.length);
      recommendedVoyages = [...recommendedVoyages, ...extras];
    }

    if (recommendedHotels.length < 3) {
      const extras = allHotels
        .filter((h) => !hotelIds.includes(String(h._id)))
        .slice(0, 3 - recommendedHotels.length);
      recommendedHotels = [...recommendedHotels, ...extras];
    }

    res.json({
      voyages: recommendedVoyages,
      hotels: recommendedHotels,
      reason,
      aiPowered: voyageIds.length > 0,
    });
  } catch (error) {
    console.error("Erreur recommandations:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;