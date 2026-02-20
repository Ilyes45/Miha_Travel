import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const AdminStats = ({ destinations, voyages }) => {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card bg="primary" text="white" className="text-center p-3">
          <h3>{destinations.length}</h3>
          <p className="mb-0">Destinations</p>
        </Card>
      </Col>
      <Col md={3}>
        <Card bg="success" text="white" className="text-center p-3">
          <h3>{voyages.length}</h3>
          <p className="mb-0">Voyages</p>
        </Card>
      </Col>
      <Col md={3}>
        <Card bg="warning" text="white" className="text-center p-3">
          <h3>{destinations.filter((d) => d.isFeatured).length}</h3>
          <p className="mb-0">Destinations Featured</p>
        </Card>
      </Col>
      <Col md={3}>
        <Card bg="info" text="white" className="text-center p-3">
          <h3>{voyages.filter((v) => v.isFeatured).length}</h3>
          <p className="mb-0">Voyages Featured</p>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminStats;