import { SAVE_EMAIL_PASSWORD, SET_CURRENT_USER, USER_LOADING } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  email: '',
  password: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    
    case SET_CURRENT_USER:
      console.loh(action.payload,"inside auth reducer setcurrentuser")
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
      case SAVE_EMAIL_PASSWORD:
       console.log(action.payload,"save meail")
      return {
        ...state,
        email: true,
        password:true
      };
    default:
      return state;
  }
}
