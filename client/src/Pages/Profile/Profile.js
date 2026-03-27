import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Badge, Button, Spinner, Card } from "react-bootstrap";
import axios from "axios";
import { getMyReservations, cancelMyReservation } from "../../JS/Actions/reservation";
import { updateProfile } from "../../JS/Actions/user";
import "./Profile.css";

const statutBadge = (statut) => {
  if (statut === "en_attente") return <Badge bg="warning" text="dark">En attente</Badge>;
  if (statut === "confirmee")  return <Badge bg="success">Confirmée</Badge>;
  if (statut === "annulee")    return <Badge bg="danger">Annulée</Badge>;
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.userReducer);
  const { myReservations, loadReservation } = useSelector((s) => s.reservationReducer);

  const [activeTab, setActiveTab] = useState("reservations");
  const [messages,  setMessages]  = useState([]);
  const [loadMsg,   setLoadMsg]   = useState(false);
  const [selected,  setSelected]  = useState(null);

  const [nom,        setNom]        = useState("");
  const [savingNom,  setSavingNom]  = useState(false);
  const [nomSuccess, setNomSuccess] = useState("");
  const [nomError,   setNomError]   = useState("");

  const [ancienMdp,  setAncienMdp]  = useState("");
  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");
  const [savingMdp,  setSavingMdp]  = useState(false);
  const [mdpSuccess, setMdpSuccess] = useState("");
  const [mdpError,   setMdpError]   = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getMyReservations());
  }, [dispatch]);

  useEffect(() => {
    if (user?.nom) setNom(user.nom);
  }, [user]);

  const fetchMessages = useCallback(async () => {
    setLoadMsg(true);
    try {
      const res = await axios.get("/api/contact/mes-messages", {
        headers: { authorization: localStorage.getItem("token") }
      });
      setMessages(res.data);
    } catch {}
    finally { setLoadMsg(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "messages") fetchMessages();
  }, [activeTab, fetchMessages]);

  const handleCancel = (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      dispatch(cancelMyReservation(id));
    }
  };

  const handleDeleteMsg = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await axios.delete(`/api/contact/${id}`, {
        headers: { authorization: localStorage.getItem("token") }
      });
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {}
  };

  const handleSaveNom = async () => {
    if (!nom.trim()) return;
    setSavingNom(true);
    setNomSuccess(""); setNomError("");
    try {
      await axios.put("/api/user/profile", { nom }, {
        headers: { authorization: token }
      });
      setNomSuccess("Nom mis à jour !");
      dispatch(updateProfile({ nom }));
      setTimeout(() => setNomSuccess(""), 3000);
    } catch (err) {
      setNomError(err.response?.data?.msg || "Erreur lors de la mise à jour");
    } finally { setSavingNom(false); }
  };

  const handleChangeMdp = async () => {
    setMdpSuccess(""); setMdpError("");
    if (!ancienMdp || !nouveauMdp || !confirmMdp) {
      setMdpError("Tous les champs sont obligatoires"); return;
    }
    if (nouveauMdp !== confirmMdp) {
      setMdpError("Les mots de passe ne correspondent pas"); return;
    }
    if (nouveauMdp.length < 6) {
      setMdpError("Le mot de passe doit contenir au moins 6 caractères"); return;
    }
    setSavingMdp(true);
    try {
      await axios.put("/api/user/change-password",
        { ancienMotDePasse: ancienMdp, nouveauMotDePasse: nouveauMdp },
        { headers: { authorization: token } }
      );
      setMdpSuccess("Mot de passe modifié avec succès !");
      setAncienMdp(""); setNouveauMdp(""); setConfirmMdp("");
      setTimeout(() => setMdpSuccess(""), 3000);
    } catch (err) {
      setMdpError(err.response?.data?.msg || "Erreur lors de la modification");
    } finally { setSavingMdp(false); }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60)    return "À l'instant";
    if (diff < 3600)  return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const nonRepondus = messages.filter(m => !m.repondu).length;

  const tabStyle = (key) => ({
    background: "none", border: "none",
    borderBottom: activeTab === key ? "2px solid #cc0000" : "2px solid transparent",
    color: activeTab === key ? "#cc0000" : "#6b7a99",
    fontWeight: 700, fontSize: "0.95rem",
    padding: "10px 24px", cursor: "pointer",
    marginBottom: -2, transition: "all 0.2s",
  });

  const fieldStyle = {
    border: "1.5px solid #e8ecf4", borderRadius: 8,
    padding: "11px 16px", fontSize: "0.92rem",
    color: "#1a2535", outline: "none",
    background: "#fafbfc", width: "100%",
    fontFamily: "inherit",
  };

  return (
    <div>
      <div className="profile-header">
        <Container>
          <div className="profile-avatar">{user?.nom?.charAt(0).toUpperCase()}</div>
          <h2 className="fw-bold mt-3 mb-1">{user?.nom}</h2>
          <p className="mb-0 opacity-75">{user?.email}</p>
        </Container>
      </div>

      <Container className="py-5">

        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #f0f0f0" }}>
          <button style={tabStyle("reservations")} onClick={() => setActiveTab("reservations")}>
            Mes réservations
            <span style={{
              background: activeTab === "reservations" ? "#cc0000" : "#e8ecf4",
              color: activeTab === "reservations" ? "white" : "#6b7a99",
              borderRadius: 20, padding: "1px 8px",
              fontSize: "0.75rem", marginLeft: 8, fontWeight: 700,
            }}>
              {myReservations.length}
            </span>
          </button>

          <button style={tabStyle("messages")} onClick={() => setActiveTab("messages")}>
            Mes messages
            {nonRepondus > 0 && (
              <span style={{
                background: "#cc0000", color: "white",
                borderRadius: 20, padding: "1px 8px",
                fontSize: "0.75rem", marginLeft: 8, fontWeight: 700,
              }}>
                {nonRepondus}
              </span>
            )}
          </button>

          <button style={tabStyle("parametres")} onClick={() => setActiveTab("parametres")}>
            Paramètres
          </button>
        </div>

        {/* ── RESERVATIONS ── */}
        {activeTab === "reservations" && (
          <>
            {loadReservation ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
              </div>
            ) : myReservations.length === 0 ? (
              <div className="profile-empty">
                <div style={{ fontSize: "3rem" }}>🗓️</div>
                <p className="mt-3 text-muted">Aucune réservation pour le moment.</p>
              </div>
            ) : (
              <Row className="g-4">
                {myReservations.map((r) => {
                  const nom   = r.type === "voyage" ? r.voyage?.title : r.hotel?.nom;
                  const dest  = r.type === "voyage" ? r.voyage?.destination : r.hotel?.destination;
                  const emoji = r.type === "voyage" ? "✈️" : "🏨";
                  return (
                    <Col md={6} key={r._id}>
                      <Card className="profile-resa-card h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <span className="me-2" style={{ fontSize: "1.4rem" }}>{emoji}</span>
                              <span className="fw-bold fs-5">{nom}</span>
                            </div>
                            {statutBadge(r.statut)}
                          </div>
                          {dest && (
                            <p className="text-muted mb-2">{dest.nom} — {dest.paye}</p>
                          )}
                          <Row className="g-2 mb-3">
                            <Col xs={6}>
                              <div className="profile-resa-info">
                                <small className="text-muted d-block">Du</small>
                                <span className="fw-bold">{new Date(r.dateDebut).toLocaleDateString("fr-FR")}</span>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="profile-resa-info">
                                <small className="text-muted d-block">Au</small>
                                <span className="fw-bold">{new Date(r.dateFin).toLocaleDateString("fr-FR")}</span>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="profile-resa-info">
                                <small className="text-muted d-block">Personnes</small>
                                <span className="fw-bold">{r.nombrePersonnes}</span>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="profile-resa-info">
                                <small className="text-muted d-block">Prix total</small>
                                <span className="fw-bold text-danger">{r.prixTotal} DT</span>
                              </div>
                            </Col>
                          </Row>
                          {r.message && (
                            <p className="text-muted" style={{ fontSize: "0.9rem" }}>{r.message}</p>
                          )}
                          {r.statut === "en_attente" && (
                            <Button variant="outline-danger" size="sm" className="w-100 mt-2"
                              onClick={() => handleCancel(r._id)}>
                              Annuler
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}

        {/* ── MESSAGES ── */}
        {activeTab === "messages" && (
          <div style={{ display: "flex", gap: 24, minHeight: 400 }}>
            <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid #f0f0f0", paddingRight: 16 }}>
              {loadMsg ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="danger" size="sm" />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#aab0c0" }}>
                  <p style={{ fontSize: "2.5rem" }}>✉️</p>
                  <p>Aucun message envoyé</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m._id} onClick={() => setSelected(m)} style={{
                    padding: "14px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                    background: selected?._id === m._id ? "#fff5f5" : "white",
                    border: selected?._id === m._id ? "1.5px solid #cc0000" : "1px solid #f0f0f0",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a2535" }}>
                        {m.repondu ? "Répondu" : "En attente"}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#aab0c0" }}>{timeAgo(m.createdAt)}</span>
                    </div>
                    <p style={{
                      fontSize: "0.82rem", color: "#6b7a99", margin: "0 0 6px",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {m.message}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                      {m.repondu ? (
                        <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 20, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
                          Répondu
                        </span>
                      ) : (
                        <span style={{ background: "#fff0f0", color: "#cc0000", borderRadius: 20, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
                          En attente
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMsg(m._id); }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "#aab0c0", fontSize: "0.78rem", fontWeight: 600,
                          padding: "2px 6px", transition: "color 0.2s",
                        }}
                        onMouseEnter={e => e.target.style.color = "#cc0000"}
                        onMouseLeave={e => e.target.style.color = "#aab0c0"}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selected ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "white", border: "1px solid #f0f0f0", borderRadius: 12, padding: "20px 24px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#aab0c0", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
                    Votre message — {new Date(selected.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                  <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid #e8ecf4" }}>
                    <p style={{ margin: 0, fontSize: "0.92rem", color: "#1a2535", lineHeight: 1.6 }}>{selected.message}</p>
                  </div>
                </div>

                {selected.repondu ? (
                  <div style={{ background: "white", border: "1px solid #f0f0f0", borderRadius: 12, padding: "20px 24px" }}>
                    <p style={{ fontSize: "0.75rem", color: "#aab0c0", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
                      Réponse de Miha Travel
                    </p>
                    <div style={{ background: "#fff5f5", borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid #cc0000" }}>
                      <p style={{ margin: 0, fontSize: "0.92rem", color: "#1a2535", lineHeight: 1.6 }}>{selected.reponseAdmin}</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#fffbf0", border: "1px solid #fde8c0", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                    <p style={{ fontSize: "1.5rem", margin: "0 0 8px" }}>⏳</p>
                    <p style={{ color: "#6b7a99", margin: 0, fontSize: "0.9rem" }}>Votre message est en attente de réponse.</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#aab0c0", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: "2.5rem" }}>✉️</p>
                <p style={{ fontWeight: 600 }}>Sélectionnez un message</p>
              </div>
            )}
          </div>
        )}

        {/* ── PARAMETRES ── */}
        {activeTab === "parametres" && (
          <Row className="g-4" style={{ maxWidth: 700 }}>
            <Col md={12}>
              <div style={{ background: "white", border: "1px solid #f0f0f0", borderRadius: 14, padding: "24px 28px" }}>
                <h5 style={{ fontWeight: 800, color: "#1a2535", marginBottom: 4 }}>Modifier le nom</h5>
                <p style={{ color: "#6b7a99", fontSize: "0.88rem", marginBottom: 20 }}>Changez votre nom d'affichage</p>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a2535", display: "block", marginBottom: 6 }}>
                    Nom complet
                  </label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)}
                    style={fieldStyle}
                    onFocus={e => e.target.style.borderColor = "#cc0000"}
                    onBlur={e  => e.target.style.borderColor = "#e8ecf4"} />
                </div>
                {nomSuccess && (
                  <div style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", marginBottom: 12 }}>
                    {nomSuccess}
                  </div>
                )}
                {nomError && (
                  <div style={{ background: "#fff0f0", color: "#cc0000", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", marginBottom: 12 }}>
                    {nomError}
                  </div>
                )}
                <button onClick={handleSaveNom} disabled={savingNom || nom === user?.nom}
                  style={{
                    background: "#cc0000", color: "white", border: "none",
                    borderRadius: 8, padding: "10px 24px", fontWeight: 700,
                    fontSize: "0.9rem", cursor: "pointer",
                    opacity: savingNom || nom === user?.nom ? 0.6 : 1,
                  }}>
                  {savingNom ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </Col>

            <Col md={12}>
              <div style={{ background: "white", border: "1px solid #f0f0f0", borderRadius: 14, padding: "24px 28px" }}>
                <h5 style={{ fontWeight: 800, color: "#1a2535", marginBottom: 4 }}>Changer le mot de passe</h5>
                <p style={{ color: "#6b7a99", fontSize: "0.88rem", marginBottom: 20 }}>
                  Entrez votre ancien mot de passe pour confirmer
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a2535", display: "block", marginBottom: 6 }}>Ancien mot de passe</label>
                    <input type="password" placeholder="••••••••" value={ancienMdp}
                      onChange={(e) => setAncienMdp(e.target.value)} style={fieldStyle}
                      onFocus={e => e.target.style.borderColor = "#cc0000"}
                      onBlur={e  => e.target.style.borderColor = "#e8ecf4"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a2535", display: "block", marginBottom: 6 }}>Nouveau mot de passe</label>
                    <input type="password" placeholder="••••••••" value={nouveauMdp}
                      onChange={(e) => setNouveauMdp(e.target.value)} style={fieldStyle}
                      onFocus={e => e.target.style.borderColor = "#cc0000"}
                      onBlur={e  => e.target.style.borderColor = "#e8ecf4"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1a2535", display: "block", marginBottom: 6 }}>Confirmer le nouveau mot de passe</label>
                    <input type="password" placeholder="••••••••" value={confirmMdp}
                      onChange={(e) => setConfirmMdp(e.target.value)} style={fieldStyle}
                      onFocus={e => e.target.style.borderColor = "#cc0000"}
                      onBlur={e  => e.target.style.borderColor = "#e8ecf4"} />
                  </div>
                </div>
                {mdpSuccess && (
                  <div style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", margin: "14px 0" }}>
                    {mdpSuccess}
                  </div>
                )}
                {mdpError && (
                  <div style={{ background: "#fff0f0", color: "#cc0000", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", margin: "14px 0" }}>
                    {mdpError}
                  </div>
                )}
                <button onClick={handleChangeMdp} disabled={savingMdp}
                  style={{
                    background: "#cc0000", color: "white", border: "none",
                    borderRadius: 8, padding: "10px 24px", fontWeight: 700,
                    fontSize: "0.9rem", cursor: "pointer", marginTop: 6,
                    opacity: savingMdp ? 0.6 : 1,
                  }}>
                  {savingMdp ? "Modification..." : "Modifier le mot de passe"}
                </button>
              </div>
            </Col>
          </Row>
        )}

      </Container>
    </div>
  );
};

export default Profile;