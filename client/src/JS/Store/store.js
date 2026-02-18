// import cerateStore 

import {createStore, applyMiddleware,compose} from "redux";

// import rootReducers

import rootReducer from "../Reducers";
import {thunk}  from "redux-thunk";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// store 
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// export store

export default store;