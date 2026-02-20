import {combineReducers} from "redux";
import userReducer from "./user";
import voyageReducer from "./voyage";
import destinationReducer from "./destination";

const rootReducer = combineReducers({userReducer,voyageReducer,destinationReducer});

export default rootReducer;