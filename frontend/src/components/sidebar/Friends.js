import React from 'react'
import './sidebar.css'

// This is the component for the friends list

// Used initial state since resetting of state is needed
const INITIAL_STATE = {
  friends: [],
  friendsid: null,
  id: localStorage.getItem("id")
}
// This maps the friends of the user and each is linked to their profiles
class Friends extends React.Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE
    this.mapFriends = this.mapFriends.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    // Checks if there is a change in friends
    if (JSON.stringify(prevProps.friends) !== JSON.stringify(this.props.friends)){
      this.setState(INITIAL_STATE)
      this.setState({friendsid: this.props.friends}, this.mapFriends)
    }
  }
  // Gets the profile of the user's friends by their id
  mapFriends(){
    if(this.state.friendsid){
      this.state.friendsid.map((each, index) => {
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
            // Body holds each users profile prevState used for mapping each individual
            this.setState(prevState => ({
              friends: [body, ...prevState.friends]
            }))
          })
        )
      })
    }
  }

    render() {
        return(
            <div className="containerSide">
                <div className="title"> Friends List </div>
                {/* Maps the data from the friend list */}
                {
                    this.state.friends.map((each, index) => {
                      var link = "profile?id="+each._id         //link to each profile's profile
                          return (
                              <a key={index} href={link}>
                                <div className="friendContainer">
                                    <div className="friend"> {each.firstname} {each.lastname}</div>
                                    {/* Profile picture takes the first letter of the first name */}
                                    <div id="profilePic"> {each.firstname[0]} </div> 
                                </div>
                              </a>
                        )
                    })
                }
            </div>
        )
    }
}

export default Friends