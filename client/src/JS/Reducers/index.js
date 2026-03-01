import {combineReducers} from "redux";
import userReducer from "./user";
import voyageReducer from "./voyage";
import destinationReducer from "./destination";
import hotelReducer from "./hotel";
import reservationReducer from "./reservation";

const rootReducer = combineReducers({userReducer,voyageReducer,destinationReducer,hotelReducer,reservationReducer});

export default rootReducer;