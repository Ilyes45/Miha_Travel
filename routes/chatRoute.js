// routes/chatRoute.js
const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const Voyage = require("../models/Voyage");
const Hotel = require("../models/Hotel");
const Destination = require("../models/Destination");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log("GROQ KEY:", process.env.GROQ_API_KEY);

// Historique par session (en mémoire)
const sessions = {};

router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: "message et sessionId requis" });
    }

    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    // Récupérer les données réelles depuis MongoDB
    const destinations = await Destination.find().lean();
    const voyages = await Voyage.find({ "promotion.actif": false })
      .populate("destination")
      .limit(10)
      .lean();
    const voyagesPromo = await Voyage.find({ "promotion.actif": true })
      .populate("destination")
      .limit(5)
      .lean();
    const hotels = await Hotel.find().populate("destination").limit(10).lean();

    // Construire le contexte dynamique
    const destinationsText = destinations
      .map((d) => `${d.nom} (${d.paye})`)
      .join(", ");

    const voyagesText = voyages
      .map(
        (v) =>
          `- ${v.title} vers ${v.destination?.nom || "?"} : ${v.price} TND, départ ${new Date(v.departureDate).toLocaleDateString("fr-FR")}`
      )
      .join("\n");

    const promosText = voyagesPromo
      .map(
        (v) =>
          `- ${v.title} : ${v.price} TND → ${v.promotion.prixPromo} TND (-${v.promotion.reduction}%)`
      )
      .join("\n");

    const hotelsText = hotels
      .map(
        (h) =>
          `- ${h.nom} à ${h.destination?.nom || "?"} : ${h.etoiles} étoiles, à partir de ${h.prix} TND/nuit`
      )
      .join("\n");

    // System prompt
    const systemPrompt = `Tu es l'assistant virtuel de Miha Travel, une agence de voyage tunisienne.
Tu réponds en français, de manière chaleureuse, professionnelle et concise.
Tu aides les clients à trouver des voyages, des hôtels, et à faire des réservations.

DONNÉES ACTUELLES DE L'AGENCE :

Destinations disponibles : ${destinationsText || "Non disponible"}

Voyages disponibles :
${voyagesText || "Aucun voyage disponible actuellement."}

Promotions en cours :
${promosText || "Aucune promotion en ce moment."}

Hôtels disponibles :
${hotelsText || "Aucun hôtel disponible actuellement."}

INSTRUCTIONS :
- Si le client demande à réserver, dis-lui de cliquer sur le bouton "Réserver" sur la page du voyage ou hôtel.
- Si tu ne connais pas une info précise, oriente vers le formulaire de contact.
- Ne jamais inventer de prix ou de dates.
- Réponds toujours en français.
- Garde tes réponses courtes (3-4 phrases maximum sauf si on te demande des détails).`;

    // Ajouter le message utilisateur
    sessions[sessionId].push({ role: "user", content: message });

    // Garder max 10 messages
    if (sessions[sessionId].length > 10) {
      sessions[sessionId] = sessions[sessionId].slice(-10);
    }

    // Appel à l'API Groq
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        ...sessions[sessionId],
      ],
    });

    const assistantMessage = response.choices[0].message.content;

    // Ajouter la réponse à l'historique
    sessions[sessionId].push({
      role: "assistant",
      content: assistantMessage,
    });

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error("Erreur chatbot:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec le chatbot." });
  }
});

module.exports = router;