import React, { useState, useEffect, useRef } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../JS/Actions/user';
import { getAllDestinations } from '../../JS/Actions/destination';
import { getAllVoyages } from '../../JS/Actions/voyage';
import NotifBell from '../NotifBell/NotifBell';
import './NavBar.css';

const NavBar = () => {
  const { user, isAuth } = useSelector((state) => state.userReducer);
  const { destinations } = useSelector((state) => state.destinationReducer);
  const { voyages }      = useSelector((state) => state.voyageReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [activePays,   setActivePays]   = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getAllDestinations());
    dispatch(getAllVoyages());
  }, [dispatch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActivePays(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/accueil');
  };

  const destAvecVoyages = destinations.filter(d =>
    voyages.some(v => v.destination?._id === d._id)
  );

  const grouped = destAvecVoyages.reduce((acc, d) => {
    if (!acc[d.paye]) acc[d.paye] = [];
    acc[d.paye].push(d);
    return acc;
  }, {});

  const pays = Object.keys(grouped);

  return (
    <>
      {/* ── TOPBAR ROUGE ── */}
      <div className="topbar">
        <div className="topbar-left">
          <span>+216 57 093 791</span>
          <span>contact@mihatravel.com</span>
          <span>32 Rue Mongi Slim Gabes</span>
        </div>
        <div className="topbar-right">
          <a href="https://www.facebook.com/p/Miha-Travel-Agency-100094864752165/?locale=fr_FR" target="_blank" rel="noreferrer" className="topbar-social">f</a>
          <a href="https://wa.me/21657093791" target="_blank" rel="noreferrer" className="topbar-social">w</a>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <Navbar expand="lg" className="main-navbar">
        <Container>

          <Navbar.Brand href="/accueil" className="navbar-logo">
            <img src="/logo.png" alt="Miha Travel" className="logo-img" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">

            <Nav className="mx-auto align-items-center gap-1">

              <Nav.Link href="/accueil" className="nav-link-custom">Accueil</Nav.Link>

              {/* ── MEGA MENU DESTINATION ── */}
              <div
                className="nav-dropdown-wrap"
                ref={dropdownRef}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => { setShowDropdown(false); setActivePays(null); }}
              >
                <button className="nav-link-custom nav-dest-btn">
                  Destination <span className="nav-plus">+</span>
                </button>

                {showDropdown && pays.length > 0 && (
                  <div className="mega-menu">
                    <div className="mega-menu-pays">
                      <p className="mega-menu-title">Pays</p>
                      {pays.map((p) => (
                        <button
                          key={p}
                          className={`mega-pays-item ${activePays === p ? "active" : ""}`}
                          onMouseEnter={() => setActivePays(p)}
                          onClick={() => setActivePays(p)}
                        >
                          {p}
                          <span className="mega-pays-count">{grouped[p].length}</span>
                          <span className="mega-pays-arrow">›</span>
                        </button>
                      ))}
                    </div>

                    {activePays && grouped[activePays] && (
                      <div className="mega-menu-dests">
                        <p className="mega-menu-title">{activePays}</p>
                        {grouped[activePays].map((d) => (
                          <button
                            key={d._id}
                            className="mega-dest-item"
                            onClick={() => {
                              navigate(`/voyage?destination=${d._id}`);
                              setShowDropdown(false);
                              setActivePays(null);
                            }}
                          >
                            {d.nom}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Nav.Link href="/hotel"      className="nav-link-custom">Nos Hotels</Nav.Link>
              <Nav.Link href="/promotions" className="nav-link-custom">Offres</Nav.Link>
              <Nav.Link href="/contact"    className="nav-link-custom">Contact</Nav.Link>

              {isAuth && user?.role === "admin" && (
                <Nav.Link href="/admin" className="nav-link-admin">Admin</Nav.Link>
              )}
            </Nav>

            {/* ── DROITE ── */}
            <div className="nav-right">
              {isAuth && user?.role === "admin" && (
  <NotifBell />
)}
              {!isAuth ? (
                <div className="nav-auth">
                  <Nav.Link href="/login"    className="nav-link-custom">Login</Nav.Link>
                  <Nav.Link href="/register" className="nav-btn-register">Register</Nav.Link>
                </div>
              ) : (
                <div className="nav-auth">
                  <Nav.Link href="/profile" className="nav-link-custom">{user?.nom}</Nav.Link>
                  <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                    Deconnecter
                  </Button>
                </div>
              )}
            </div>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;