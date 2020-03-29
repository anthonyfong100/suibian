//app components
import React, { Component, ChangeEvent, FormEvent } from "react";
import NavBar from "./NavBar";

//other components
import { withRouter } from "react-router-dom";

//css
import "../css/CreateRoom.css";

// Sockets and Redux
import { SocketState } from "../types/SocketState";
import { suibianSocketClient } from "@suibian/commons";
import { connect } from "react-redux";
import ReduxState from "../types/ReduxState";
import { User } from "@suibian/commons";

import MapSearch from "./MapSearch";

// Types
type OwnProps = {
  history: any;
  location: any;
  match: any;
};

type StateProps = {
  socketState: SocketState;
  user: User;
};

type DispatchProps = {
  updateSocketState: (
    key: string,
    value: string | number | suibianSocketClient | null
  ) => void;
  updateUser: (key: string, value: string | boolean) => void;
  updateUsers: (users: User[]) => void;
};

type Props = StateProps & DispatchProps & OwnProps;

class CreateRoom extends Component<Props> {
  // When mounting, delete all roomCode and users from this state
  componentDidMount() {
    this.props.updateSocketState("roomCode", "");
    this.props.updateUsers([]);
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.updateUser("username", e.target.value);
  };

  // Function to handle creating room
  createRoom = (e: FormEvent) => {
    e.preventDefault();

    if (this.props.socketState.socket) {
      this.props.socketState.socket.emit("createRoom", {
        user: this.props.user
      });

      // Redirect to room lobby after creating room
      this.props.history.push("/roomlobby");
    }
  };

  render() {
    return (
      <>
        <NavBar />
        <div className="create-room">
          <div className="app-content flex-container flex-col">
            <h1 className="title">Create room</h1>
            <form
              className="create-room-form flex-container flex-col flex-center-v"
              onSubmit={this.createRoom}
            >
              <MapSearch />
              <input
                onChange={this.handleChange}
                id="username"
                placeholder="Username"
                className="username-input"
                autoComplete="off"
                required
              />
              <br></br>
              <button>CREATE ROOM</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

// Redux functions
const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    socketState: state.socketState,
    user: state.user
  };
};

// Links a dispatch function to a prop
const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    updateUsers: users => {
      dispatch({
        type: "UPDATE_USERS",
        users: users
      });
    },
    updateSocketState: (key, value) => {
      dispatch({
        type: "UPDATE_SOCKET_STATE",
        key: key,
        value: value
      });
    },
    updateUser: (key, value) => {
      dispatch({
        type: "UPDATE_USER",
        key: key,
        value: value
      });
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateRoom)
);
