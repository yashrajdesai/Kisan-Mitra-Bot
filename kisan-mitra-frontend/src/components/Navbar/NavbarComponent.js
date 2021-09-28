import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

import logo from "./logo.png"
import "./NavbarComponent.css"

export default function NavbarComponent() {
    return (
        <Navbar expand="lg" className="navbar-color p-0" variant="dark">
            <LinkContainer to="/">
                <Navbar.Brand className="d-flex align-items-center">
                    <img
                        src= { logo }
                        width="50"
                        height="50"
                        className="d-inline-block align-top logo ms-md-4 ms-1 "
                        alt="Agriculure Logo"
                    />

                    <span className="d-inline-block align-center ms-md-4 ms-1 mt-1 title">
                        Kisan Mitra
                    </span>
                </Navbar.Brand>
            </LinkContainer>
                
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto navbar-content">    

                    <LinkContainer to="/">
                        <Nav.Link  className="mx-4"><span className="linkText">Our Bot</span></Nav.Link>
                    </LinkContainer>  

                    <LinkContainer to="/about">
                        <Nav.Link className="mx-4"><span className="linkText">About</span></Nav.Link>
                    </LinkContainer>  

                    <LinkContainer to="/analytics">
                        <Nav.Link className="mx-4"><span className="linkText">Analytics</span></Nav.Link>
                    </LinkContainer>

                    {/* <LinkContainer to="/login" onClick = {handleLogin}>
                        {user ? 
                            <Nav.Link className="ml-4 mr-4"><span className="linkText">Sign out</span></Nav.Link> :
                            <Nav.Link className="ml-4 mr-4"><span className="linkText">Login</span></Nav.Link>
                        }
                    </LinkContainer> */}
                    
                    <LinkContainer to="/login">
                        <Nav.Link className="mx-4"><span className="linkText">Log in</span></Nav.Link>
                    </LinkContainer>

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
