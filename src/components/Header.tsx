import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import LogoNavbar from "rifui/LogoNavbar";
import AddConnectionButton from "components/AddConnectionButton";

export default () => (
  <Navbar variant="dark" bg="dark" expand="lg" sticky="top">
    <Navbar.Brand>
      <LogoNavbar />
    </Navbar.Brand>
    <Nav.Link>Swarm Monitor</Nav.Link>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto justify-content-end">
        <Nav.Link href="https://hackmd.io/K5MLGDGzQW6NFb7SVPQcvg">
          Instructions
        </Nav.Link>
        <NavDropdown title="Download" id="basic-nav-dropdown">
          <NavDropdown.Item href="/binaries/linux/swarm">
            Linux (Ubuntu)
          </NavDropdown.Item>
          <NavDropdown.Item href="/binaries/mac/swarm">Mac</NavDropdown.Item>
          <NavDropdown.Item href="/binaries/windows/swarm.exe">
            Windows
          </NavDropdown.Item>
        </NavDropdown>
        <AddConnectionButton variant="outline-primary" />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
