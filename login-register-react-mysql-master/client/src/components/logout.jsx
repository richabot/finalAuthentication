import React, { Component } from "react";

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedin")
    localStorage.removeItem("email")
    localStorage.removeItem("password")
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
