import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Promotions = () => {
  const [promos,   setPromos]   = useState({ voyages: [], hotels: [] });
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("tous"); // tous | voyage | hotel
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/promotion")
      .then(res => setPromos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allPromos = [
    ...promos.voyages.map(v => ({ ...v, _type: "voyage" })),
    ...promos.hotels.map(h => ({ ...h, _type: "hotel" })),
  ];

  const filtered = filter === "tous" ? allPromos
    : allPromos.filter(item => item._type === filter);

  const getImage = (item) => {
    if (item.images && item.images.length > 0 && item.images[0] &&
        !item.images[0].includes("example.com") &&
        !item.images[0].includes("placeholder")) {
      return item.images[0];
    }
    if (item.destination?.image) return item.destination.image;
    return null;
  };

  return (
    <div>
      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #cc0000 0%, #8b0000 100%)",
        color: "white", padding: "60px 0", textAlign: "center",
      }}>
        <Container>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900 }}>🎉 Offres Spéciales</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
            Profitez de nos meilleures promotions avant qu'elles expirent !
          </p>
          <div style={{
            display: "inline-flex", background: "rgba(255,255,255,0.15)",
            borderRadius: 30, padding: "6px", marginTop: 20, gap: 4,
          }}>
            {["tous", "voyage", "hotel"].map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "white" : "transparent",
                  color: filter === f ? "#cc0000" : "white",
                  border: "none", borderRadius: 24,
                  padding: "8px 24px", fontWeight: 700,
                  cursor: "pointer", fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
              >
                {f === "tous" ? "🌟 Tous" : f === "voyage" ? "✈️ Voyages" : "🏨 Hôtels"}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: "4rem" }}>😕</p>
            <h4 className="text-muted">Aucune offre disponible pour le moment</h4>
            <p className="text-muted">Revenez bientôt pour découvrir nos promotions !</p>
            <Button variant="danger" onClick={() => navigate("/accueil")}>
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">
              <strong>{filtered.length}</strong> offre{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
            </p>
            <Row className="g-4">
              {filtered.map((item) => {
                const nom    = item._type === "voyage" ? item.title : item.nom;
                const prix   = item._type === "voyage" ? item.price : item.prix;
                const image  = getImage(item);
                const expDate = new Date(item.promotion.dateExpiration);
                const jours  = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
                const lien   = item._type === "voyage" ? `/voyage/${item._id}` : `/hotel/${item._id}`;
                const urgent = jours <= 3;

                return (
                  <Col md={6} lg={4} key={item._id} className="d-flex">
                    <div style={{
                      background: "white", borderRadius: 16,
                      overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      border: urgent ? "2px solid #cc0000" : "1px solid #f0d0d0",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      width: "100%", display: "flex", flexDirection: "column",
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      {/* ── IMAGE ── */}
                      <div style={{ position: "relative" }}>
                        {image ? (
                          <img src={image} alt={nom}
                            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                            onError={e => e.target.style.display = "none"}
                          />
                        ) : (
                          <div style={{
                            height: 200, background: "#f4f6fb",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "3rem",
                          }}>
                            {item._type === "voyage" ? "✈️" : "🏨"}
                          </div>
                        )}
                        {/* badge réduction */}
                        <span style={{
                          position: "absolute", top: 12, right: 12,
                          background: "#e53935", color: "white",
                          borderRadius: 20, padding: "4px 12px",
                          fontWeight: 700, fontSize: "0.9rem",
                        }}>
                          -{item.promotion.reduction}%
                        </span>
                        {/* badge expiry */}
                        <span style={{
                          position: "absolute", bottom: 12, left: 12,
                          background: urgent ? "#cc0000" : "rgba(0,0,0,0.65)",
                          color: "white", borderRadius: 8,
                          padding: "3px 10px", fontSize: "0.78rem",
                        }}>
                          {urgent ? "🔥" : "⏰"} {jours > 0 ? `${jours} jour${jours > 1 ? "s" : ""}` : "Dernier jour !"}
                        </span>
                      </div>

                      {/* ── BODY ── */}
                      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                        <p style={{ fontWeight: 700, fontSize: "1rem", margin: "0 0 6px", color: "#1a2535" }}>
                          {nom}
                        </p>
                        <p style={{ color: "#6b7a99", fontSize: "0.85rem", margin: "0 0 8px" }}>
                          {item._type === "voyage" ? "✈️ Voyage" : "🏨 Hôtel"} · {item.destination?.nom}, {item.destination?.paye}
                        </p>

                        {/* prix */}
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 14, marginTop: "auto",
                        }}>
                          <div>
                            <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: "0.9rem" }}>
                              {prix} DT
                            </span>
                            <span style={{ color: "#e53935", fontWeight: 800, fontSize: "1.3rem", marginLeft: 8 }}>
                              {item.promotion.prixPromo} DT
                            </span>
                          </div>
                          <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.82rem" }}>
                            -{prix - item.promotion.prixPromo} DT
                          </span>
                        </div>

                        <Button variant="danger" className="w-100 fw-bold"
                          onClick={() => navigate(lien)}>
                          Profiter de l'offre →
                        </Button>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Promotions;