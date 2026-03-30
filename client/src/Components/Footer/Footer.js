import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const LINKS = [
  { label: "Accueil",  path: "/accueil"     },
  { label: "Voyages",  path: "/voyage"      },
  { label: "Hôtels",   path: "/hotel"       },
  { label: "Offres",   path: "/promotions"  },
  { label: "Contact",  path: "/contact"     },
];

const CONTACT = [
  { icon: "📍", text: "32 Rue Mongi Slim, Gabès, Tunisie" },
  { icon: "📞", text: "+216 57 093 791"                   },
  { icon: "✉️", text: "contact@mihatravel.com"            },
  { icon: "🕐", text: "Lun – Sam : 8h00 – 18h00"         },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <Container>
        <Row className="g-4 footer-top">

          {/* ── LOGO ── */}
          <Col md={4}>
            <img src="/logo.png" alt="Miha Travel" className="footer-logo" />
            <p className="footer-desc">
              Votre partenaire de confiance pour des voyages inoubliables.
              Découvrez le monde avec Miha Travel Agency.
            </p>
          </Col>

          {/* ── LIENS ── */}
          <Col md={2}>
            <h6 className="footer-title">Liens rapides</h6>
            <ul className="footer-links">
              {LINKS.map(({ label, path }) => (
                <li key={path}>
                  <button onClick={() => navigate(path)}>{label}</button>
                </li>
              ))}
            </ul>
          </Col>

          {/* ── CONTACT ── */}
          <Col md={3}>
            <h6 className="footer-title">Contact</h6>
            <ul className="footer-contact">
              {CONTACT.map(({ icon, text }) => (
                <li key={text}>
                  <span className="footer-contact-icon">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </Col>

          {/* ── RESEAUX ── */}
          <Col md={3}>
            <h6 className="footer-title">Suivez-nous</h6>
            <div className="footer-socials">
              
              <a   href="https://www.facebook.com/p/Miha-Travel-Agency-100094864752165"
                target="_blank" rel="noreferrer"
                className="footer-social-btn facebook"
              >
                Facebook
              </a>
              
              <a  href="https://wa.me/21657093791"
                target="_blank" rel="noreferrer"
                className="footer-social-btn whatsapp"
              >
                WhatsApp
              </a>
            </div>
          </Col>

        </Row>

        {/* ── COPYRIGHT ── */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Miha Travel Agency. Tous droits réservés.</p>
        </div>

      </Container>
    </footer>
  );
};

export default Footer;