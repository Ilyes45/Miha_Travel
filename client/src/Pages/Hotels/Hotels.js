import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Spinner } from "react-bootstrap";
import { getAllHotels } from "../../JS/Actions/hotel";
import HotelList from "../../Components/HotelList/HotelList";
import "./Hotels.css";

const Hotels = () => {
  const dispatch = useDispatch();
  const { hotels, loadHotel } = useSelector((s) => s.hotelReducer);

  const [search,        setSearch]        = useState("");
  const [filterEtoiles, setFilterEtoiles] = useState("");
  const [filterPays,    setFilterPays]    = useState("");

  useEffect(() => {
    dispatch(getAllHotels());
  }, [dispatch]);

  const pays = [...new Set(hotels.map((h) => h.destination?.paye).filter(Boolean))];

  const filtered = hotels.filter((h) => {
    const matchSearch =
      h.nom?.toLowerCase().includes(search.toLowerCase()) ||
      h.destination?.nom?.toLowerCase().includes(search.toLowerCase());
    const matchEtoiles = filterEtoiles ? h.etoiles === parseInt(filterEtoiles) : true;
    const matchPays    = filterPays    ? h.destination?.paye === filterPays    : true;
    return matchSearch && matchEtoiles && matchPays;
  });

  const hasFilter = filterPays || filterEtoiles || search;

  return (
    <div className="page-wrapper">

      {/* ── HEADER ── */}
      <div className="page-header hotels-header">
        <div className="page-header-overlay" />
        <Container className="page-header-content">
          <p className="page-header-tag">Miha Travel</p>
          <h1 className="page-header-title">Nos Hôtels</h1>
          <p className="page-header-sub">Trouvez l'hôtel parfait pour votre séjour</p>
        </Container>
      </div>

      <Container className="py-5">

        {/* ── FILTRES ── */}
        <div className="filters-bar">
          <div className="filters-left">
            <input
              type="text"
              className="filter-input"
              placeholder="Rechercher un hôtel, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="filter-select" value={filterPays} onChange={(e) => setFilterPays(e.target.value)}>
              <option value="">Tous les pays</option>
              {pays.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select className="filter-select" value={filterEtoiles} onChange={(e) => setFilterEtoiles(e.target.value)}>
              <option value="">Toutes les étoiles</option>
              {[1,2,3,4,5].map((n) => (
                <option key={n} value={n}>{"★".repeat(n)}</option>
              ))}
            </select>
          </div>
          <div className="filters-right">
            <span className="filter-count">
              {filtered.length} hôtel{filtered.length > 1 ? "s" : ""}
            </span>
            {hasFilter && (
              <button className="filter-clear" onClick={() => {
                setSearch(""); setFilterPays(""); setFilterEtoiles("");
              }}>
                Effacer les filtres
              </button>
            )}
          </div>
        </div>

        {/* ── LISTE ── */}
        {loadHotel ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">🏨</p>
            <h4>Aucun hôtel trouvé</h4>
            <p>Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <HotelList hotels={filtered} />
        )}

      </Container>
    </div>
  );
};

export default Hotels;