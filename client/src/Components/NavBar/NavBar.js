import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../JS/Actions/user';

const NavBar = () => {
  const { user, isAuth } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/accueil');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>
        <Navbar.Brand href="/accueil" className="fw-bold fs-4">
          ✈️ Miha Travel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          {/* ─── Liens publics ─── */}
          <Nav className="me-auto">
            <Nav.Link href="/accueil">Accueil</Nav.Link>
            <Nav.Link href="/voyage">Voyages</Nav.Link>
            <Nav.Link href="/hotel">Hotels</Nav.Link>
            {isAuth && user?.role === "admin" && (
              <Nav.Link href="/admin" className="text-danger fw-bold">
                🛠️ Admin
              </Nav.Link>
            )}
          </Nav>

          {/* ─── Droite ─── */}
          <Nav className="ms-auto align-items-center gap-2">
            {!isAuth ? (
              <>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login" className="fw-bold">Login</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/profile">👤 {user?.nom}</Nav.Link>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Déconnecter
                </Button>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;