import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../styles/auth.css";
// Imports

// This is the signup page only accessible for users who are not logged in
export default class Signup extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      passValid: null,
      return: false,
      isLoggedIn: null,
      checkedIfLoggedIn: false
    }

    this.signup = this.signup.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  // Would get the data from the fields and send a post request to the server
  signup(e) {
    e.preventDefault();

    const user = {
      firstname: document.getElementById("s-firstname").value,
      lastname: document.getElementById("s-lastname").value,
      email: document.getElementById("s-email").value,
      password: document.getElementById("s-password").value,
      repassword: document.getElementById("s-repassword").value
    }
    this.setState({passValid: null})
    // send a POSt request to localhost:3001/signup
    fetch(
      "http://localhost:3001/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(body => {
        // For other prompts
        if (body.success === "no match") { this.setState({passValid: "no match"})}
        else if (body.success === "at least") {this.setState({passValid: "at least"})}
        else if (body.success === "length") {this.setState({passValid: "length"})}
        else if (body.success === "taken") {this.setState({passValid: "taken"})}
        else if (body.success) {
          // Successful saved
          alert("Successfully saved");
          // Resetting the values of the fields
          document.getElementById("s-firstname").value = ""
          document.getElementById("s-lastname").value = ""
          document.getElementById("s-email").value = ""
          document.getElementById("s-password").value = ""
          document.getElementById("s-repassword").value = ""
        }
        else { alert("Failed to save user"); }
      });
  }
  // Redirects to the page that chooses whether to login or signup
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
        // Redirects to feed if user is already logged in
        return <Redirect to="/feed" />
      } else {
        if(this.state.return){
          return <Redirect to="/" />
        } else {
          return (
            <div>
              <div style={{cursor:"pointer"}} className="return" onClick={this.redirect}> RETURN </div>
              {/* Form for signup */}
              <form onSubmit={this.signup}>
                <div className="authContainer">
                  <div className="authtitle"><h2>Sign Up</h2></div>
                  <div className="authfield"> <input className="authinput" type="text" id="s-firstname" placeholder="First Name" required/> </div>
                  <div className="authfield"> <input className="authinput" type="text" id="s-lastname" placeholder="Last Name" required/> </div>
                  <div className="authfield"> <input className="authinput" type="email" id="s-email" placeholder="Email" required/> 
                  {/* Prompt for checking if the email is already taken */}
                    {this.state.passValid==="taken" ?
                      <div className="invalid">
                          Email is already taken
                      </div> :
                      <div>
                      </div>
                    }
                  </div>
                  <div className="authfield"> <input className="authinput" type="password" id="s-password" placeholder="Password" required/> 
                  {/* Different error prompts */}
                    {this.state.passValid==="at least" ?
                      <div className="invalid">
                          Password should contain 1 number, 1 lowercase, 1 uppercase letter
                      </div> : this.state.passValid ==="no match" ?
                      <div className="invalid">
                          Password and Repeat Password should match
                      </div> : this.state.passValid === "length" ?
                      <div className="invalid">
                          Password should contain at least 8 characters
                      </div> : 
                      <div>
                      </div>
                    }
                  </div>
                  <div className="authfield"> <input className="authinput" type="password" id="s-repassword" placeholder="Repeat Password" required/> </div>
                  <button className="authbutton" id="signup">Sign Up</button>
                </div>
              </form>
            </div>
          )
        }
      }
    }
    }
}