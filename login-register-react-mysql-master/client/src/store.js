// import { createStore, applyMiddleware, compose } from "redux";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//   rootReducer,
//   initialState,
//   compose(
//     applyMiddleware(...middleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );

// export default store;


//store 
// import {combineReducers,applyMiddleware, createStore} from "redux"
// import thunk from "redux-thunk"
// import authReducers from "./reducers/authReducers"
// import errorReducers from "./reducers/errorReducers"
// import { legacy_createStore } from "redux"
// // import thunk from "redux-thunk"
// const Rootreducer=combineReducers({
//     auth:authReducers,
//     errors:errorReducers


// })
// // const composeEnhancer=window.__REDUX_DEVTOOLS_EXTENTION_COMPOSE__ || compose
// // export const store=legacy_createStore(Rootreducer,composeEnhancer(applyMiddleware(thunk) ))
// // when displaying redux devtools using else use below line 

// export const store= createStore(Rootreducer,applyMiddleware(thunk) )


import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducers";
import errorReducer from "./reducers/errorReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
