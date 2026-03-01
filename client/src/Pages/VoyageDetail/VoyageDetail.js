import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { getOneVoyage } from "../../JS/Actions/voyage";
import ReservationModal from "../../Components/ReservationModal/ReservationModal";
import "./VoyageDetail.css";

const VoyageDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voyage, loadVoyage } = useSelector((s) => s.voyageReducer);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getOneVoyage(id));
  }, [dispatch, id]);

  const nbrJours = () => {
    if (!voyage) return 0;
    const dep = new Date(voyage.departureDate);
    const ret = new Date(voyage.returnDate);
    return Math.ceil((ret - dep) / (1000 * 60 * 60 * 24));
  };

  const getImages = () => {
    const imgs = [];
    if (voyage?.images?.length > 0) {
      imgs.push(...voyage.images.filter(i =>
        i && !i.includes("example.com") && !i.includes("placeholder")
      ));
    }
    if (imgs.length === 0 && voyage?.destination?.image) {
      imgs.push(voyage.destination.image);
    }
    return imgs;
  };

  if (loadVoyage) return (
    <div className="text-center py-5 mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (!voyage) return (
    <div className="text-center py-5">
      <p>Voyage non trouvé.</p>
      <Button onClick={() => navigate("/voyage")}>Retour</Button>
    </div>
  );

  const images = getImages();

  const renderGallery = () => {
    if (images.length === 0) return <div className="voyage-no-image">✈️</div>;
    if (images.length === 1) return (
      <div className="gallery-single"><img src={images[0]} alt={voyage.title} /></div>
    );
    const main = images[0];
    const secondary = images.slice(1, 3);
    const remaining = images.length - 3;
    return (
      <div className="gallery-wrapper">
        <div className="gallery-main"><img src={main} alt={voyage.title} /></div>
        {secondary.map((img, i) => (
          <div key={i} className="gallery-secondary">
            <img src={img} alt={`${voyage.title} ${i + 2}`} />
            {i === 1 && remaining > 0 && <div className="gallery-overlay">+{remaining}</div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Container className="py-4">
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <h1 className="fw-bold mb-0">{voyage.title}</h1>
          {voyage.isFeatured && <Badge bg="warning" text="dark">⭐ Featured</Badge>}
        </div>
        {voyage.destination && (
          <p className="text-muted fs-5 mb-4">📍 {voyage.destination.nom} — {voyage.destination.paye}</p>
        )}

        {renderGallery()}

        <Row>
          <Col md={8}>
            <Row className="mb-4 g-3">
              <Col sm={4}>
                <div className="voyage-stat">
                  <div className="stat-value">{nbrJours()}</div>
                  <div className="stat-label">Jours</div>
                </div>
              </Col>
              <Col sm={4}>
                <div className="voyage-stat">
                  <div className="stat-value green">{new Date(voyage.departureDate).toLocaleDateString("fr-FR")}</div>
                  <div className="stat-label">🛫 Départ</div>
                </div>
              </Col>
              <Col sm={4}>
                <div className="voyage-stat">
                  <div className="stat-value red">{new Date(voyage.returnDate).toLocaleDateString("fr-FR")}</div>
                  <div className="stat-label">🛬 Retour</div>
                </div>
              </Col>
            </Row>
            {voyage.description && (
              <>
                <h4 className="fw-bold">📋 Description</h4>
                <p className="voyage-description">{voyage.description}</p>
              </>
            )}
            {voyage.destination?.description && (
              <>
                <h4 className="fw-bold mt-4">🌍 À propos de {voyage.destination.nom}</h4>
                <p className="voyage-description">{voyage.destination.description}</p>
              </>
            )}
          </Col>

          <Col md={4}>
            <div className="voyage-sidebar">
              <h4 className="fw-bold mb-4 text-center">Réserver ce voyage</h4>
              <div className="sidebar-row">
                <span>Prix / personne</span>
                <span className="fw-bold text-primary">{voyage.price} TND</span>
              </div>
              <div className="sidebar-row">
                <span>Durée</span>
                <span className="fw-bold">{nbrJours()} jours</span>
              </div>
              <div className="sidebar-row">
                <span>🛫 Départ</span>
                <span>{new Date(voyage.departureDate).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="sidebar-row">
                <span>🛬 Retour</span>
                <span>{new Date(voyage.returnDate).toLocaleDateString("fr-FR")}</span>
              </div>
              <hr />
              <div className="text-center mb-4">
                <div className="price-main">{voyage.price} TND</div>
                <small className="text-muted">par personne</small>
              </div>
              <Button variant="warning" size="lg" className="w-100 fw-bold mb-3" onClick={() => setShowModal(true)}>
                🎫 Réserver maintenant
              </Button>
              <Button variant="outline-secondary" className="w-100" onClick={() => navigate(-1)}>
                ← Retour
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* MODAL RESERVATION */}
      {voyage && (
        <ReservationModal
          show={showModal}
          onHide={() => setShowModal(false)}
          type="voyage"
          item={voyage}
        />
      )}
    </div>
  );
};

export default VoyageDetail;