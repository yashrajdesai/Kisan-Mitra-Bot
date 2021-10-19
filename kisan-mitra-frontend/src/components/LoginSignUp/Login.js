import { useHistory } from 'react-router-dom';
import React, {useState} from 'react'
import { Form, Container, Button } from 'react-bootstrap'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleEmailChange = e => {
            setEmail(e.target.value);
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    const history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                history.push("/")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
            });
    
    };

    return (
        <div>
            <Container align="center">
                <div className="login-form pb-5">
                    <Form align="left" style={{paddingTop: "20px"}} onSubmit={handleSubmit}>
        
                        <Form.Group controlId="email" className="fields">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Your Email-ID" onChange={handleEmailChange} required/>
                        </Form.Group>

                        <Form.Group controlId="password" className="fields">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Type A Password" onChange={handlePasswordChange} required/>
                        </Form.Group>

                        <div className="center">
                        <Button variant="primary" type="submit" style={{width: "100px",background: "#1C4D06", fontSize: "20px" ,height: "50px",marginTop: "1rem"}}>
                            LOGIN
                        </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    )
}

export default Login