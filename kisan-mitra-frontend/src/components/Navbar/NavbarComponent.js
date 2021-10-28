import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from 'react-router-dom';

import logo from "./logo.png"
import { useStateValue } from "../../StateProvider";
import "./NavbarComponent.css"

export default function NavbarComponent() {

    const [{user},dispatch] = useStateValue();

    const history = useHistory();

    const logout = () => {
        if(user) {
            const auth = getAuth();
            signOut(auth).then(() => {
                dispatch({
                    type: "SET_USER",
                    user: null,
                });

                history.push("/login")

            }).catch((error) => {
                console.log(error);
            });
        }
    }

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

                    <LinkContainer to="/analytics">
                        <Nav.Link className="mx-4"><span className="linkText">Analytics</span></Nav.Link>
                    </LinkContainer>
                    
                    <LinkContainer to="/login" onClick = {logout}>
                        {user ? 
                                <Nav.Link className="mx-4"><span className="linkText">Log out</span></Nav.Link> :
                                <Nav.Link className="mx-4"><span className="linkText">Log in/Sign Up</span></Nav.Link>
                        }
                    </LinkContainer>

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
