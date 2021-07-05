import React from 'react'
import './postlist.css'
// Imports

// This would only be accessible to posts that the user has created
// This is the component for editting post and deleting post
// Editting is similar to creating new post but this modifies only the content and the timestamp
class Edit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: "", 
      name: "",
      edit: false
    }

    this.toggle = this.toggle.bind(this)
    this.editpost = this.editpost.bind(this)
    this.delete = this.delete.bind(this)
  }
  // Deleting post
  delete(e) {
    // Post request for deleting of post
    fetch(
      "http://localhost:3001/deletepost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ post:this.props.post})
      })
      .then(response => response.json())
      .then(body => {
        if (body) { alert("Deleted") }
        else { alert("Failed to delete"); }
      });
  }
  // Editting post
  editpost(e) {
    // Post request for editting post
    fetch(
      "http://localhost:3001/editpost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ post:this.props.post, content:this.state.content, timestamp: new Date()})
      })
      .then(response => response.json())
      .then(body => {
        if (body) { alert("Edited") }
        else { alert("Failed to edit"); }
      });
      this.setState( {edit: !this.state.edit})
  };
  // Handles input change of the user
  handleInputChange = (e) => {
      this.setState({ content: e.target.value });
  };

  // Toggle edit text area
  toggle() {
    this.setState( {edit: !this.state.edit})
  }

  render() {
      return(
          <div className="containerEdit">
            {/* Button for toggle edit */}
            <button className="edit" onClick={this.toggle}>Edit </button>
            {/* Button for deleting post */}
            <button className="delete" onClick={this.delete}>Delete </button>
            {/* If toggled edit form would show */}
            {
              this.state.edit ? 
              <div className="editPost">
                <form onSubmit={this.editpost}>
                    {/* Textarea would contain the post content */}
                    <textarea className="textInput" id="post-text" onChange={this.handleInputChange} value={this.state.content} placeholder="Write new post."></textarea>
                    {/* Button for edit */}
                    <button className="butSub" type="submit" id="addForm"> EDIT </button>
                </form>
              </div> :
              <div> </div>
            }
          </div>
      )
  }
}

export default Edit