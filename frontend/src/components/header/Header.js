import React from 'react'
import Cookies from "universal-cookie";
import { Redirect } from "react-router-dom";
import './header.css'
// Imports

// This is the component for the header contains the link to Feed, Search, Profile and Log Out
class Header extends React.Component {

constructor(props) {
  super(props);

  this.state = {
    logout: false
  }

  this.logout = this.logout.bind(this);
}

// Logout removes token
logout(e) {
    e.preventDefault();

    // Delete cookie with authToken
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Delete id in local storage
    localStorage.removeItem("id");

    this.setState({logout: true})
}

  
  render() {
      if (this.state.logout){
        // If logged out redirects to start
        return <Redirect to="/" />
      } else {
        // Links for the navigation in the header
        let url1="/feed";
        let url2="/search";
        let url3="/profile";
        return(
            <div className="top">
                {/* title in the header */}
                <div className="header">
                    <h1> LogBook </h1>
                </div>
                {/* links */}
                <div className="links">
                    <a href={url1}>Feed</a>
                    <a href={url2}>Search</a>
                    <a href={url3}>Profile</a>
                    {/* Logout button */}
                    <div className="logout" onClick={this.logout}> Logout </div>
                </div>
            </div>
        )
      }
  }
}

export default Header