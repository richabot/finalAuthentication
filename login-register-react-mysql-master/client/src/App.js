import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import NavBar from "./components/navbar";
import LoginForm from "./components/loginForm";
import LogOut from "./components/logout";
import RegisterForm from "./components/registerForm";
import HomePage from "./components/homePage";
import PasswordResetForm from "./components/resetPasswordForm";
import PasswordResetReceivedForm from "./components/passResetReceivedForm";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Setup from "./components/Setup";
import Otp from "./components/Otp";
// import  connect from ".redux";
import { connect } from 'react-redux';


class App extends Component {
  state = {};

  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const logged = localStorage.getItem("loggedin");
     
      const user = jwtDecode(jwt);
      console.log(user);
      this.setState({ user });
      this.setState({ logged });

    } catch (ex) {}
  }

  render() {
    const { user,logged } = this.state;
    console.log(user,logged,"details to be send")
    const isUserLoggedIn = user && logged == "true";
    console.log(isUserLoggedIn,"is logged in")
    console.log(user,logged,"creds to display")

    return (
      <React.Fragment>
        <NavBar user={this.state.user} logged={this.state.logged} authenticated={isUserLoggedIn}/>
        <main className="container-fluid">
          <Switch>

            <Route
              path="/users/reset_password_received/:userId/:token"
              render={({ match }) => (
                <PasswordResetReceivedForm
                  userId={match.params.userId}
                  token={match.params.token}
                />
              )}
            />
          { isUserLoggedIn && <Route
            path="/dashboard"
            render={() => (isUserLoggedIn? <Dashboard /> : <Redirect to="/login" />)}
          />
          
          }

        {
           isUserLoggedIn && <Route path="/logout" component={LogOut} />
          }
            <Route path="/users/reset_password" component={PasswordResetForm} />
            <Route path="/login" component={LoginForm} />
           
            <Route path="/register" component={RegisterForm} />
            <Route path="/profile" component={Profile} />
            <Route path="/setup" component={Setup}/>
            <Route path="/otp" component={Otp}/>
            <Route
              path="/"
              render={() => <HomePage user={this.state.user} />}
            />
           
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;


