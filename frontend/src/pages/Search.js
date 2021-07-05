import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Header from '../components/header/Header';
import "../styles/feed.css"
// Imports

// This is the search page would only be accessible to users who are logged in
export default class Search extends Component {

constructor(props) {
    super(props)

    this.state = {
      search: [],
      id: localStorage.getItem("id"),
      checkedIfLoggedIn: false,
      isLoggedIn: null
    }

    this.search = this.search.bind(this);
}
// Searches for a user would not only be able to search for yourself
// Searches using first name or last name (not case sensitive)
search(e) {
  e.preventDefault();
  fetch(
      "http://localhost:3001/searchusers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: document.getElementById("s-id").value, id: this.state.id}),
      })
      .then(response => response.json())
      .then(body => {
        // body would hold the searched user's profile
        if (body) {this.setState({search: body})}
        else { alert("Failed"); }
      });
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
    if (!this.state.isLoggedIn){
      return <Redirect to ="/" />
    } else {
      const users = this.state.search;
      return (
        <div className="App">
          <Header />
          {/* Form for searching */}
          <form onSubmit={this.search}>
          <div className="main" id="searchContainer">
              <input className="searchbox" type="text" id="s-id" placeholder="Enter first name or last name" />
              <button className="searchbutton" id="search">Seach</button>
          </div>
          </form>
          {
            users.map((user, index) => {
                var link = "profile?id="+user._id       //Links to users profile
                return (
                    <a key={index} href={link}>
                      <div className="searchuser">
                            {/* profile image uses first letter of the name of the author */}
                            <div id="profileImage" style= {{float: "left"}}>{user.firstname[0]}</div>
                            <div id="name" style={{float: "left"}}>{user.firstname} {user.lastname} </div> <br />
                            <div id="name" style={{float: "left"}}>{user.email} </div>
                      </div>
                    </a>
                )
            })
          }
        </div>
      )
    }
  }
}
}