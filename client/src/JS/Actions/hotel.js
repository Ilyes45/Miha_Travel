import axios from "axios";
import {
    LOAD_HOTEL,
    FAIL_HOTEL,
    GET_ALL_HOTELS,
    GET_ONE_HOTEL,
    CREATE_HOTEL,
    UPDATE_HOTEL,
    DELETE_HOTEL,
} from "../ActionsType/hotel";

const getConfig = () => ({
    headers: { authorization: localStorage.getItem("token") },
});

export const getAllHotels = () => async (dispatch) => {
    dispatch({ type: LOAD_HOTEL });
    try {
        const result = await axios.get("/api/hotel");
        dispatch({ type: GET_ALL_HOTELS, payload: result.data });
    } catch (error) {
        dispatch({ type: FAIL_HOTEL, payload: error.response });
    }
};

export const getOneHotel = (id) => async (dispatch) => {
    dispatch({ type: LOAD_HOTEL });
    try {
        const result = await axios.get(`/api/hotel/${id}`);
        dispatch({ type: GET_ONE_HOTEL, payload: result.data });
    } catch (error) {
        dispatch({ type: FAIL_HOTEL, payload: error.response });
    }
};

export const createHotel = (newHotel) => async (dispatch) => {
    dispatch({ type: LOAD_HOTEL });
    try {
        const result = await axios.post("/api/hotel", newHotel, getConfig());
        dispatch({ type: CREATE_HOTEL, payload: result.data.hotel });
    } catch (error) {
        dispatch({ type: FAIL_HOTEL, payload: error.response });
    }
};

export const updateHotel = (id, updatedData) => async (dispatch) => {
    dispatch({ type: LOAD_HOTEL });
    try {
        const result = await axios.put(`/api/hotel/${id}`, updatedData, getConfig());
        dispatch({ type: UPDATE_HOTEL, payload: result.data.hotel });
    } catch (error) {
        dispatch({ type: FAIL_HOTEL, payload: error.response });
    }
};

export const deleteHotel = (id) => async (dispatch) => {
    dispatch({ type: LOAD_HOTEL });
    try {
        await axios.delete(`/api/hotel/${id}`, getConfig());
        dispatch({ type: DELETE_HOTEL, payload: id });
    } catch (error) {
        dispatch({ type: FAIL_HOTEL, payload: error.response });
    }
};