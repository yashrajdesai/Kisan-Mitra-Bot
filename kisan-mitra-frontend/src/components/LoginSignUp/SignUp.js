import React, {useState} from 'react'
import { Form, Container, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, query, collection, where, getDocs, updateDoc, addDoc} from "firebase/firestore"; 
import {firestore as db} from "../../firebase.js";

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState2] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const history = useHistory();

    const handleNameChange = e => {
        setName(e.target.value);
    };

    const handleEmailChange = e => {
            setEmail(e.target.value);
    };

    const handlePhoneChange = e => {
        setPhone(e.target.value);
    };

    const handleCityChange = e => {
        setCity(e.target.value);
    };

    const handleDistrictChange = e => {
        setDistrict(e.target.value);
    };

    const handleStateChange = e => {
        setState2(e.target.value);
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    const handleconfirmPasswordChange = e => {
        setconfirmPassword(e.target.value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);

            setDoc(doc(db, "users", user.uid), {
                Name: name,
                UserID: user.uid,
                City: city,
                District: district,
                State: state,
                Phone: phone
            }).then(async() => {

                const q = query(collection(db, "usersStats"), where("name", "==", state));

                const querySnapshot = await getDocs(q);

                if(querySnapshot){
                    querySnapshot.forEach(async(document) =>{
                        var val = document.data().value;
                        
                        const docRef = doc(db, "usersStats", document.id)

                        await updateDoc(docRef, {
                            name: state,
                            value: val + 1
                        });

                    })
                }else{
                    await addDoc(collection(db, "usersStats"), {
                        name: state,
                        value: 1
                    });
                }     
                history.push('/')
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
        });
    };
    return (
        <div>
            <Container align="center" style={{marginBottom: "40px"}}>
                <div className="register-form">
                    <Form align="left" style={{paddingTop: "20px"}} onSubmit={handleSubmit}>
                        
                        <Form.Group controlId="name" className="fields">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="Your Name" onChange={handleNameChange} required/>
                        </Form.Group>

                        <Form.Group controlId="email" className="fields">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Your Email-ID" onChange={handleEmailChange} required/>
                        </Form.Group>

                        <Form.Group controlId="phone" className="fields">
                            <Form.Label>Mobile No.</Form.Label>
                            <Form.Control type="phone" placeholder="Your Mobile Number" onChange={handlePhoneChange} required/>
                        </Form.Group>
                        
                        <Form.Group controlId="city" className="fields">
                            <Form.Label>City/Village</Form.Label>
                            <Form.Control type="city" placeholder="Your City or Village" onChange={handleCityChange} required/>
                        </Form.Group>

                        <Form.Group controlId="district" className="fields">
                            <Form.Label>District</Form.Label>
                            <Form.Control type="district" placeholder="Your District" onChange={handleDistrictChange} required/>
                        </Form.Group>

                        <Form.Group controlId="state" className="fields">
                            <Form.Label>State</Form.Label>
                            <Form.Control type="state" placeholder="Your State" onChange={handleStateChange} required/>
                        </Form.Group>

                        <Form.Group controlId="password" className="fields">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Type A Password" onChange={handlePasswordChange} required/>
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" className="fields">
                            <Form.Label style={{marginTop: "1px" }}>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Re-Type The Password" onChange={handleconfirmPasswordChange} required/>
                        </Form.Group>
                        
                        {/* <Form.Group controlId="formBasicCheckbox" align="center">
                            <Form.Check type="checkbox" label="Agree to the terms and conditions." required/>
                        </Form.Group> */}
                        
                        <div className="center">
                        <Button variant="primary" type="submit" style={{width: "130px",background: "#1C4D06", fontSize: "25px" ,height: "50px",marginTop: "1rem"}}>
                            SUBMIT
                        </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    )
}

export default SignUp