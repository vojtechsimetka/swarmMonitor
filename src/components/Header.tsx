import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

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
        <Nav.Link href="https://github.com/ethersphere/devconV/tree/master/WORKSHOPS/Incentivized">
          Instructions
        </Nav.Link>
        <AddConnectionButton variant="outline-primary" />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
