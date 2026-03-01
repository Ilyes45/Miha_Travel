import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const AdminStats = ({ destinations, voyages, hotels, reservations }) => {
  const enAttente = reservations?.filter((r) => r.statut === "en_attente").length || 0;
  const confirmees = reservations?.filter((r) => r.statut === "confirmee").length || 0;

  return (
    <Row className="mb-4 g-3">
      <Col md={2}>
        <Card bg="primary" text="white" className="text-center p-3">
          <h3>{destinations.length}</h3>
          <p className="mb-0">Destinations</p>
        </Card>
      </Col>
      <Col md={2}>
        <Card bg="success" text="white" className="text-center p-3">
          <h3>{voyages.length}</h3>
          <p className="mb-0">Voyages</p>
        </Card>
      </Col>
      <Col md={2}>
        <Card bg="info" text="white" className="text-center p-3">
          <h3>{hotels.length}</h3>
          <p className="mb-0">Hôtels</p>
        </Card>
      </Col>
      <Col md={2}>
        <Card bg="secondary" text="white" className="text-center p-3">
          <h3>{reservations?.length || 0}</h3>
          <p className="mb-0">Réservations</p>
        </Card>
      </Col>
      <Col md={2}>
        <Card bg="warning" text="white" className="text-center p-3">
          <h3>{enAttente}</h3>
          <p className="mb-0">En attente</p>
        </Card>
      </Col>
      <Col md={2}>
        <Card bg="dark" text="white" className="text-center p-3">
          <h3>{confirmees}</h3>
          <p className="mb-0">Confirmées</p>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminStats;