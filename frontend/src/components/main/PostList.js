import React from 'react'
import Post from './Post'
import Edit from './Edit'
import './postlist.css';
const moment = require('moment');

// This is the component for the post lists component for edit and post is also included

class PostList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }
  // Updates the posts whenever there is a change in the server
  componentDidUpdate(){
    // Post request for getting posts of user and friends
    fetch("http://localhost:3001/getpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: this.props.id, friends: this.props.friends})
    })
    .then(response => response.json())
      .then(body => {
        if(this.state.post!==body){
          // Body contains posts of the user and friends
            this.setState({
              posts: body
            })
        }
    })
  }

  render() {
      return(
          <div className="containerMain">
              {/* Post component for adding new post */}
              <Post id={this.props.id} friends={this.props.friends}/>
              <div className="wrapper">
                  {/* Maps each of the post to the main container */}
                  {
                    this.state.posts.map((post, index) => {
                        var link = "profile?id="+post.author;       //links to the user
                        var time = moment(post.timestamp).format('MM-DD-YYYY hh:mm:ss a')     //convers time stamp for visual of the user
                        return (
                            <div key={index} className="post">
                                <div className="postTitle">
                                    {/* profile image uses first letter of the name of the author */}
                                    <div id="profileImage">{post.name[0]}</div>
                                    {
                                      post.author===this.props.id?
                                      <div id="name">{post.name}</div> :
                                      <div id="name"><a href={link}>{post.name}</a></div> 
                                    }
                                    <div id="time"> {time} </div>
                                </div>
                                <div className="postContent">
                                    {post.content} 
                                </div>
                                {/* Component would only run if the post is from the user logged in */}
                                {
                                  post.author === this.props.id ? <Edit id={this.props.id} post={post}/>
                                  : <div> </div>
                                }
                            </div>
                        )
                      }
                    )
                  }
              </div>
          </div>
      )
  }
}

export default PostList