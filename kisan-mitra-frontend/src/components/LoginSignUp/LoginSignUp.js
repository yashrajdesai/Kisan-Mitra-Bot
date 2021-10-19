import React from 'react'
import { Tabs, Tab } from 'react-bootstrap' 

import Login from './Login';
import SignUp from './SignUp';
import "./LoginSignUp.css"

export default function LoginSignUp() {
    return (
        <div className="loginSignUp-page">
            <Tabs defaultActiveKey="Login" id="uncontrolled-tab-example" className="mb-3 justify-content-center">
                <Tab eventKey="Login" title="Login" className="loginSignUp-tab">
                    <Login />
                </Tab>
                <Tab eventKey="Sign Up" title="Sign Up" className="loginSignUp-tab">
                    <SignUp />
                </Tab>
            </Tabs>
        </div>
    )
}
