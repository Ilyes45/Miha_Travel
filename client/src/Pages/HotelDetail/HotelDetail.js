import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { getOneHotel } from "../../JS/Actions/hotel";
import ReservationModal from "../../Components/ReservationModal/ReservationModal";
import "./HotelDetail.css";

const HotelDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotel, loadHotel } = useSelector((s) => s.hotelReducer);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getOneHotel(id));
  }, [dispatch, id]);

  const getImages = () => {
    const imgs = [];
    if (hotel?.images?.length > 0) {
      imgs.push(...hotel.images.filter(i =>
        i && !i.includes("example.com") && !i.includes("placeholder")
      ));
    }
    if (imgs.length === 0 && hotel?.destination?.image) {
      imgs.push(hotel.destination.image);
    }
    return imgs;
  };

  if (loadHotel) return (
    <div className="text-center py-5 mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (!hotel) return (
    <div className="text-center py-5">
      <p>Hôtel non trouvé.</p>
      <Button onClick={() => navigate("/hotel")}>Retour</Button>
    </div>
  );

  const images = getImages();

  const renderGallery = () => {
    if (images.length === 0) return <div className="hotel-no-image">🏨</div>;
    if (images.length === 1) return (
      <div className="hotel-gallery-single"><img src={images[0]} alt={hotel.nom} /></div>
    );
    const main = images[0];
    const secondary = images.slice(1, 3);
    const remaining = images.length - 3;
    return (
      <div className="hotel-gallery-wrapper">
        <div className="hotel-gallery-main"><img src={main} alt={hotel.nom} /></div>
        {secondary.map((img, i) => (
          <div key={i} className="hotel-gallery-secondary">
            <img src={img} alt={`${hotel.nom} ${i + 2}`} />
            {i === 1 && remaining > 0 && <div className="hotel-gallery-overlay">+{remaining}</div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Container className="py-4">
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <h1 className="fw-bold mb-0">{hotel.nom}</h1>
          <span className="hotel-etoiles">{"⭐".repeat(hotel.etoiles)}</span>
          {hotel.isFeatured && <Badge bg="warning" text="dark">Featured</Badge>}
        </div>
        {hotel.destination && (
          <p className="text-muted fs-5 mb-1">📍 {hotel.destination.nom} — {hotel.destination.paye}</p>
        )}
        {hotel.adresse && <p className="text-muted mb-4">🏠 {hotel.adresse}</p>}

        {renderGallery()}

        <Row>
          <Col md={8}>
            {hotel.description && (
              <>
                <h4 className="fw-bold">📋 Description</h4>
                <p className="hotel-description">{hotel.description}</p>
              </>
            )}
            {hotel.destination?.description && (
              <>
                <h4 className="fw-bold mt-4">🌍 À propos de {hotel.destination.nom}</h4>
                <p className="hotel-description">{hotel.destination.description}</p>
              </>
            )}
          </Col>

          <Col md={4}>
            <div className="hotel-sidebar">
              <h4 className="fw-bold mb-4 text-center">Réserver cet hôtel</h4>
              <div className="sidebar-row">
                <span>Classement</span>
                <span>{"⭐".repeat(hotel.etoiles)}</span>
              </div>
              <div className="sidebar-row">
                <span>Destination</span>
                <span className="fw-bold">{hotel.destination?.nom || "—"}</span>
              </div>
              <div className="sidebar-row">
                <span>Prix / nuit</span>
                <span className="fw-bold text-primary">{hotel.prix} TND</span>
              </div>
              <hr />
              <div className="text-center mb-4">
                <div className="price-main">{hotel.prix} TND</div>
                <small className="text-muted">par nuit</small>
              </div>
              <Button variant="warning" size="lg" className="w-100 fw-bold mb-3" onClick={() => setShowModal(true)}>
                🛎️ Réserver maintenant
              </Button>
              <Button variant="outline-secondary" className="w-100" onClick={() => navigate(-1)}>
                ← Retour
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* MODAL RESERVATION */}
      {hotel && (
        <ReservationModal
          show={showModal}
          onHide={() => setShowModal(false)}
          type="hotel"
          item={hotel}
        />
      )}
    </div>
  );
};

export default HotelDetail;