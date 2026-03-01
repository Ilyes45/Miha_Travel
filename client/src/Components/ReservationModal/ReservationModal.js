import React, { useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./ReservationModal.css";
import { createReservation } from "../../JS/Actions/reservation";

const Counter = ({ label, sublabel, value, onChange, min = 0, max = 20 }) => (
  <div className="resa-counter">
    <div className="resa-counter-info">
      <span className="resa-counter-label">{label}</span>
      <span className="resa-counter-sub">{sublabel}</span>
    </div>
    <div className="resa-counter-controls">
      <button
        type="button"
        className="resa-counter-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >−</button>
      <span className="resa-counter-value">{value}</span>
      <button
        type="button"
        className="resa-counter-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >+</button>
    </div>
  </div>
);

const ReservationModal = ({ show, onHide, type, item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((s) => s.userReducer);
  const { loadReservation } = useSelector((s) => s.reservationReducer);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    dateDebut:  type === "voyage" ? item?.departureDate?.slice(0, 10) || today : today,
    dateFin:    type === "voyage" ? item?.returnDate?.slice(0, 10)   || today : today,
    adultes:    1,
    enfants:    0,
    telephone:  "",
    message:    "",
  });

  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const totalPersonnes = form.adultes + form.enfants;

  const nbrJours = () => {
    if (!form.dateDebut || !form.dateFin) return 0;
    return Math.max(1, Math.ceil(
      (new Date(form.dateFin) - new Date(form.dateDebut)) / (1000 * 60 * 60 * 24)
    ));
  };

  const calculPrix = () => {
    const prixUnit = type === "voyage" ? item?.price : item?.prix;
    if (type === "voyage") {
      // prix total par personne × adultes (pas par jour)
      return prixUnit * form.adultes;
    } else {
      // hôtel : prix/nuit × nuits × adultes
      return nbrJours() * prixUnit * form.adultes;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isAuth) { navigate("/login"); return; }
    if (form.adultes < 1) { setError("Au moins 1 adulte requis."); return; }
    if (!form.telephone.trim()) { setError("Le numéro de téléphone est obligatoire."); return; }
    if (new Date(form.dateFin) <= new Date(form.dateDebut)) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    const data = {
      type,
      voyage:          type === "voyage" ? item._id : undefined,
      hotel:           type === "hotel"  ? item._id : undefined,
      dateDebut:       form.dateDebut,
      dateFin:         form.dateFin,
      nombrePersonnes: totalPersonnes,
      telephone:       form.telephone,
      prixTotal:       calculPrix(),
      message:         form.message,
    };

    const result = await dispatch(createReservation(data));
    if (result.success) {
      setSuccess(true);
      setTimeout(() => { onHide(); setSuccess(false); }, 2000);
    } else {
      setError("Erreur lors de la réservation. Réessayez.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md" contentClassName="resa-modal-content">
      <div className="resa-modal">

        {/* ─── HEADER ──────────────────────────────────────── */}
        <div className="resa-header">
          <div className="resa-header-left">
            <div className="resa-header-icon">{type === "voyage" ? "✈️" : "🏨"}</div>
            <div>
              <h5 className="resa-header-title">{type === "voyage" ? item?.title : item?.nom}</h5>
              <p className="resa-header-sub">📍 {item?.destination?.nom} — {item?.destination?.paye}</p>
            </div>
          </div>
          <button className="resa-close" type="button" onClick={onHide}>✕</button>
        </div>

        <div className="resa-body">
          {success && <Alert variant="success">✅ Réservation créée avec succès !</Alert>}
          {error   && <Alert variant="danger">{error}</Alert>}

          <form onSubmit={handleSubmit}>

            {/* ─── DATES ─────────────────────────────────── */}
            <p className="resa-section-title">📅 Dates du séjour</p>
            <div className="resa-dates">
              <div className="resa-date-field">
                <label>Arrivée</label>
                <input
                  type="date"
                  value={form.dateDebut}
                  min={today}
                  disabled={type === "voyage"}
                  onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                  required
                />
              </div>
              <div className="resa-date-sep">→</div>
              <div className="resa-date-field">
                <label>Départ</label>
                <input
                  type="date"
                  value={form.dateFin}
                  min={form.dateDebut || today}
                  disabled={type === "voyage"}
                  onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* ─── VOYAGEURS ─────────────────────────────── */}
            <p className="resa-section-title">👥 Voyageurs</p>
            <div className="resa-counters">
              <Counter
                label="Adultes"
                sublabel="18 ans et plus"
                value={form.adultes}
                onChange={(v) => setForm({ ...form, adultes: v })}
                min={1}
                max={10}
              />
              <Counter
                label="Enfants"
                sublabel="2 à 17 ans"
                value={form.enfants}
                onChange={(v) => setForm({ ...form, enfants: v })}
                min={0}
                max={10}
              />
            </div>

            {/* ─── TELEPHONE ─────────────────────────────── */}
            <p className="resa-section-title">📞 Téléphone</p>
            <input
              type="tel"
              className="resa-input"
              placeholder="Ex: +216 XX XXX XXX"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              required
            />

            {/* ─── MESSAGE ───────────────────────────────── */}
            <p className="resa-section-title">💬 Message (optionnel)</p>
            <textarea
              className="resa-textarea"
              rows={2}
              placeholder="Demandes spéciales, chambre préférée..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            {/* ─── RECAP PRIX ────────────────────────────── */}
            <div className="resa-recap">
              <div className="resa-recap-row">
                <span>Durée</span>
                <span>{type === "voyage" ? `${nbrJours()} jour(s)` : `${nbrJours()} nuit(s)`}</span>
              </div>
              <div className="resa-recap-row">
                <span>Adultes</span><span>{form.adultes}</span>
              </div>
              {form.enfants > 0 && (
                <div className="resa-recap-row">
                  <span>Enfants</span><span>{form.enfants}</span>
                </div>
              )}
              <div className="resa-recap-row">
                <span>Prix {type === "voyage" ? "/ personne" : "/ nuit"}</span>
                <span>{type === "voyage" ? item?.price : item?.prix} TND</span>
              </div>
              <div className="resa-recap-total">
                <span>Total estimé</span>
                <span>{calculPrix()} TND</span>
              </div>
            </div>

            {/* ─── BOUTONS ───────────────────────────────── */}
            <div className="resa-actions">
              <button type="button" className="resa-btn-cancel" onClick={onHide}>Annuler</button>
              <button type="submit" className="resa-btn-confirm" disabled={loadReservation}>
                {loadReservation ? "En cours..." : "✅ Confirmer la réservation"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ReservationModal;