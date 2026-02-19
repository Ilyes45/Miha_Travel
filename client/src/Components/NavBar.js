import React from 'react' 
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
const NavBar = () => {
  return (
    <div>
       <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/voyage">Voyages</Nav.Link>
            <Nav.Link href="/hotel">Hotels</Nav.Link>
            <Nav.Link href="/admin">Admin</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default NavBar
