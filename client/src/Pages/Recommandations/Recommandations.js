import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

export default function Recommandations() {
  const { isAuth } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [voyages, setVoyages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [aiPowered, setAiPowered] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const config = {
          headers: { authorization: localStorage.getItem("token") },
        };
        const { data } = await axios.get("/api/recommendations", config);
        setVoyages(data.voyages);
        setHotels(data.hotels);
        setReason(data.reason);
        setAiPowered(data.aiPowered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuth, navigate]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1">✨ Recommandations pour vous</h2>
      <p className="text-muted mb-3">Sélectionnés selon vos préférences et réservations</p>

      {reason && (
        <div className={`alert ${aiPowered ? "alert-primary" : "alert-secondary"} mb-5`}>
          {aiPowered ? "🤖 " : "📋 "}{reason}
        </div>
      )}

      {/* Voyages */}
      <h4 className="fw-semibold mb-3">✈️ Voyages suggérés</h4>
      {voyages.length === 0 ? (
        <p className="text-muted">Aucun voyage recommandé pour le moment.</p>
      ) : (
        <div className="row g-4 mb-5">
          {voyages.map((v) => (
            <div key={v._id} className="col-md-4">
              <div className="card h-100 shadow-sm border-0" style={{ borderRadius: 16 }}>
                {v.image && (
                  <img
                    src={v.image}
                    alt={v.title}
                    className="card-img-top"
                    style={{ height: 180, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                  />
                )}
                <div className="card-body">
                  <h6 className="fw-bold">{v.title}</h6>
                  <p className="text-muted small mb-1">📍 {v.destination?.nom}</p>
                  <p className="text-muted small mb-2">
                    📅 {new Date(v.departureDate).toLocaleDateString("fr-FR")}
                  </p>
                  {v.promotion?.actif ? (
                    <p className="mb-0">
                      <span className="text-decoration-line-through text-muted me-2">{v.price} TND</span>
                      <span className="text-danger fw-bold">{v.promotion.prixPromo} TND</span>
                      <span className="badge bg-danger ms-2">-{v.promotion.reduction}%</span>
                    </p>
                  ) : (
                    <p className="fw-bold text-primary mb-0">{v.price} TND</p>
                  )}
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                  <Link to={`/voyage/${v._id}`} className="btn btn-primary btn-sm w-100">
                    Voir le voyage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hôtels */}
      <h4 className="fw-semibold mb-3">🏨 Hôtels suggérés</h4>
      {hotels.length === 0 ? (
        <p className="text-muted">Aucun hôtel recommandé pour le moment.</p>
      ) : (
        <div className="row g-4">
          {hotels.map((h) => (
            <div key={h._id} className="col-md-4">
              <div className="card h-100 shadow-sm border-0" style={{ borderRadius: 16 }}>
                {h.image && (
                  <img
                    src={h.image}
                    alt={h.nom}
                    className="card-img-top"
                    style={{ height: 180, objectFit: "cover", borderRadius: "16px 16px 0 0" }}
                  />
                )}
                <div className="card-body">
                  <h6 className="fw-bold">{h.nom}</h6>
                  <p className="text-muted small mb-1">📍 {h.destination?.nom}</p>
                  <p className="text-muted small mb-2">{"⭐".repeat(h.etoiles)}</p>
                  <p className="fw-bold text-primary mb-0">À partir de {h.prix} TND/nuit</p>
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                  <Link to={`/hotel/${h._id}`} className="btn btn-primary btn-sm w-100">
                    Voir l'hôtel
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}