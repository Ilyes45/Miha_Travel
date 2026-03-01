import React from "react";
import { Row, Col } from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";

const HotelList = ({ hotels, featured }) => {
  if (!hotels || hotels.length === 0) {
    return <p className="text-muted">Aucun hôtel disponible pour le moment.</p>;
  }

  return (
    <Row className="g-4">
      {hotels.map((h) => (
        <Col key={h._id} md={4} sm={6}>
          <HotelCard hotel={h} featured={featured} />
        </Col>
      ))}
    </Row>
  );
};

export default HotelList;