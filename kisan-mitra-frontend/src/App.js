import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import {firestore as db} from "./firebase.js";

import './App.css';
import NavbarComponent from './components/Navbar/NavbarComponent';
import Statistics from "./components/Statistics/Statistics";
import Home from './components/Home/Home';
import LoginSignUp from "./components/LoginSignUp/LoginSignUp";
import { useStateValue } from "./StateProvider";

function App() {

  const [{}, dispatch] = useStateValue();

  useEffect(() => {

    const auth = getAuth();
    onAuthStateChanged(auth, async(authUser) => { 

      if (authUser) {
        //the user just logged in / the user was logged in
       
        const docRef = doc(db, "users", authUser.uid);
        const user = await getDoc(docRef);

        if (user.exists()) {
          dispatch({
            type:"SET_USER",
            user:user.data()
          });
          dispatch({
            type: "SET_USER_ID",
            userId: authUser.uid,
          });
        } else {
          console.log("No such document!");
          dispatch({
            type: "SET_USER",
            user: null,
          });
        }
      }

    });
  }, []);

  return (
    <div className="App">
      <Router >
        <NavbarComponent />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            {/* <Route path="/about">
              <About />
            </Route> */}
            <Route path="/analytics">
              <Statistics />
            </Route>
            <Route path="/login">
              <LoginSignUp />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
