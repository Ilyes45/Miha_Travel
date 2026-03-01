import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VoyageCard = ({ voyage, featured }) => {
  const navigate = useNavigate();

  const getImage = () => {
    if (
      voyage.images &&
      voyage.images.length > 0 &&
      voyage.images[0] &&
      !voyage.images[0].includes("example.com") &&
      !voyage.images[0].includes("placeholder")
    ) {
      return voyage.images[0];
    }
    if (voyage.destination?.image) return voyage.destination.image;
    return null;
  };

  const image = getImage();

  const nbrJours = () => {
    const dep = new Date(voyage.departureDate);
    const ret = new Date(voyage.returnDate);
    return Math.ceil((ret - dep) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card
      className="h-100 shadow-sm voyage-card"
      style={{ border: featured ? "2px solid #f0ad4e" : "1px solid #dee2e6" }}
    >
      <div style={{ position: "relative" }}>
        {image ? (
          <Card.Img variant="top" src={image} alt={voyage.title} className="voyage-card-img" />
        ) : (
          <div className="voyage-card-no-img"><span>✈️</span></div>
        )}
        {featured && (
          <Badge bg="warning" text="dark" className="voyage-card-badge-featured">⭐ Featured</Badge>
        )}
        <Badge bg="primary" className="voyage-card-badge-jours">{nbrJours()} jours</Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{voyage.title}</Card.Title>
        {voyage.destination && (
          <p className="voyage-card-meta">📍 {voyage.destination.nom} — {voyage.destination.paye}</p>
        )}
        <p className="voyage-card-meta">
          🗓️ {new Date(voyage.departureDate).toLocaleDateString("fr-FR")} →{" "}
          {new Date(voyage.returnDate).toLocaleDateString("fr-FR")}
        </p>
        {voyage.description && (
          <p className="voyage-card-description" style={{ flexGrow: 1 }}>
            {voyage.description.slice(0, 80)}...
          </p>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="voyage-card-price">{voyage.price} TND</span>
          <Button
            variant={featured ? "warning" : "primary"}
            size="sm"
            onClick={() => navigate(`/voyage/${voyage._id}`)}  // ← navigate ajouté
          >
            Voir détails
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VoyageCard;