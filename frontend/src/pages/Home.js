import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../styles/home.css"

// Page that simply chooses whether to login or signup
// Only accessible to users who are not logged in

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      signup: false,
      isLoggedIn: null,
      checkedIfLoggedIn: false
    }

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  // For redirecting to login page
  login(e){
    e.preventDefault()
    this.setState({ login: true });
  }
  // For redirecting to signup page
  signup(e){
    e.preventDefault()
    this.setState({ signup: true });
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
      if (!this.state.isLoggedIn) {
        // Checks if the user is logged in
        if (this.state.login){
          return <Redirect to="/log-in" />
        } else if(this.state.signup){
          return <Redirect to="/sign-up" />
        } else {
          return (
            <div>
              <div id="left" onClick={this.login}>
                Log In
              </div>
              <div id="right" onClick={this.signup}>
                Sign Up
              </div>
            </div>
          )
        }
      } else{
        return <Redirect to="/feed" />
      }
    }
  }
}