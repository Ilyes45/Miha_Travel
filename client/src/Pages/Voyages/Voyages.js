import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { getAllVoyages } from "../../JS/Actions/voyage";
import VoyageList from "../../Components/VoyageList/VoyageList";
import "./Voyages.css";

const Voyages = () => {
  const dispatch = useDispatch();
  const { voyages, loadVoyage } = useSelector((s) => s.voyageReducer);
  const [searchParams] = useSearchParams();

  const [search,     setSearch]     = useState("");
  const [filterPays, setFilterPays] = useState("");
  const [filterDest, setFilterDest] = useState("");

  useEffect(() => {
    dispatch(getAllVoyages());
  }, [dispatch]);

  const destIdFromUrl = searchParams.get("destination");

  useEffect(() => {
    if (destIdFromUrl && voyages.length > 0) {
      const dest = voyages.find(v => v.destination?._id === destIdFromUrl)?.destination;
      if (dest) {
        setFilterDest(destIdFromUrl);
        setFilterPays(dest.paye);
      }
    }
  }, [destIdFromUrl, voyages]);

  const pays = [...new Set(voyages.map((v) => v.destination?.paye).filter(Boolean))];

  const destinations = filterPays
    ? [...new Map(
        voyages
          .filter(v => v.destination?.paye === filterPays)
          .map(v => [v.destination?._id, v.destination])
      ).values()]
    : [];

  const handlePaysChange = (e) => {
    setFilterPays(e.target.value);
    setFilterDest("");
  };

  const filtered = voyages.filter((v) => {
    const matchSearch =
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.destination?.nom?.toLowerCase().includes(search.toLowerCase());
    const matchPays = filterPays ? v.destination?.paye === filterPays : true;
    const matchDest = filterDest ? v.destination?._id === filterDest : true;
    return matchSearch && matchPays && matchDest;
  });

  const hasFilter = filterPays || filterDest || search;

  return (
    <div className="page-wrapper">

      {/* ── HEADER ── */}
      <div className="page-header">
        <div className="page-header-overlay" />
        <Container className="page-header-content">
          <p className="page-header-tag">Miha Travel</p>
          <h1 className="page-header-title">Nos Voyages</h1>
          <p className="page-header-sub">Trouvez le voyage de vos rêves</p>
        </Container>
      </div>

      <Container className="py-5">

        {/* ── FILTRES ── */}
        <div className="filters-bar">
          <div className="filters-left">
            <input
              type="text"
              className="filter-input"
              placeholder="Rechercher un voyage, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="filter-select" value={filterPays} onChange={handlePaysChange}>
              <option value="">Tous les pays</option>
              {pays.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {filterPays && destinations.length > 0 && (
              <select className="filter-select" value={filterDest} onChange={(e) => setFilterDest(e.target.value)}>
                <option value="">Toutes les destinations</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.nom}</option>
                ))}
              </select>
            )}
          </div>
          <div className="filters-right">
            <span className="filter-count">
              {filtered.length} voyage{filtered.length > 1 ? "s" : ""}
            </span>
            {hasFilter && (
              <button className="filter-clear" onClick={() => {
                setSearch(""); setFilterPays(""); setFilterDest("");
                window.history.pushState({}, "", "/voyage");
              }}>
                Effacer les filtres
              </button>
            )}
          </div>
        </div>

        {/* ── LISTE ── */}
        {loadVoyage ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">✈️</p>
            <h4>Aucun voyage trouvé</h4>
            <p>Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <VoyageList voyages={filtered} />
        )}

      </Container>
    </div>
  );
};

export default Voyages;