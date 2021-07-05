// LAR, JEFF EMERSON F.
// 2019-03845
// EXERCISE 10
// 06/09/2021

// This website has core pages signup, login, feed, profile and search with backend and fronend support

// THIS IS THE FRONT END

import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Feed from "./pages/Feed"
import Search from "./pages/Search"
import Profile from "./pages/Profile"
import "./app.css"
// imports

function App() {
  return (
    // Pages for the website
    <div>
      <BrowserRouter>
        <div>
          <Route exact={true} path="/" component={Home} />
          <Route exact={true} path="/log-in" component={Login} />
          <Route exact={true} path="/sign-up" component={Signup} />
          <Route exact={true} path="/feed" component={Feed} />
          <Route exact={true} path="/search" component={Search} />
          <Route exact={true} path="/profile" component={Profile} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;