import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { getAllDestinations } from "../../JS/Actions/destination";
import { getAllVoyages } from "../../JS/Actions/voyage";
import { getAllHotels } from "../../JS/Actions/hotel";
import { getAllReservations } from "../../JS/Actions/reservation";
import DestinationTab from "./DestinationTab";
import VoyageTab from "./VoyageTab";
import HotelTab from "./HotelTab";
import ReservationTab from "./ReservationTab";
import "./Admin.css";

/* ── Badge statut ─────────────────────────────────────────── */
const StatutBadge = ({ statut }) => {
  const map = {
    confirmee:  { label: "✓ Confirmée",  cls: "confirmee"  },
    en_attente: { label: "⏳ En attente", cls: "en_attente" },
    annulee:    { label: "✕ Annulée",    cls: "annulee"    },
  };
  const s = map[statut] || map.en_attente;
  return <span className={`admin-badge ${s.cls}`}>{s.label}</span>;
};

/* ── Stat Card ────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, subClass, iconClass, icon }) => (
  <div className="admin-stat-card">
    <div className="admin-stat-top">
      <span className="admin-stat-label">{label}</span>
      <div className={`admin-stat-icon ${iconClass}`}>{icon}</div>
    </div>
    <div className="admin-stat-value">{value}</div>
    <div className={`admin-stat-sub ${subClass || ""}`}>{sub}</div>
  </div>
);

/* ── Avatar initiales ─────────────────────────────────────── */
const Avatar = ({ nom }) => {
  const initiales = nom
    ? nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return <div className="admin-user-avatar">{initiales}</div>;
};

/* ── Dashboard Home ───────────────────────────────────────── */
const DashboardHome = ({ voyages, hotels, reservations, users, loadUsers, user, onTabChange }) => {
  const totalRevenu = reservations
    .filter(r => r.statut === "confirmee")
    .reduce((acc, r) => acc + (r.prixTotal || 0), 0);

  const enAttente  = reservations.filter(r => r.statut === "en_attente").length;
  const confirmees = reservations.filter(r => r.statut === "confirmee").length;
  const recentResa = [...reservations].slice(0, 6);

  return (
    <>
      <div className="admin-header">
        <h1>Panneau d'Administration</h1>
        <p>Bienvenue, <strong>{user?.nom}</strong>. Gérez votre plateforme de voyage.</p>
      </div>

      {/* ── STATS ── */}
      <div className="admin-stats-grid">
        <StatCard
          label="Réservations Totales"
          value={reservations.length}
          sub={`${enAttente} en attente`}
          subClass="warning"
          iconClass="purple"
          icon="📅"
        />
        <StatCard
          label="Revenu Confirmé"
          value={`${totalRevenu.toLocaleString()} DT`}
          sub={`${confirmees} confirmée(s)`}
          iconClass="green"
          icon="💰"
        />
        <StatCard
          label="Voyages & Hôtels"
          value={voyages.length + hotels.length}
          sub={`${voyages.length} voyages · ${hotels.length} hôtels`}
          subClass="muted"
          iconClass="blue"
          icon="✈️"
        />
      </div>

      {/* ── DEUX COLONNES : RESERVATIONS + UTILISATEURS ── */}
      <div className="admin-two-cols">

        {/* ── RESERVATIONS RECENTES ── */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Réservations Récentes</h3>
            <p>Les dernières réservations sur la plateforme</p>
          </div>

          {recentResa.length === 0 ? (
            <p className="admin-empty">Aucune réservation pour le moment.</p>
          ) : (
            recentResa.map((r) => {
              const nom  = r.type === "voyage" ? r.voyage?.title : r.hotel?.nom;
              const dest = r.type === "voyage" ? r.voyage?.destination : r.hotel?.destination;
              return (
                <div key={r._id} className="admin-resa-item">
                  <div className="admin-resa-left">
                    <div className={`admin-resa-icon ${r.type}`}>
                      {r.type === "voyage" ? "✈️" : "🏨"}
                    </div>
                    <div>
                      <p className="admin-resa-name">{nom || "—"}</p>
                      <p className="admin-resa-meta">
                        {r.user?.nom} · {dest?.nom}, {dest?.paye} ·{" "}
                        {new Date(r.dateDebut).toLocaleDateString("fr-FR")} ·{" "}
                        {r.nombrePersonnes} pers.
                      </p>
                    </div>
                  </div>
                  <div className="admin-resa-right">
                    <StatutBadge statut={r.statut} />
                    <div className="admin-resa-price">{r.prixTotal} DT</div>
                  </div>
                </div>
              );
            })
          )}

          {reservations.length > 6 && (
            <button
              className="admin-action-btn"
              style={{ width: "100%", marginTop: 14 }}
              onClick={() => onTabChange("reservations")}
            >
              Voir toutes les réservations ({reservations.length}) →
            </button>
          )}
        </div>

        {/* ── NOUVEAUX UTILISATEURS ── */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Nouveaux Utilisateurs</h3>
            <p>Les utilisateurs récemment inscrits sur la plateforme</p>
          </div>

          {loadUsers ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" variant="danger" />
            </div>
          ) : users.length === 0 ? (
            <p className="admin-empty">Aucun utilisateur pour le moment.</p>
          ) : (
            users.map((u) => (
              <div key={u._id} className="admin-user-item">
                <div className="admin-user-left">
                  <Avatar nom={u.nom} />
                  <div>
                    <p className="admin-user-name">{u.nom}</p>
                    <p className="admin-user-email">{u.email}</p>
                  </div>
                </div>
                <div className="admin-user-right">
                  <p className="admin-user-date">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="admin-user-resa">
                    {u.reservationCount} réservation(s)
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── ACTIONS RAPIDES ── */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Actions Rapides</h3>
          <p>Gérer les éléments de la plateforme</p>
        </div>
        <div className="admin-actions-grid">
          <button className="admin-action-btn primary" onClick={() => onTabChange("voyages")}>
            ✈️ Ajouter un Voyage
          </button>
          <button className="admin-action-btn primary" onClick={() => onTabChange("hotels")}>
            🏨 Ajouter un Hôtel
          </button>
          <button className="admin-action-btn" onClick={() => onTabChange("destinations")}>
            🌍 Gérer Destinations
          </button>
          <button className="admin-action-btn" onClick={() => onTabChange("reservations")}>
            📋 Voir Réservations
          </button>
        </div>
      </div>
    </>
  );
};

/* ── MAIN ADMIN ───────────────────────────────────────────── */
const Admin = () => {
  const dispatch = useDispatch();
  const { user }        = useSelector((s) => s.userReducer);
  const { destinations, loadDestination } = useSelector((s) => s.destinationReducer);
  const { voyages,      loadVoyage }      = useSelector((s) => s.voyageReducer);
  const { hotels,       loadHotel }       = useSelector((s) => s.hotelReducer);
  const { reservations, loadReservation } = useSelector((s) => s.reservationReducer);

  const [activeTab,  setActiveTab]  = useState("dashboard");
  const [users,      setUsers]      = useState([]);
  const [loadUsers,  setLoadUsers]  = useState(false);

  useEffect(() => {
    dispatch(getAllDestinations());
    dispatch(getAllVoyages());
    dispatch(getAllHotels());
    dispatch(getAllReservations());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    setLoadUsers(true);
    try {
      const res = await axios.get("/api/user/all", {
        headers: { authorization: localStorage.getItem("token") },
      });
      setUsers(res.data);
    } catch (e) {
      console.error("Erreur chargement users", e);
    } finally {
      setLoadUsers(false);
    }
  };

  const tabs = [
    { key: "dashboard",    label: "🏠 Tableau de bord" },
    { key: "reservations", label: "📋 Réservations" },
    { key: "voyages",      label: "✈️ Voyages" },
    { key: "hotels",       label: "🏨 Hôtels" },
    { key: "destinations", label: "🌍 Destinations" },
  ];

  const isLoading = loadDestination || loadVoyage || loadHotel || loadReservation;

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* ── TABS NAV ── */}
        <div className="admin-tabs-nav">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`admin-tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── LOADING ── */}
        {isLoading && activeTab === "dashboard" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spinner animation="border" variant="danger" />
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && !isLoading && (
          <DashboardHome
            voyages={voyages}
            hotels={hotels}
            reservations={reservations}
            users={users}
            loadUsers={loadUsers}
            user={user}
            onTabChange={setActiveTab}
          />
        )}

        {/* ── AUTRES TABS ── */}
        {activeTab !== "dashboard" && (
          <>
            <div className="admin-header">
              <h1>
                {activeTab === "reservations" && "📋 Réservations"}
                {activeTab === "voyages"      && "✈️ Voyages"}
                {activeTab === "hotels"       && "🏨 Hôtels"}
                {activeTab === "destinations" && "🌍 Destinations"}
              </h1>
              <button
                className="admin-action-btn"
                style={{ display: "inline-flex", marginTop: 8 }}
                onClick={() => setActiveTab("dashboard")}
              >
                ← Retour au tableau de bord
              </button>
            </div>

            <div className="admin-content">
              {activeTab === "reservations" && <ReservationTab />}
              {activeTab === "voyages"      && (
                <VoyageTab voyages={voyages} destinations={destinations} loadVoyage={loadVoyage} />
              )}
              {activeTab === "hotels"       && (
                <HotelTab hotels={hotels} destinations={destinations} loadHotel={loadHotel} />
              )}
              {activeTab === "destinations" && (
                <DestinationTab destinations={destinations} loadDestination={loadDestination} />
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Admin;