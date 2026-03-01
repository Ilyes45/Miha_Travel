import React from "react";
import { Row, Col } from "react-bootstrap";
import VoyageCard from "../VoyageCard/VoyageCard";

const VoyageList = ({ voyages, featured }) => {
  if (!voyages || voyages.length === 0) {
    return <p className="text-muted">Aucun voyage disponible pour le moment.</p>;
  }

  return (
    <Row className="g-4">
      {voyages.map((v) => (
        <Col key={v._id} md={4} sm={6}>
          <VoyageCard voyage={v} featured={featured} />
        </Col>
      ))}
    </Row>
  );
};

export default VoyageList;