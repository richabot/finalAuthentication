import * as userService from "../services/userService";
import login from "../services/authService";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SAVE_EMAIL_PASSWORD, SET_CURRENT_USER, USER_LOADING } from "./types";
// import { response } from "express";

// Register User
export const registerUser = userData => async dispatch => {
  try {
    await userService.register(userData);
    window.location = "/login";
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Login - store user token
export const loginUser = userData => async dispatch => {
  try {
    const response = await login(userData.email, userData.password);
    //return
    console.log(response,"response in login user")
    const { data: jwt,status } = await login(userData.email, userData.password);
    console.log(jwt,status,"current status")
    localStorage.setItem("token", jwt);
    // localStorage.token= jwt
   
    // Set token to Auth header
    setAuthToken(jwt);
    // Decode for user data
    const decoded = jwt_decode(jwt);
    console.log(decoded,"decoded ")
    
      // saveEmailAndPassword(userData.email, userData.password);
      // dispatch(saveEmailAndPassword(userData.email, userData.password));
    if(status === 206){
      localStorage.loggedin = false;
      localStorage.setItem("email",userData.email)
      localStorage.setItem("password",userData.password)

      // saveEmailAndPassword(userData.email, userData.password);
     alert('we are mving')
      window.location = "/otp";
     
  } else if(status === 200) {
      // localStorage.clear();
    //  saveEmailAndPassword(userData.email, userData.password);
    localStorage.setItem("email",userData.email)
    localStorage.setItem("password",userData.password)
      localStorage.loggedin = true;
      window.location="/"
  }

  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const saveEmailAndPassword = (email, password)=>(dispatch) => {
  console.log("in action",email,password)
  dispatch ({
    type: SAVE_EMAIL_PASSWORD,
    payload: {
      email,
      password
    }
  })
};



// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// User Logout
export const logoutUser = () => dispatch => {
  localStorage.removeItem("token");
  setAuthToken(false);
  // logout user and turn isAuthenticated to false
  dispatch(setCurrentUser({}));
  window.location = "/";
};
