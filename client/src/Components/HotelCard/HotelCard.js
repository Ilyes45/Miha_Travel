import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel, featured }) => {
  const navigate = useNavigate();

  const getImage = () => {
    if (
      hotel.images && hotel.images.length > 0 && hotel.images[0] &&
      !hotel.images[0].includes("example.com") &&
      !hotel.images[0].includes("placeholder")
    ) return hotel.images[0];
    if (hotel.destination?.image) return hotel.destination.image;
    return null;
  };

  const image = getImage();
  const renderEtoiles = (nb) => "⭐".repeat(nb);

  return (
    <Card
      className="h-100 shadow-sm"
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: featured ? "2px solid #f0ad4e" : "1px solid #dee2e6",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ position: "relative" }}>
        {image ? (
          <Card.Img variant="top" src={image} alt={hotel.nom} style={{ height: 200, objectFit: "cover" }} />
        ) : (
          <div style={{
            height: 200,
            background: "linear-gradient(135deg, #8a2be2, #4b0082)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem"
          }}>🏨</div>
        )}
        {featured && (
          <Badge bg="warning" text="dark" style={{ position: "absolute", top: 10, left: 10, fontSize: "0.85rem" }}>
            ⭐ Featured
          </Badge>
        )}
        <Badge bg="dark" style={{ position: "absolute", top: 10, right: 10, fontSize: "0.85rem" }}>
          {renderEtoiles(hotel.etoiles)}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{hotel.nom}</Card.Title>
        {hotel.destination && (
          <p className="text-muted mb-1">📍 {hotel.destination.nom} — {hotel.destination.paye}</p>
        )}
        {hotel.adresse && (
          <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>🏠 {hotel.adresse}</p>
        )}
        {hotel.description && (
          <p className="text-muted" style={{ fontSize: "0.9rem", flexGrow: 1 }}>
            {hotel.description.slice(0, 80)}...
          </p>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold fs-5 text-primary">
            {hotel.prix} TND <small style={{ fontSize: "0.75rem", color: "#6c757d" }}>/nuit</small>
          </span>
          <Button
            variant={featured ? "warning" : "primary"}
            size="sm"
            onClick={() => navigate(`/hotel/${hotel._id}`)}  // ← navigate ajouté
          >
            Voir détails
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;