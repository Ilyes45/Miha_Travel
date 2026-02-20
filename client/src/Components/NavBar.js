import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const NavBar = () => {
  const { user, isAuth } = useSelector((state) => state.userReducer);

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>
        <Navbar.Brand href="/accueil" className="fw-bold fs-4">
          ✈️ Miha Travel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          {/* ─── Liens publics (tout le monde) ─── */}
          <Nav className="me-auto">
            <Nav.Link href="/accueil">Accueil</Nav.Link>
            <Nav.Link href="/voyage">Voyages</Nav.Link>
            <Nav.Link href="/hotel">Hotels</Nav.Link>

            {/* ─── Admin seulement ─── */}
            {isAuth && user?.role === "admin" && (
              <Nav.Link href="/admin" className="text-danger fw-bold">
                🛠️ Admin
              </Nav.Link>
            )}
          </Nav>

          {/* ─── Droite : login/register ou profile/logout ─── */}
          <Nav className="ms-auto">
            {!isAuth ? (
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login" className="fw-bold">Login</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/profile">
                👤 {user?.nom}
              </Nav.Link>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;