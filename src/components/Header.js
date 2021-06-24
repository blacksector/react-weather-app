import React from 'react';
import ReactBootstrap, { Nav, Navbar } from 'react-bootstrap';

export default function Header() {
    return (
        <Navbar bg="dark" variant="dark" expand="xs">
            <Navbar.Brand href="#home">Weather App</Navbar.Brand>
        </Navbar>
    )
}
