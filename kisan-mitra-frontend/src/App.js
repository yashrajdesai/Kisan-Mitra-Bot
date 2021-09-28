import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import NavbarComponent from './components/Navbar/NavbarComponent';
import Home from './components/Home/Home';


function App() {
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
            </Route>
            <Route path="/analytics">
              <Analytics />
            </Route> */}
          </Switch>
      </Router>
    </div>
  );
}

export default App;
