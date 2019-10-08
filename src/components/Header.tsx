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
        <Nav.Link
          target="blank"
          href="https://github.com/ethersphere/devconV/blob/master/WORKSHOPS/Incentivized/WORKSHOP.md"
        >
          Instructions (online)
        </Nav.Link>
        <Nav.Link target="blank" href="/instructions.md">
          Instructions (offline)
        </Nav.Link>
        <Nav.Link target="blank" href="http://192.168.55.102/">
          Faucet
        </Nav.Link>
        <Nav.Link target="blank" href="http://192.168.55.103:9999/DOWNLOADS/">
          Binaries
        </Nav.Link>
        <AddConnectionButton variant="outline-primary" />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
