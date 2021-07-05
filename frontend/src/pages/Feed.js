import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PostList from '../components/main/PostList';
import Header from '../components/header/Header';
import FriendReq from '../components/sidebar/FriendReq';
import Friends from '../components/sidebar/Friends';
import "../styles/feed.css"
// imports

// This is the main feed of the user only accessible to users who are logged in
// This is made up of reused components from previous exercises

export default class Feed extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      id: localStorage.getItem("id"),
      friends: [],      //would hold the friends of the user
      friendreq: []
    }
  }
  // Checking if logged in
  componentDidMount() {
    fetch("http://localhost:3001/checkifloggedin",
      {
        method: "POST",
        credentials: "include"
      })
    
    .then(response => response.json())
    .then(body => {
    if(body.isLoggedIn) {
      this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, id: localStorage.getItem("id")
    })
    } else {
      this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
    }
  });
  }
  // This would update to see if there was any changes in the friends and friend requests
  componentDidUpdate() {
    fetch("http://localhost:3001/findname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: this.state.id})
    })
    .then(response => response.json())
      .then(body => {
        if(this.state.user!==body){
          this.setState({
            friends: body.friends,
            friendreq: body.friendreq
          },
          )
        }
    })
  }

  render() {
    if (!this.state.checkedIfLoggedIn) {
      // delay redirect/render
      return (<div></div>)
    }

    else {
      if (this.state.isLoggedIn) {
        return (
          <div className="App">
            {/* header */}
            <Header />      
            <div className="content">
              {/* sidebar for Friend request */}
              <div className="left">
                <FriendReq friendreq={this.state.friendreq} id={this.state.id}/>
              </div>
              {/* main area for posts list */}
              <div className="main">
                <PostList id={this.state.id} friends={this.state.friends} />
              </div>
              {/* sidebar for friendlist */}
              <div className="right">
                <Friends friends={this.state.friends} id={this.state.id}/>
              </div>
            </div>
          </div>
        )
      } else {
        // If the user is not logged in redirect to the start
        return <Redirect to="/" />
      }
    }
  }
}