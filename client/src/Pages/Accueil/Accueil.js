import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { getAllVoyages } from "../../JS/Actions/voyage";

const Accueil = () => {
  const dispatch = useDispatch();
  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);

  useEffect(() => {
    dispatch(getAllVoyages());
  }, [dispatch]);

  const featuredVoyages = voyages.filter((v) => v.isFeatured);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a6b8a 0%, #0d3b4f 100%)",
          color: "white",
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <Container>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>✈️ Miha Travel</h1>
          <p style={{ fontSize: "1.3rem", opacity: 0.85 }}>
            Découvrez les plus belles destinations du monde
          </p>
          <Button variant="warning" size="lg" className="mt-3 fw-bold">
            Explorer les voyages
          </Button>
        </Container>
      </div>

      <Container className="py-5">

        {/* ─── LOADING ───────────────────────────────────────── */}
        {loadVoyage && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {!loadVoyage && (
          <>
            {/* ─── VOYAGES FEATURED ────────────────────────── */}
            {featuredVoyages.length > 0 && (
              <>
                <h2 className="mb-4 fw-bold">⭐ Voyages à la une</h2>
                <Row className="g-4 mb-5">
                  {featuredVoyages.map((v) => (
                    <Col key={v._id} md={4}>
                      <VoyageCard voyage={v} featured />
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* ─── TOUS LES VOYAGES ────────────────────────── */}
            <h2 className="mb-4 fw-bold">🌍 Tous nos voyages</h2>
            {voyages.length === 0 ? (
              <p className="text-muted">Aucun voyage disponible pour le moment.</p>
            ) : (
              <Row className="g-4">
                {voyages.map((v) => (
                  <Col key={v._id} md={4} sm={6}>
                    <VoyageCard voyage={v} />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

// ─── VOYAGE CARD ───────────────────────────────────────────────
const VoyageCard = ({ voyage, featured }) => {

  // Priorité : image voyage cloudinary → image destination cloudinary → null
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
    if (voyage.destination?.image) {
      return voyage.destination.image;
    }
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
      {/* ─── IMAGE ─────────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        {image ? (
          <Card.Img
            variant="top"
            src={image}
            alt={voyage.title}
            style={{ height: 200, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              height: 200,
              background: "linear-gradient(135deg, #1a6b8a, #0d3b4f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "4rem" }}>✈️</span>
          </div>
        )}

        {featured && (
          <Badge
            bg="warning"
            text="dark"
            style={{ position: "absolute", top: 10, left: 10, fontSize: "0.85rem" }}
          >
            ⭐ Featured
          </Badge>
        )}
        <Badge
          bg="primary"
          style={{ position: "absolute", top: 10, right: 10, fontSize: "0.85rem" }}
        >
          {nbrJours()} jours
        </Badge>
      </div>

      {/* ─── BODY ──────────────────────────────────────────── */}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold">{voyage.title}</Card.Title>

        {voyage.destination && (
          <p className="text-muted mb-1">
            📍 {voyage.destination.nom} — {voyage.destination.paye}
          </p>
        )}

        <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
          🗓️ {new Date(voyage.departureDate).toLocaleDateString("fr-FR")} →{" "}
          {new Date(voyage.returnDate).toLocaleDateString("fr-FR")}
        </p>

        {voyage.description && (
          <p className="text-muted" style={{ fontSize: "0.9rem", flexGrow: 1 }}>
            {voyage.description.slice(0, 80)}...
          </p>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold fs-5 text-primary">{voyage.price} TND</span>
          <Button variant={featured ? "warning" : "primary"} size="sm">
            Voir détails
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Accueil;