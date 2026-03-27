import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

import { getAllDestinations } from "../../JS/Actions/destination";
import { getAllVoyages }      from "../../JS/Actions/voyage";
import { getAllHotels }       from "../../JS/Actions/hotel";
import { getAllReservations } from "../../JS/Actions/reservation";
import DestinationTab  from "./DestinationTab";
import VoyageTab       from "./VoyageTab";
import HotelTab        from "./HotelTab";
import ReservationTab  from "./ReservationTab";
import AnnonceTab      from "./AnnonceTab";
import ContactTab      from "./ContactTab";
import "./Admin.css";

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

const StatutBadge = ({ statut }) => {
  const map = {
    confirmee:  { label: "Confirmée",  cls: "confirmee"  },
    en_attente: { label: "En attente", cls: "en_attente" },
    annulee:    { label: "Annulée",    cls: "annulee"    },
  };
  const s = map[statut] || map.en_attente;
  return <span className={`admin-badge ${s.cls}`}>{s.label}</span>;
};

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

const Avatar = ({ nom }) => {
  const initiales = nom
    ? nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return <div className="admin-user-avatar">{initiales}</div>;
};

const MiniTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a2535", color: "white",
        padding: "8px 12px", borderRadius: 8, fontSize: "0.8rem"
      }}>
        <p style={{ margin: "0 0 2px", fontWeight: 700 }}>{label}</p>
        <p style={{ margin: 0, color: "#4ade80" }}>{payload[0].value.toLocaleString()} DT</p>
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────────────────────
// DASHBOARD HOME
// ─────────────────────────────────────────────────────────────

const DashboardHome = ({ voyages, hotels, reservations, users, loadUsers, statsData, loadStats, user, onTabChange }) => {
  const totalRevenu = reservations
    .filter(r => r.statut === "confirmee")
    .reduce((acc, r) => acc + (r.prixTotal || 0), 0);
  const enAttente  = reservations.filter(r => r.statut === "en_attente").length;
  const confirmees = reservations.filter(r => r.statut === "confirmee").length;
  const recentResa = [...reservations].slice(0, 6);

  const annee        = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const moisFr       = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

  const last6 = [];
  for (let i = 5; i >= 0; i--) {
    const mIdx  = (currentMonth - i + 12) % 12;
    const yr    = currentMonth - i < 0 ? annee - 1 : annee;
    const found = statsData.find(d => d.month === mIdx + 1 && d.year === yr);
    last6.push({ label: moisFr[mIdx], revenu: found?.revenu || 0 });
  }
  const maxRevenu = Math.max(...last6.map(d => d.revenu));

  return (
    <>
      {/* ── HEADER ── */}
      <div className="admin-header">
        <h1>Panneau d'Administration</h1>
        <p>Bienvenue, <strong>{user?.nom}</strong>. Gérez votre plateforme de voyage.</p>
      </div>

      {/* ── STATS ── */}
      <div className="admin-stats-grid">
        <StatCard
          label="Réservations Totales" value={reservations.length}
          sub={`${enAttente} en attente`} subClass="warning"
          iconClass="purple" icon="Res"
        />
        <StatCard
          label="Revenu Confirmé" value={`${totalRevenu.toLocaleString()} DT`}
          sub={`${confirmees} confirmée(s)`}
          iconClass="green" icon="DT"
        />
        <StatCard
          label="Voyages & Hôtels" value={voyages.length + hotels.length}
          sub={`${voyages.length} voyages · ${hotels.length} hôtels`} subClass="muted"
          iconClass="blue" icon="V/H"
        />
      </div>

      {/* ── REVENU PAR MOIS ── */}
      <div className="admin-section">
        <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3>Revenu par mois</h3>
            <p>6 derniers mois — réservations confirmées uniquement</p>
          </div>
          <button className="admin-action-btn" style={{ whiteSpace: "nowrap" }}
            onClick={() => window.location.href = "/historique"}>
            Voir l'historique complet →
          </button>
        </div>
        {loadStats ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spinner animation="border" size="sm" variant="danger" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last6} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7a99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false}
                tickFormatter={v => v > 0 ? `${v.toLocaleString()}` : "0"} width={70} />
              <Tooltip content={<MiniTooltip />} cursor={{ fill: "#f4f6fb" }} />
              <Bar dataKey="revenu" radius={[6, 6, 0, 0]} maxBarSize={44}>
                {last6.map((entry, i) => (
                  <Cell key={i} fill={entry.revenu === maxRevenu && entry.revenu > 0 ? "#e53935" : "#fca5a5"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── DEUX COLONNES ── */}
      <div className="admin-two-cols">

        {/* Réservations récentes */}
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
                      {r.type === "voyage" ? "V" : "H"}
                    </div>
                    <div>
                      <p className="admin-resa-name">{nom || "—"}</p>
                      <p className="admin-resa-meta">
                        {r.user?.nom} · {dest?.nom}, {dest?.paye} ·{" "}
                        {new Date(r.dateDebut).toLocaleDateString("fr-FR")} · {r.nombrePersonnes} pers.
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
            <button className="admin-action-btn" style={{ width: "100%", marginTop: 14 }}
              onClick={() => onTabChange("reservations")}>
              Voir toutes ({reservations.length}) →
            </button>
          )}
        </div>

        {/* Nouveaux utilisateurs */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Nouveaux Utilisateurs</h3>
            <p>Les utilisateurs récemment inscrits</p>
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
                  <p className="admin-user-date">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</p>
                  <p className="admin-user-resa">{u.reservationCount} réservation(s)</p>
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
          <button className="admin-action-btn primary" onClick={() => onTabChange("voyages")}>Ajouter un Voyage</button>
          <button className="admin-action-btn primary" onClick={() => onTabChange("hotels")}>Ajouter un Hôtel</button>
          <button className="admin-action-btn" onClick={() => onTabChange("destinations")}>Gérer Destinations</button>
          <button className="admin-action-btn" onClick={() => onTabChange("reservations")}>Voir Réservations</button>
          <button className="admin-action-btn" onClick={() => onTabChange("annonces")}>Gérer Annonces</button>
          <button className="admin-action-btn" onClick={() => onTabChange("contacts")}>Voir Messages</button>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const Admin = () => {
  const dispatch = useDispatch();
  const { user }        = useSelector((s) => s.userReducer);
  const { destinations, loadDestination } = useSelector((s) => s.destinationReducer);
  const { voyages,      loadVoyage }      = useSelector((s) => s.voyageReducer);
  const { hotels,       loadHotel }       = useSelector((s) => s.hotelReducer);
  const { reservations, loadReservation } = useSelector((s) => s.reservationReducer);

  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [users,       setUsers]       = useState([]);
  const [loadUsers,   setLoadUsers]   = useState(false);
  const [statsData,   setStatsData]   = useState([]);
  const [loadStats,   setLoadStats]   = useState(false);
  const [nonLusCount, setNonLusCount] = useState(0);

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const config = { headers: { authorization: token } };

    dispatch(getAllDestinations());
    dispatch(getAllVoyages());
    dispatch(getAllHotels());
    dispatch(getAllReservations());

    const fetchUsers = async () => {
      setLoadUsers(true);
      try {
        const res = await axios.get("/api/user/all", config);
        setUsers(res.data);
      } catch (e) {
        console.error("Erreur users", e);
      } finally { setLoadUsers(false); }
    };

    const fetchStats = async () => {
      setLoadStats(true);
      try {
        const res = await axios.get("/api/reservation/revenu-par-mois", config);
        setStatsData(res.data);
      } catch (e) {
        console.error("Erreur stats", e);
      } finally { setLoadStats(false); }
    };

    const fetchNonLus = async () => {
      try {
        const res = await axios.get("/api/contact", { headers: { authorization: token } });
        setNonLusCount(res.data.filter(c => !c.repondu).length);
      } catch {}
    };

    fetchUsers();
    fetchStats();
    fetchNonLus();
  }, [dispatch]);

  // ── Tabs config ──
  const tabs = [
    { key: "dashboard",    label: "Tableau de bord" },
    { key: "reservations", label: "Réservations"    },
    { key: "voyages",      label: "Voyages"          },
    { key: "hotels",       label: "Hôtels"           },
    { key: "destinations", label: "Destinations"     },
    { key: "annonces",     label: "Annonces"         },
    { key: "contacts",     label: "Messages", badge: nonLusCount },
  ];

  const headerTitle = {
    reservations: "Réservations",
    voyages:      "Voyages",
    hotels:       "Hôtels",
    destinations: "Destinations",
    annonces:     "Annonces",
    contacts:     "Messages",
  };

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
              {t.badge > 0 && (
                <span style={{
                  background: "#cc0000", color: "white",
                  borderRadius: 20, padding: "1px 7px",
                  fontSize: "0.7rem", marginLeft: 6, fontWeight: 700,
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {isLoading && activeTab === "dashboard" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spinner animation="border" variant="danger" />
          </div>
        )}

        {activeTab === "dashboard" && !isLoading && (
          <DashboardHome
            voyages={voyages} hotels={hotels} reservations={reservations}
            users={users} loadUsers={loadUsers}
            statsData={statsData} loadStats={loadStats}
            user={user} onTabChange={setActiveTab}
          />
        )}

        {/* ── AUTRES TABS ── */}
        {activeTab !== "dashboard" && (
          <>
            <div className="admin-header">
              <h1>{headerTitle[activeTab]}</h1>
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
              {activeTab === "voyages"      && <VoyageTab voyages={voyages} destinations={destinations} loadVoyage={loadVoyage} />}
              {activeTab === "hotels"       && <HotelTab  hotels={hotels}   destinations={destinations} loadHotel={loadHotel}   />}
              {activeTab === "destinations" && <DestinationTab destinations={destinations} loadDestination={loadDestination} />}
              {activeTab === "annonces"     && <AnnonceTab />}
              {activeTab === "contacts"     && <ContactTab onRepondu={() => setNonLusCount(prev => Math.max(0, prev - 1))} />}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Admin;