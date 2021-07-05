import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Header from '../components/header/Header';
import "../styles/profile.css";
const queryString = require("query-string");          //query-string to be used when getting the query

export default class Profile extends Component {

constructor(props) {
    super(props)

    this.state = {
      userid: localStorage.getItem("id"),
      id: queryString.parse(props.location.search).id,      //query
      firstname: "",
      lastname: "",
      email: "",
      friends: [],
      friendreq: [],
      isLoggedIn: null,
      checkedIfLoggedIn: false
    }

    this.friendReq = this.friendReq.bind(this)
}
// Mounts the user
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

  if(this.state.id){
    //would run if there exist a query
    fetch("http://localhost:3001/findbyid?id="+this.state.id)
      .then(response => response.json())
      .then(body => {
        if(body){this.setState({ 
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
          friends: body.friends,
          friendreq: body.friendreq
        })}
        else {console.log("AYAW GAGO")}
      })
  } else {
    //would run if there is no query then that means the user is viewing his own profile
    fetch("http://localhost:3001/findname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: this.state.userid})
    })
    .then(response => response.json())
      .then(body => {
        this.setState({
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
        })
    })
  }
}
// Updates whenever there is a change in the friend request
// E.g. if a user has declined this user's friend req then this user should be able to send a friend req again
componentDidUpdate(prevProps,prevState) {
  if(this.state.id){
    fetch("http://localhost:3001/findbyid?id="+this.state.id)
      .then(response => response.json())
      .then(body => {
        if(body){this.setState({ 
          friends: body.friends,
          friendreq: body.friendreq
        })}
        else {console.log("Failed")}
      })
  }
}
// For sending friend request to the user
friendReq() {
  if(this.state.friends.includes(this.state.userid)){
    // Checks if the user is already in the friends list of the user to be added
    alert("Already your friend")
  } else if(this.state.friendreq.includes(this.state.userid)){
    // Checks if the user is already in the friends request list of the user to be added
    alert("Friend request already sent.")
  }else {
    // Post request to sending friend request
    fetch(
      "http://localhost:3001/friendrequest?id="+this.state.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: this.state.userid })
      })
      .then(response => response.json())
      .then(body => {
        if (body) { alert("Successfully added friend"); }
        else { alert("Ayaw sayo tol"); }
    });
  }
}
 
render() {
  if(!this.state.checkedIfLoggedIn){
    return <div></div>
  } else {
    if(this.state.isLoggedIn){
      // Redirects to start if the user is not logged in
      return (
        // UI for user profile
        <div className="App">
          <Header />      
          <div className="profileContainer">
            <div id="profilePhoto" style={{marginBottom: 30}}>{this.state.firstname[0]}</div>
            <div>{this.state.firstname} {this.state.lastname}</div> <br />
            <div>{this.state.email}</div>
            {/* Button for sending friend request */}
            {this.state.id? <button className="reqBut" onClick={this.friendReq}> Send Friend Request</button>:<div></div>}
          </div>
        </div>
      )
    } else{
      return <Redirect to="/" />
    }
  }
}
}