import React from 'react';
import ReactBootstrap, {Nav, Navbar, NavDropdown} from 'react-bootstrap';

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Brand href="#home">Weather App</Navbar.Brand>
        </Navbar>
    )
}
