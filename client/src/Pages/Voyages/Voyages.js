import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { getAllVoyages } from "../../JS/Actions/voyage";
import VoyageList from "../../Components//VoyageList/VoyageList";

const Voyages = () => {
  const dispatch = useDispatch();
  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);

  const [search, setSearch] = useState("");
  const [filterPays, setFilterPays] = useState("");

  useEffect(() => {
    dispatch(getAllVoyages());
  }, [dispatch]);

  // liste des pays uniques
  const pays = [...new Set(voyages.map((v) => v.destination?.paye).filter(Boolean))];

  // filtrage
  const filtered = voyages.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.destination?.nom.toLowerCase().includes(search.toLowerCase());
    const matchPays = filterPays ? v.destination?.paye === filterPays : true;
    return matchSearch && matchPays;
  });

  return (
    <div>
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a6b8a 0%, #0d3b4f 100%)",
          color: "white",
          padding: "50px 0",
          textAlign: "center",
        }}
      >
        <Container>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>🌍 Nos Voyages</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
            Trouvez le voyage de vos rêves
          </p>
        </Container>
      </div>

      <Container className="py-5">

        {/* ─── FILTRES ──────────────────────────────────────── */}
        <Row className="mb-4 g-3">
          <Col md={6}>
            <Form.Control
              placeholder="🔍 Rechercher un voyage ou destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterPays}
              onChange={(e) => setFilterPays(e.target.value)}
            >
              <option value="">🌐 Tous les pays</option>
              {pays.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex align-items-center">
            <span className="text-muted">
              {filtered.length} voyage{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </span>
          </Col>
        </Row>

        {/* ─── LISTE ────────────────────────────────────────── */}
        {loadVoyage ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <VoyageList voyages={filtered} />
        )}

      </Container>
    </div>
  );
};

export default Voyages;