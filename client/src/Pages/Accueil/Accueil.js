import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Spinner, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllVoyages } from "../../JS/Actions/voyage";
import { getAllHotels } from "../../JS/Actions/hotel";
import VoyageList from "../../Components/VoyageList/VoyageList";
import HotelList from "../../Components/HotelList/HotelList";
import AnnonceCarousel from "../../Components/AnnonceCarousel/AnnonceCarousel";
import "./Accueil.css";

const Accueil = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);
  const { hotels,  loadHotel  } = useSelector((s) => s.hotelReducer);

  const [promos, setPromos] = useState({ voyages: [], hotels: [] });
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllVoyages());
    dispatch(getAllHotels());
    axios.get("/api/promotion").then(res => setPromos(res.data)).catch(() => {});
  }, [dispatch]);

  const featuredVoyages = voyages.filter((v) => v.isFeatured);
  const featuredHotels  = hotels.filter((h) => h.isFeatured);

  const allPromos = [
    ...promos.voyages.map(v => ({ ...v, _type: "voyage" })),
    ...promos.hotels.map(h => ({ ...h, _type: "hotel" })),
  ];

  const getImage = (item) => {
    if (item.images?.length > 0 && item.images[0] &&
        !item.images[0].includes("example.com") &&
        !item.images[0].includes("placeholder")) return item.images[0];
    if (item.destination?.image) return item.destination.image;
    return null;
  };

  const handleSearch = (e) => {
  e.preventDefault();
  if (search.trim()) navigate(`/search?q=${search.trim()}`);
};

  return (
    <div className="accueil-page">

      <AnnonceCarousel />

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-overlay" />
        <Container className="hero-content">
          <p className="hero-tag">Agence de voyage — Gabès, Tunisie</p>
          <h1 className="hero-title">Voyagez avec<br /><span>Miha Travel</span></h1>
          <p className="hero-sub">Découvrez les plus belles destinations du monde</p>

          <div style={{ maxWidth: "600px", margin: "0 auto 40px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Destination, voyage, hôtel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(e); }}
              style={{
                flex: 1,
                padding: "16px 20px",
                fontSize: "1rem",
                border: "2px solid rgba(255,255,255,0.8)",
                borderRadius: "8px",
                outline: "none",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                backdropFilter: "blur(10px)",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                background: "#ffcc00",
                color: "#111",
                border: "none",
                padding: "16px 28px",
                fontWeight: "800",
                fontSize: "1rem",
                borderRadius: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Rechercher
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{voyages.length}+</span>
              <span className="hero-stat-label">Voyages</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{hotels.length}+</span>
              <span className="hero-stat-label">Hôtels</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">{allPromos.length}</span>
              <span className="hero-stat-label">Offres actives</span>
            </div>
          </div>
        </Container>
      </div>

      {/* ── RACCOURCIS ── */}
      <div className="shortcuts-bar">
        <Container>
          <div className="shortcuts">
            <button className="shortcut-item" onClick={() => navigate("/voyage")}>
              <span className="shortcut-icon">✈️</span>
              <span>Nos Voyages</span>
            </button>
            <button className="shortcut-item" onClick={() => navigate("/hotel")}>
              <span className="shortcut-icon">🏨</span>
              <span>Nos Hôtels</span>
            </button>
            <button className="shortcut-item" onClick={() => navigate("/promotions")}>
              <span className="shortcut-icon">🎉</span>
              <span>Offres Spéciales</span>
            </button>
            <button className="shortcut-item" onClick={() => navigate("/contact")}>
              <span className="shortcut-icon">📞</span>
              <span>Nous Contacter</span>
            </button>
          </div>
        </Container>
      </div>

      <Container className="py-5">

        {/* ── PROMOTIONS ── */}
        {allPromos.length > 0 && (
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">Offres Spéciales</h2>
                <p className="section-sub">Profitez de nos meilleures offres à prix réduits</p>
              </div>
              <button className="section-link" onClick={() => navigate("/promotions")}>
                Voir toutes les offres →
              </button>
            </div>
            <Row className="g-4">
              {allPromos.map((item) => {
                const nom     = item._type === "voyage" ? item.title : item.nom;
                const prix    = item._type === "voyage" ? item.price : item.prix;
                const image   = getImage(item);
                const expDate = new Date(item.promotion.dateExpiration);
                const jours   = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
                const lien    = item._type === "voyage" ? `/voyage/${item._id}` : `/hotel/${item._id}`;

                return (
                  <Col md={6} lg={4} key={item._id} className="d-flex">
                    <div className="promo-card">
                      <div className="promo-card-img-wrap">
                        {image ? (
                          <img src={image} alt={nom} className="promo-card-img"
                            onError={(e) => { e.target.style.display = "none"; }} />
                        ) : (
                          <div className="promo-card-img-placeholder">
                            {item._type === "voyage" ? "✈️" : "🏨"}
                          </div>
                        )}
                        <span className="promo-badge-reduction">-{item.promotion.reduction}%</span>
                        <span className="promo-badge-expiry">
                          {jours > 0 ? `${jours} jour${jours > 1 ? "s" : ""}` : "Dernier jour !"}
                        </span>
                      </div>
                      <div className="promo-card-body">
                        <p className="promo-card-title">{nom}</p>
                        <p className="promo-card-dest">
                          {item._type === "voyage" ? "Voyage" : "Hôtel"} · {item.destination?.nom}
                        </p>
                        <div className="promo-card-prix">
                          <div>
                            <span className="promo-prix-barre">{prix} DT</span>
                            <span className="promo-prix-promo">{item.promotion.prixPromo} DT</span>
                          </div>
                          <span className="promo-economie">-{prix - item.promotion.prixPromo} DT</span>
                        </div>
                        <Button variant="danger" className="w-100 fw-bold"
                          onClick={() => navigate(lien)}>
                          Profiter de l'offre
                        </Button>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </section>
        )}

        {/* ── VOYAGES FEATURED ── */}
        {!loadVoyage && featuredVoyages.length > 0 && (
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">Voyages à la une</h2>
                <p className="section-sub">Nos voyages les plus populaires</p>
              </div>
              <button className="section-link" onClick={() => navigate("/voyage")}>
                Voir tous →
              </button>
            </div>
            <VoyageList voyages={featuredVoyages.slice(0, 3)} featured />
          </section>
        )}

        {/* ── TOUS LES VOYAGES ── */}
        <section className="section-block">
          <div className="section-header">
            <div>
              <h2 className="section-title">Tous nos voyages</h2>
              <p className="section-sub">Explorez toutes nos destinations</p>
            </div>
            <button className="section-link" onClick={() => navigate("/voyage")}>
              Voir tous →
            </button>
          </div>
          {loadVoyage
            ? <div className="text-center py-4"><Spinner animation="border" variant="danger" /></div>
            : <VoyageList voyages={voyages.slice(0, 3)} />
          }
        </section>

        <hr className="section-divider" />

        {/* ── HOTELS FEATURED ── */}
        {!loadHotel && featuredHotels.length > 0 && (
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">Hôtels à la une</h2>
                <p className="section-sub">Nos hôtels les mieux notés</p>
              </div>
              <button className="section-link" onClick={() => navigate("/hotel")}>
                Voir tous →
              </button>
            </div>
            <HotelList hotels={featuredHotels.slice(0, 3)} featured />
          </section>
        )}

        {/* ── TOUS LES HOTELS ── */}
        <section className="section-block">
          <div className="section-header">
            <div>
              <h2 className="section-title">Nos hôtels</h2>
              <p className="section-sub">Trouvez le meilleur hébergement</p>
            </div>
            <button className="section-link" onClick={() => navigate("/hotel")}>
              Voir tous →
            </button>
          </div>
          {loadHotel
            ? <div className="text-center py-4"><Spinner animation="border" variant="danger" /></div>
            : <HotelList hotels={hotels.slice(0, 3)} />
          }
        </section>

      </Container>
    </div>
  );
};

export default Accueil;