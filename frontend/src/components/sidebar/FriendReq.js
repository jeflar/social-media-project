import React from 'react'
import "./sidebar.css"

// This is the component for the friend request list

// Used initial state since resetting of state is needed
const INITIAL_STATE = {
    friendreqid:[],
    friendreq:[],
    id: localStorage.getItem("id")
};

// This allows accepting and deleting of friend requests
class FriendReq extends React.Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;

    this.accept = this.accept.bind(this)
    this.delete = this.delete.bind(this)
    this.mapFriendReq = this.mapFriendReq.bind(this)
  }

  componentDidMount() {
    this.setState({ friendreqid: this.props.friendreq})
  }

  componentDidUpdate(prevProps,prevState) {
    // Checks if there is no change to the friend request
    if((JSON.stringify(prevProps.friendreq) !== JSON.stringify(this.props.friendreq))){
      // Re initiate state to prevent duplication
    this.setState(INITIAL_STATE)
      this.setState(
        {
          friendreqid: this.props.friendreq
        },
        this.mapFriendReq
        );
    }

  }
  // Would get the profiles of each user's friend request
  mapFriendReq(){ 
    this.state.friendreqid.map((each, index) => {
      return (
        fetch("http://localhost:3001/findname", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: each })
        })
        .then(response => response.json())
        .then(body => {
          this.setState(a => ({
            friendreq: [body, ...a.friendreq]
          }))
        })
      )
    })
  }
  // Accepts friend request
  accept(e) {
    // Removes the request
    this.delete(e)      
    // Post request for adding friend
    fetch(
      "http://localhost:3001/addfriend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: e.target.id, userid: this.state.id})
      })
      .then(response => response.json())
      .then(body => {
        if (body) { alert("Friend accepted") }
        else { alert("Failed to accept"); }
    });
  }
  // Deletes friend request
  delete(e) {
    // Post request for deleting friend request
    fetch(
      "http://localhost:3001/deletereq",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: e.target.id, userid: this.state.id})
      })
      .then(response => response.json())
      .then(body => {
        if (body) {  
          // Filters the removed friend request
          this.setState(prevState => ({     	
        friendreqid: prevState.friendreq.filter(id => id._id!==e.target.id) 
        }));
    }
        else { alert("Fail to reject"); }
    });

  }

    render() {
      return(
          <div className="containerSide" style={{marginLeft: "10px"}}>
              <div className="title"> Friend Request </div>
              {/* Maps the friendrequest to a UI */}
              {
                this.state.friendreq.map((each,index) => {
                    return (
                      <div className="reqcontainer" key={index}>
                          <div id="top">
                            <div id="reqPhoto">{each.firstname[0]}</div>
                            <div id="name">{each.firstname} {each.lastname}</div>
                          </div>
                          <div id="bottom">
                            {/* Button for accepting friend request */}
                            <button onClick={this.accept} className="reqbut" id={each._id}> Accept </button>    
                            {/* Button for declining friend request */}
                            <button onClick={this.delete} className="reqbut" id={each._id}> Reject </button>
                          </div>
                      </div>
                    )
                })
              }
          </div>
      )
    }
}

export default FriendReq