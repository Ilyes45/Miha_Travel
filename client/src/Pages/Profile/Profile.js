import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Badge, Button, Spinner, Card } from "react-bootstrap";
import { getMyReservations, cancelMyReservation } from "../../JS/Actions/reservation";
import "./Profile.css";

const statutBadge = (statut) => {
  if (statut === "en_attente") return <Badge bg="warning" text="dark">⏳ En attente</Badge>;
  if (statut === "confirmee")  return <Badge bg="success">✅ Confirmée</Badge>;
  if (statut === "annulee")    return <Badge bg="danger">❌ Annulée</Badge>;
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.userReducer);
  const { myReservations, loadReservation } = useSelector((s) => s.reservationReducer);

  useEffect(() => {
    dispatch(getMyReservations());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      dispatch(cancelMyReservation(id));
    }
  };

  return (
    <div>
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="profile-header">
        <Container>
          <div className="profile-avatar">{user?.nom?.charAt(0).toUpperCase()}</div>
          <h2 className="fw-bold mt-3 mb-1">{user?.nom}</h2>
          <p className="mb-0 opacity-75">✉️ {user?.email}</p>
        </Container>
      </div>

      <Container className="py-5">
        <h3 className="fw-bold mb-4">📋 Mes réservations</h3>

        {loadReservation ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : myReservations.length === 0 ? (
          <div className="profile-empty">
            <div style={{ fontSize: "3rem" }}>🗓️</div>
            <p className="mt-3 text-muted">Aucune réservation pour le moment.</p>
          </div>
        ) : (
          <Row className="g-4">
            {myReservations.map((r) => {
              const nom = r.type === "voyage" ? r.voyage?.title : r.hotel?.nom;
              const dest = r.type === "voyage" ? r.voyage?.destination : r.hotel?.destination;
              const prix = r.type === "voyage" ? r.voyage?.price : r.hotel?.prix;
              const emoji = r.type === "voyage" ? "✈️" : "🏨";

              return (
                <Col md={6} key={r._id}>
                  <Card className="profile-resa-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <span className="me-2" style={{ fontSize: "1.4rem" }}>{emoji}</span>
                          <span className="fw-bold fs-5">{nom}</span>
                        </div>
                        {statutBadge(r.statut)}
                      </div>

                      {dest && (
                        <p className="text-muted mb-2">
                          📍 {dest.nom} — {dest.paye}
                        </p>
                      )}

                      <Row className="g-2 mb-3">
                        <Col xs={6}>
                          <div className="profile-resa-info">
                            <small className="text-muted d-block">Du</small>
                            <span className="fw-bold">
                              {new Date(r.dateDebut).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="profile-resa-info">
                            <small className="text-muted d-block">Au</small>
                            <span className="fw-bold">
                              {new Date(r.dateFin).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="profile-resa-info">
                            <small className="text-muted d-block">Personnes</small>
                            <span className="fw-bold">{r.nombrePersonnes}</span>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="profile-resa-info">
                            <small className="text-muted d-block">Prix total</small>
                            <span className="fw-bold text-primary">{r.prixTotal} TND</span>
                          </div>
                        </Col>
                      </Row>

                      {r.message && (
                        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                          💬 {r.message}
                        </p>
                      )}

                      {r.statut === "en_attente" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="w-100 mt-2"
                          onClick={() => handleCancel(r._id)}
                        >
                          ❌ Annuler
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Profile;