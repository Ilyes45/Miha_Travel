import axios from "axios";
import {
    LOAD_DESTINATION,
    FAIL_DESTINATION,
    GET_ALL_DESTINATIONS,
    CREATE_DESTINATION,
    UPDATE_DESTINATION,
    DELETE_DESTINATION,
} from "../ActionsType/destination";

const getConfig = () => ({
    headers: { authorization: localStorage.getItem("token") },
});

export const getAllDestinations = () => async (dispatch) => {
    dispatch({ type: LOAD_DESTINATION });
    try {
        const result = await axios.get("/api/destination");
        dispatch({ type: GET_ALL_DESTINATIONS, payload: result.data });
    } catch (error) {
        dispatch({ type: FAIL_DESTINATION, payload: error.response });
    }
};

export const createDestination = (newDest) => async (dispatch) => {
    dispatch({ type: LOAD_DESTINATION });
    try {
        const result = await axios.post("/api/destination", newDest, getConfig());
        dispatch({ type: CREATE_DESTINATION, payload: result.data.destination });
    } catch (error) {
        dispatch({ type: FAIL_DESTINATION, payload: error.response });
    }
};

export const updateDestination = (id, updatedData) => async (dispatch) => {
    dispatch({ type: LOAD_DESTINATION });
    try {
        const result = await axios.put(`/api/destination/${id}`, updatedData, getConfig());
        dispatch({ type: UPDATE_DESTINATION, payload: result.data.destination });
    } catch (error) {
        dispatch({ type: FAIL_DESTINATION, payload: error.response });
    }
};

export const deleteDestination = (id) => async (dispatch) => {
    dispatch({ type: LOAD_DESTINATION });
    try {
        await axios.delete(`/api/destination/${id}`, getConfig());
        dispatch({ type: DELETE_DESTINATION, payload: id });
    } catch (error) {
        dispatch({ type: FAIL_DESTINATION, payload: error.response });
    }
};