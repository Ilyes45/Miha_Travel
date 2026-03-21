import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllVoyages } from "../../JS/Actions/voyage";
import { getAllHotels } from "../../JS/Actions/hotel";

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);
  const { hotels,  loadHotel  } = useSelector((s) => s.hotelReducer);

  useEffect(() => {
    dispatch(getAllVoyages());
    dispatch(getAllHotels());
  }, [dispatch]);

  const kw = q.toLowerCase().trim();

  const filteredVoyages = voyages.filter((v) =>
    v.title?.toLowerCase().includes(kw) ||
    v.destination?.nom?.toLowerCase().includes(kw) ||
    v.destination?.paye?.toLowerCase().includes(kw)
  );

  const filteredHotels = hotels.filter((h) =>
    h.nom?.toLowerCase().includes(kw) ||
    h.destination?.nom?.toLowerCase().includes(kw) ||
    h.destination?.paye?.toLowerCase().includes(kw)
  );

  const total = filteredVoyages.length + filteredHotels.length;
  const loading = loadVoyage || loadHotel;

  const getImage = (item) => {
    if (item.images?.length > 0 && item.images[0] &&
        !item.images[0].includes("example.com")) return item.images[0];
    if (item.destination?.image) return item.destination.image;
    return null;
  };

  return (
    <div style={{ background: "#fafbfc", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0505, #cc0000)",
        padding: "40px 0", color: "white", textAlign: "center"
      }}>
        <Container>
          <h2 style={{ fontWeight: 800, margin: 0 }}>
            Résultats pour "{q}"
          </h2>
          {!loading && (
            <p style={{ opacity: 0.8, marginTop: 8 }}>
              {total} résultat{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
            </p>
          )}
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: "3rem" }}>🔍</p>
            <h4 style={{ color: "#6b7a99" }}>Aucun résultat pour "{q}"</h4>
            <p style={{ color: "#aaa" }}>Essayez un autre mot-clé</p>
            <button onClick={() => navigate("/accueil")} style={{
              background: "#cc0000", color: "white", border: "none",
              padding: "12px 28px", borderRadius: "8px", fontWeight: 700, cursor: "pointer"
            }}>
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <>
            {/* ── VOYAGES ── */}
            {filteredVoyages.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <h3 style={{ fontWeight: 800, color: "#1a2535", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #f0f0f0" }}>
                  Voyages ({filteredVoyages.length})
                </h3>
                <Row className="g-4">
                  {filteredVoyages.map((v) => {
                    const img = getImage(v);
                    return (
                      <Col md={6} lg={4} key={v._id}>
                        <div onClick={() => navigate(`/voyage/${v._id}`)} style={{
                          background: "white", borderRadius: 14, overflow: "hidden",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          {img ? (
                            <img src={img} alt={v.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                          ) : (
                            <div style={{ height: 180, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>✈️</div>
                          )}
                          <div style={{ padding: 16 }}>
                            <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#1a2535" }}>{v.title}</p>
                            <p style={{ color: "#6b7a99", fontSize: "0.85rem", margin: "0 0 10px" }}>
                              {v.destination?.nom}, {v.destination?.paye}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              {v.promotion?.actif ? (
                                <div>
                                  <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: "0.85rem" }}>{v.price} DT</span>
                                  <span style={{ color: "#e53935", fontWeight: 800, marginLeft: 8 }}>{v.promotion.prixPromo} DT</span>
                                </div>
                              ) : (
                                <span style={{ color: "#cc0000", fontWeight: 800 }}>{v.price} DT</span>
                              )}
                              <span style={{ background: "#fff0f0", color: "#cc0000", borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 600 }}>
                                Voyage
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </section>
            )}

            {/* ── HOTELS ── */}
            {filteredHotels.length > 0 && (
              <section>
                <h3 style={{ fontWeight: 800, color: "#1a2535", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #f0f0f0" }}>
                  Hôtels ({filteredHotels.length})
                </h3>
                <Row className="g-4">
                  {filteredHotels.map((h) => {
                    const img = getImage(h);
                    return (
                      <Col md={6} lg={4} key={h._id}>
                        <div onClick={() => navigate(`/hotel/${h._id}`)} style={{
                          background: "white", borderRadius: 14, overflow: "hidden",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        >
                          {img ? (
                            <img src={img} alt={h.nom} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                          ) : (
                            <div style={{ height: 180, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🏨</div>
                          )}
                          <div style={{ padding: 16 }}>
                            <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#1a2535" }}>{h.nom}</p>
                            <p style={{ color: "#6b7a99", fontSize: "0.85rem", margin: "0 0 10px" }}>
                              {h.destination?.nom}, {h.destination?.paye}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              {h.promotion?.actif ? (
                                <div>
                                  <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: "0.85rem" }}>{h.prix} DT</span>
                                  <span style={{ color: "#e53935", fontWeight: 800, marginLeft: 8 }}>{h.promotion.prixPromo} DT</span>
                                </div>
                              ) : (
                                <span style={{ color: "#cc0000", fontWeight: 800 }}>{h.prix} DT</span>
                              )}
                              <span style={{ background: "#fff0f0", color: "#cc0000", borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 600 }}>
                                Hôtel
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </section>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Search;