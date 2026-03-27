import React from "react";
import { Col, Button } from "react-bootstrap";

const getImage = (item) => {
  if (
    item.images?.length > 0 && item.images[0] &&
    !item.images[0].includes("example.com") &&
    !item.images[0].includes("placeholder")
  ) return item.images[0];
  if (item.destination?.image) return item.destination.image;
  return null;
};

const PromoCard = ({ item, onNavigate }) => {
  const nom       = item._type === "voyage" ? item.title : item.nom;
  const prix      = item._type === "voyage" ? item.price : item.prix;
  const image     = getImage(item);
  const expDate   = new Date(item.promotion.dateExpiration);
  const jours     = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
  const lien      = item._type === "voyage" ? `/voyage/${item._id}` : `/hotel/${item._id}`;
  const typeLabel = item._type === "voyage" ? "Voyage" : "Hôtel";

  return (
    <Col md={6} lg={4} className="d-flex">
      <div className="promo-card">

        {/* Image */}
        <div className="promo-card-img-wrap">
          {image ? (
            <img src={image} alt={nom} className="promo-card-img"
              onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <div className="promo-card-img-placeholder">{typeLabel}</div>
          )}
          <span className="promo-badge-reduction">-{item.promotion.reduction}%</span>
          <span className="promo-badge-expiry">
            {jours > 0 ? `${jours} jour${jours > 1 ? "s" : ""}` : "Dernier jour !"}
          </span>
        </div>

        {/* Body */}
        <div className="promo-card-body">
          <p className="promo-card-title">{nom}</p>
          <p className="promo-card-dest">{typeLabel} · {item.destination?.nom}</p>
          <div className="promo-card-prix">
            <div>
              <span className="promo-prix-barre">{prix} DT</span>
              <span className="promo-prix-promo">{item.promotion.prixPromo} DT</span>
            </div>
            <span className="promo-economie">-{prix - item.promotion.prixPromo} DT</span>
          </div>
          <Button variant="danger" className="w-100 fw-bold" onClick={() => onNavigate(lien)}>
            Profiter de l'offre
          </Button>
        </div>

      </div>
    </Col>
  );
};

export default PromoCard;