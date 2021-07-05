import React, { Component } from "react";
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import "../styles/auth.css";
// imports

// Login page this would only be accessible if the user is not logged in

export default class Login extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: null,
      valid: null, 
      return: false,
      checkedIfLoggedIn: false
    }
    this.login = this.login.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  // Login with email and password
  login(e) {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("l-email").value,
      password: document.getElementById("l-password").value
    }
    this.setState({valid: null})
    // Send a POST request
    fetch(
      "http://localhost:3001/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success === "no exist") { this.setState({valid: "no exist"}) }
        else if (body.success === "wrong") { this.setState({valid: "wrong"}) }
        else {
          // successful log in. store the token as a cookie

          const cookies = new Cookies();
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60*60,
              sameSite: "lax"
            });

            localStorage.setItem("id", body.id);
            alert("Successfully logged in");
            this.setState({ isLoggedIn: true });
        }
      })
  }
  // For returning to the "/" to choose again if login or signup
  redirect(){
    this.setState({return: true})
  }

  componentDidMount() {
    fetch("http://localhost:3001/checkifloggedin",
      {
        method: "POST",
        credentials: "include"
      })
    
    .then(response => response.json())
    .then(body => {
    if(body.isLoggedIn) {
      this.setState({ checkedIfLoggedIn: true, isLoggedIn: true
    })
    } else {
      this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
    }
  });
  }

  render() {
    if(!this.state.checkedIfLoggedIn){
      return <div></div>
    } else{
      if(this.state.isLoggedIn){
        // Redirects to the feed if the user is already logged in
        return <Redirect to="/feed" />
      } else {
        if(this.state.return){
          return <Redirect to="/" />
        } else {
            return(
              <div>
                <div style={{cursor:"pointer"}} className="return" onClick={this.redirect}> RETURN </div> 
                <form onSubmit={this.login}>
                  <div className="authContainer">
                    <div className="authtitle"><h2>Login</h2></div>
                    <div className="authfield"> <input className="authinput" type="text" id="l-email" placeholder="Email" /> </div>
                    {/* Error prompt when the email already exist */}
                      {this.state.valid==="no exist" ?
                        <div className="invalid">
                            Email does not exist
                        </div> : 
                        <div>
                        </div>
                     }
                    <div className="authfield"> <input className="authinput" type="password" id="l-password" placeholder="password" /> 
                    {/* Error prompt when the password is wrong */}
                      {this.state.valid==="wrong" ?
                        <div className="invalid">
                            Wrong Password
                        </div> : 
                        <div>
                        </div>
                     }
                    </div>
                    <button className="authbutton" id="login">Log In</button>
                  </div>
                </form>
              </div>
            )
        }
    }
    }
  }
}