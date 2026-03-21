import React, { useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/contact", form);
      setSuccess(true);
      setForm({ nom: "", email: "", telephone: "", message: "" });
    } catch (err) {
      setError("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      {/* ── HEADER ── */}
      <div className="contact-header">
        <div className="contact-header-overlay" />
        <Container className="contact-header-content">
          <p className="contact-header-tag">Miha Travel</p>
          <h1 className="contact-header-title">Contactez-nous</h1>
          <p className="contact-header-sub">Notre équipe est disponible pour répondre à toutes vos questions</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-5">

          {/* ── INFOS ── */}
          <Col lg={4}>
            <div className="contact-infos">
              <h3 className="contact-infos-title">Nos coordonnées</h3>
              <p className="contact-infos-sub">N'hésitez pas à nous contacter directement</p>

              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div>
                  <p className="contact-info-label">Adresse</p>
                  <p className="contact-info-value">32 Rue Mongi Slim, Gabès, Tunisie</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">📞</div>
                <div>
                  <p className="contact-info-label">Téléphone</p>
                  <p className="contact-info-value">+216 57 093 791</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">✉️</div>
                <div>
                  <p className="contact-info-label">Email</p>
                  <p className="contact-info-value">contact@mihatravel.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">🕐</div>
                <div>
                  <p className="contact-info-label">Horaires</p>
                  <p className="contact-info-value">Lun – Sam : 8h00 – 18h00</p>
                </div>
              </div>

              <div className="contact-socials">
                <a href="https://www.facebook.com/p/Miha-Travel-Agency-100094864752165" target="_blank" rel="noreferrer" className="contact-social-btn">
                  Facebook
                </a>
                <a href="https://wa.me/21657093791" target="_blank" rel="noreferrer" className="contact-social-btn whatsapp">
                  WhatsApp
                </a>
              </div>
            </div>
          </Col>

          {/* ── FORMULAIRE ── */}
          <Col lg={8}>
            <div className="contact-form-wrap">
              <h3 className="contact-form-title">Envoyez-nous un message</h3>
              <p className="contact-form-sub">Nous vous répondrons dans les plus brefs délais</p>

              {success ? (
                <div className="contact-success">
                  <p style={{ fontSize: "3rem", margin: 0 }}>✅</p>
                  <h4>Message envoyé !</h4>
                  <p>Nous avons bien reçu votre message et nous vous répondrons très bientôt.</p>
                  <button onClick={() => setSuccess(false)} className="contact-btn">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="contact-field">
                        <label>Nom complet *</label>
                        <input
                          type="text"
                          name="nom"
                          placeholder="Votre nom"
                          value={form.nom}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="contact-field">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="votre@email.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="contact-field">
                        <label>Téléphone</label>
                        <input
                          type="text"
                          name="telephone"
                          placeholder="+216 XX XXX XXX"
                          value={form.telephone}
                          onChange={handleChange}
                        />
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="contact-field">
                        <label>Message *</label>
                        <textarea
                          name="message"
                          placeholder="Écrivez votre message ici..."
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                        />
                      </div>
                    </Col>
                  </Row>

                  {error && (
                    <div className="contact-error">{error}</div>
                  )}

                  <button type="submit" className="contact-btn" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Envoyer le message"}
                  </button>
                </form>
              )}
            </div>
          </Col>

        </Row>

        {/* ── GOOGLE MAPS ── */}
        <div className="contact-map">
          <iframe
            title="Miha Travel"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.234!2d10.098!3d33.881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDUyJzUxLjYiTiAxMMKwMDUnNTIuOCJF!5e0!3m2!1sfr!2stn!4v1234567890"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: 16 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>

      </Container>
    </div>
  );
};

export default Contact;