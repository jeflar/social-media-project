import React, { Component } from "react";
import './post.css'

// This is the component for creating a new post

export default class Post extends Component {

  constructor(props) {
      super(props)

      this.state = {
        content: "",
        user: []
      }

      this.handleInputChange = this.handleInputChange.bind(this)
      this.addpost = this.addpost.bind(this)
  }
  // Adding post
  addpost(e) {
    e.preventDefault();
    // New post data
    const post = {
      author: this.props.id,
      name: this.state.user.firstname+" "+this.state.user.lastname,
      timestamp: new Date(),
      content: this.state.content
    }
    this.setState({content:""})
    // Post request for adding post
    fetch(
      "http://localhost:3001/addpost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({post: post})
      })
      .then(response => response.json())
      .then(body => {
        if (body) { alert("Successfully posted"); }
        else { alert("Failed to post"); }
      });
  }
  // Handles input change in the text area
  handleInputChange = (e) => {
      this.setState({ content: e.target.value });
  };
  // Mounts the users profile for adding to post
  componentDidMount() {
    // Post request for finding data of a user
    fetch("http://localhost:3001/findname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: this.props.id})
    })
    .then(response => response.json())
      .then(body => {
        // body contains the user's profile
        this.setState({
          user: body,
        })
    })
  }

  render() {
    return(
      // Posts container
      <div className="containerPost">
          {/* Post Form */}
          <form onSubmit={this.addpost}>
              <div className="titlePost">Create Post  </div><br /> <br />
              {/* Textarea would contain the post content */}
              <textarea className="textInput" id="post-text" onChange={this.handleInputChange} value={this.state.content} placeholder="What are you thinking about?"></textarea>
              {/* Button for adding of post */}
              <button className="butSub" type="submit" id="addForm"> POST </button>
          </form>
      </div>
    )
  }
}