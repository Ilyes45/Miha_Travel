import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { getAllHotels } from "../../JS/Actions/hotel";
import HotelList from "../../Components//HotelList/HotelList";

const Hotels = () => {
  const dispatch = useDispatch();
  const { hotels, loadHotel } = useSelector((s) => s.hotelReducer);

  const [search, setSearch] = useState("");
  const [filterEtoiles, setFilterEtoiles] = useState("");
  const [filterPays, setFilterPays] = useState("");

  useEffect(() => {
    dispatch(getAllHotels());
  }, [dispatch]);

  // pays uniques
  const pays = [...new Set(hotels.map((h) => h.destination?.paye).filter(Boolean))];

  // filtrage
  const filtered = hotels.filter((h) => {
    const matchSearch =
      h.nom.toLowerCase().includes(search.toLowerCase()) ||
      h.destination?.nom.toLowerCase().includes(search.toLowerCase());
    const matchEtoiles = filterEtoiles ? h.etoiles === parseInt(filterEtoiles) : true;
    const matchPays = filterPays ? h.destination?.paye === filterPays : true;
    return matchSearch && matchEtoiles && matchPays;
  });

  return (
    <div>
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #8a2be2 0%, #4b0082 100%)",
          color: "white",
          padding: "50px 0",
          textAlign: "center",
        }}
      >
        <Container>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>🏨 Nos Hôtels</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
            Trouvez l'hôtel parfait pour votre séjour
          </p>
        </Container>
      </div>

      <Container className="py-5">

        {/* ─── FILTRES ──────────────────────────────────────── */}
        <Row className="mb-4 g-3">
          <Col md={5}>
            <Form.Control
              placeholder="🔍 Rechercher un hôtel ou destination..."
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
          <Col md={2}>
            <Form.Select
              value={filterEtoiles}
              onChange={(e) => setFilterEtoiles(e.target.value)}
            >
              <option value="">⭐ Étoiles</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{"⭐".repeat(n)}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2} className="d-flex align-items-center">
            <span className="text-muted">
              {filtered.length} hôtel{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </span>
          </Col>
        </Row>

        {/* ─── LISTE ────────────────────────────────────────── */}
        {loadHotel ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <HotelList hotels={filtered} />
        )}

      </Container>
    </div>
  );
};

export default Hotels;