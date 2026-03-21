import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const ContactTab = () => {
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [reponse,  setReponse]  = useState("");
  const [sending,  setSending]  = useState(false);
  const [success,  setSuccess]  = useState("");

  const token = localStorage.getItem("token");

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get("/api/contact", {
        headers: { authorization: token }
      });
      setContacts(res.data);
    } catch {}
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleRepondre = async () => {
    if (!reponse.trim()) return;
    setSending(true);
    try {
      await axios.put(`/api/contact/repondre/${selected._id}`, { reponse }, {
        headers: { authorization: token }
      });
      setContacts(prev => prev.map(c =>
        c._id === selected._id ? { ...c, repondu: true, lu: true } : c
      ));
      setSuccess("Réponse envoyée !");
      setReponse("");
      setTimeout(() => { setSuccess(""); setSelected(null); }, 2000);
    } catch {
      setSuccess("Erreur lors de l'envoi.");
    } finally { setSending(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await axios.delete(`/api/contact/${id}`, {
        headers: { authorization: token }
      });
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {}
  };

  const handleOpen = async (contact) => {
    setSelected(contact);
    setReponse("");
    setSuccess("");
    if (!contact.lu) {
      try {
        await axios.put(`/api/contact/lu/${contact._id}`, {}, {
          headers: { authorization: token }
        });
        setContacts(prev => prev.map(c =>
          c._id === contact._id ? { ...c, lu: true } : c
        ));
      } catch {}
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60)    return "À l'instant";
    if (diff < 3600)  return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const nonLus = contacts.filter(c => !c.repondu).length;

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="danger" />
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 24, height: "70vh" }}>

      {/* ── LISTE ── */}
      <div style={{
        width: 360, flexShrink: 0, overflowY: "auto",
        borderRight: "1px solid #f0f0f0", paddingRight: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h5 style={{ margin: 0, fontWeight: 800, color: "#1a2535" }}>
            Messages
            {nonLus > 0 && (
              <span style={{
                background: "#cc0000", color: "white",
                borderRadius: 20, padding: "2px 8px",
                fontSize: "0.72rem", marginLeft: 8, fontWeight: 700,
              }}>{nonLus}</span>
            )}
          </h5>
          <span style={{ color: "#aab0c0", fontSize: "0.82rem" }}>
            {contacts.length} message{contacts.length > 1 ? "s" : ""}
          </span>
        </div>

        {contacts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aab0c0" }}>
            Aucun message
          </div>
        ) : (
          contacts.map(c => (
            <div
              key={c._id}
              onClick={() => handleOpen(c)}
              style={{
                padding: "14px 12px",
                borderRadius: 10,
                marginBottom: 6,
                cursor: "pointer",
                background: selected?._id === c._id ? "#fff5f5" : !c.lu ? "#fffafa" : "white",
                border: selected?._id === c._id ? "1.5px solid #cc0000" : "1px solid #f0f0f0",
                borderLeft: !c.lu && selected?._id !== c._id ? "3px solid #cc0000" : undefined,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: !c.lu ? 700 : 600, fontSize: "0.9rem", color: "#1a2535" }}>
                  {c.nom}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#aab0c0" }}>{timeAgo(c.createdAt)}</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#6b7a99", margin: "0 0 6px" }}>{c.email}</p>
              <p style={{
                fontSize: "0.82rem", color: "#6b7a99", margin: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {c.message}
              </p>
              <div style={{ marginTop: 6 }}>
                {c.repondu ? (
                  <span style={{
                    background: "#f0fdf4", color: "#16a34a",
                    borderRadius: 20, padding: "2px 8px",
                    fontSize: "0.72rem", fontWeight: 700,
                  }}>
                    Répondu
                  </span>
                ) : !c.lu ? (
                  <span style={{
                    background: "#fff0f0", color: "#cc0000",
                    borderRadius: 20, padding: "2px 8px",
                    fontSize: "0.72rem", fontWeight: 700,
                  }}>
                    Nouveau
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DETAIL ── */}
      {selected ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* infos client + message */}
          <div style={{
            background: "white", border: "1px solid #f0f0f0",
            borderRadius: 12, padding: "20px 24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h5 style={{ margin: "0 0 4px", fontWeight: 800, color: "#1a2535" }}>{selected.nom}</h5>
                <p style={{ margin: "0 0 2px", fontSize: "0.85rem", color: "#6b7a99" }}>{selected.email}</p>
                {selected.telephone && (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7a99" }}>{selected.telephone}</p>
                )}
              </div>
              <span style={{ fontSize: "0.8rem", color: "#aab0c0" }}>
                {new Date(selected.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </span>
            </div>

            <div style={{
              background: "#f9fafb", borderRadius: 10,
              padding: "14px 16px", marginTop: 16,
              borderLeft: "3px solid #e8ecf4",
            }}>
              <p style={{
                fontSize: "0.78rem", color: "#aab0c0",
                margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1,
              }}>
                Message
              </p>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "#1a2535", lineHeight: 1.6 }}>
                {selected.message}
              </p>
            </div>
          </div>

          {/* zone réponse */}
          <div style={{
            background: "white", border: "1px solid #f0f0f0",
            borderRadius: 12, padding: "20px 24px", flex: 1,
          }}>
            <p style={{ fontWeight: 700, color: "#1a2535", marginBottom: 10, fontSize: "0.9rem" }}>
              Répondre à {selected.nom}
            </p>
            <textarea
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              placeholder={`Bonjour ${selected.nom}, merci pour votre message...`}
              style={{
                width: "100%", border: "1.5px solid #e8ecf4",
                borderRadius: 10, padding: "12px 16px",
                fontSize: "0.9rem", color: "#1a2535",
                outline: "none", resize: "none", height: 130,
                background: "#fafbfc", fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "#cc0000"}
              onBlur={e  => e.target.style.borderColor = "#e8ecf4"}
            />

            {success && (
              <div style={{
                background: success.includes("Erreur") ? "#fff0f0" : "#f0fdf4",
                color: success.includes("Erreur") ? "#cc0000" : "#16a34a",
                borderRadius: 8, padding: "10px 14px",
                fontSize: "0.85rem", margin: "10px 0",
              }}>
                {success}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                onClick={handleRepondre}
                disabled={sending || !reponse.trim()}
                style={{
                  background: "#cc0000", color: "white",
                  border: "none", borderRadius: 8,
                  padding: "10px 24px", fontWeight: 700,
                  fontSize: "0.9rem", cursor: "pointer",
                  opacity: sending || !reponse.trim() ? 0.6 : 1,
                }}
              >
                {sending ? "Envoi..." : "Envoyer la réponse"}
              </button>
              <button
                onClick={() => handleDelete(selected._id)}
                style={{
                  background: "none", color: "#cc0000",
                  border: "1.5px solid #cc0000", borderRadius: 8,
                  padding: "10px 20px", fontWeight: 700,
                  fontSize: "0.9rem", cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          justifyContent: "center", color: "#aab0c0",
          flexDirection: "column", gap: 12,
        }}>
          <p style={{ fontSize: "2.5rem" }}>✉️</p>
          <p style={{ fontWeight: 600 }}>Sélectionnez un message</p>
        </div>
      )}
    </div>
  );
};

export default ContactTab;