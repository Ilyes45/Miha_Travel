import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "../Historique/Historique.css";

// ─── TOOLTIP CUSTOM ───────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a2535", color: "white",
        padding: "10px 14px", borderRadius: 10,
        fontSize: "0.85rem", boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
      }}>
        <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{label}</p>
        <p style={{ margin: "0 0 2px", color: "#4ade80" }}>
          💰 {payload[0].value.toLocaleString()} DT
        </p>
        {payload[1] && (
          <p style={{ margin: 0, color: "#93c5fd" }}>
            📋 {payload[1].value} réservation(s)
          </p>
        )}
      </div>
    );
  }
  return null;
};

const Historique = () => {
  const [data,       setData]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [anneeActive, setAnneeActive] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/reservation/revenu-par-mois", {
          headers: { authorization: localStorage.getItem("token") },
        });
        setData(res.data);
      } catch (e) {
        console.error("Erreur stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // années disponibles
  const annees = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);

  // données filtrées par année
  const dataFiltered = data.filter(d => d.year === anneeActive);

  // remplir les 12 mois même si pas de données
  const moisFr = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const dataComplete = moisFr.map((m, i) => {
    const found = dataFiltered.find(d => d.month === i + 1);
    return {
      label: m,
      revenu:       found?.revenu       || 0,
      reservations: found?.reservations || 0,
    };
  });

  // stats totales de l'année sélectionnée
  const totalRevenu = dataFiltered.reduce((acc, d) => acc + d.revenu, 0);
  const totalResa   = dataFiltered.reduce((acc, d) => acc + d.reservations, 0);
  const meilleurMois = dataComplete.reduce((best, d) => d.revenu > best.revenu ? d : best, { revenu: 0 });
  const moyenneMois  = totalResa > 0 ? Math.round(totalRevenu / dataFiltered.length) : 0;

  return (
    <div className="histo-page">
      <div className="histo-container">

        {/* ── HEADER ── */}
        <div className="histo-header">
          <h1>📊 Historique des Revenus</h1>
          <p>Analyse des revenus confirmés par mois</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <>
            {/* ── STATS TOP ── */}
            <div className="histo-stats">
              <div className="histo-stat">
                <div className="histo-stat-label">Revenu total {anneeActive}</div>
                <div className="histo-stat-value green">
                  {totalRevenu.toLocaleString()} DT
                </div>
              </div>
              <div className="histo-stat">
                <div className="histo-stat-label">Réservations confirmées</div>
                <div className="histo-stat-value blue">{totalResa}</div>
              </div>
              <div className="histo-stat">
                <div className="histo-stat-label">Meilleur mois</div>
                <div className="histo-stat-value">
                  {meilleurMois.revenu > 0 ? meilleurMois.label : "—"}
                </div>
              </div>
              <div className="histo-stat">
                <div className="histo-stat-label">Moyenne / mois actif</div>
                <div className="histo-stat-value orange">
                  {moyenneMois.toLocaleString()} DT
                </div>
              </div>
            </div>

            {/* ── GRAPHIQUE ── */}
            <div className="histo-chart-card">
              <p className="histo-chart-title">Revenu mensuel</p>
              <p className="histo-chart-sub">Revenus des réservations confirmées en {anneeActive}</p>

              {/* filtre années */}
              {annees.length > 1 && (
                <div className="histo-filter">
                  <span className="histo-filter-label">Année :</span>
                  {annees.map(a => (
                    <button
                      key={a}
                      className={`histo-year-btn ${anneeActive === a ? "active" : ""}`}
                      onClick={() => setAnneeActive(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={dataComplete} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf4" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#6b7a99" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7a99" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => v > 0 ? `${v.toLocaleString()} DT` : "0"}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f4f6fb" }} />
                  <Bar dataKey="revenu" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {dataComplete.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.revenu === meilleurMois.revenu && entry.revenu > 0
                          ? "#e53935"
                          : "#fca5a5"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── TABLE DETAIL ── */}
            <div className="histo-table-card">
              <p className="histo-chart-title" style={{ marginBottom: 4 }}>
                Détail mois par mois — {anneeActive}
              </p>
              <p className="histo-chart-sub">Réservations confirmées uniquement</p>

              <table className="histo-table">
                <thead>
                  <tr>
                    <th>Mois</th>
                    <th>Réservations</th>
                    <th>Revenu</th>
                  </tr>
                </thead>
                <tbody>
                  {dataComplete.map((d, i) => (
                    <tr key={i}>
                      <td>{d.label} {anneeActive}</td>
                      <td>{d.reservations || "—"}</td>
                      <td className="revenu-cell">
                        {d.revenu > 0 ? `${d.revenu.toLocaleString()} DT` : "—"}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700 }}>
                    <td>Total</td>
                    <td>{totalResa}</td>
                    <td className="revenu-cell">{totalRevenu.toLocaleString()} DT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Historique;