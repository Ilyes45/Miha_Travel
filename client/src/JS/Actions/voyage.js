import axios from "axios";
import {
    LOAD_VOYAGE,
    FAIL_VOYAGE,
    GET_ALL_VOYAGES,
    GET_ONE_VOYAGE,
    CREATE_VOYAGE,
    UPDATE_VOYAGE,
    DELETE_VOYAGE,
} from "../ActionsType/voyage";

const getConfig = () => ({
    headers: {
        authorization: localStorage.getItem("token"),
    },
});

// GET ALL
export const getAllVoyages = () => async (dispatch) => {
    dispatch({ type: LOAD_VOYAGE });
    try {
        const result = await axios.get("/api/voyage");
        dispatch({ type: GET_ALL_VOYAGES, payload: result.data });
    } catch (error) {
        dispatch({ type: FAIL_VOYAGE, payload: error.response });
    }
};

// GET ONE
export const getOneVoyage = (id) => async (dispatch) => {
    dispatch({ type: LOAD_VOYAGE });
    try {
        const result = await axios.get(`/api/voyage/${id}`);
        dispatch({ type: GET_ONE_VOYAGE, payload: result.data });
    } catch (error) {
        dispatch({ type: FAIL_VOYAGE, payload: error.response });
    }
};

// CREATE (admin)
export const createVoyage = (newVoyage) => async (dispatch) => {
    dispatch({ type: LOAD_VOYAGE });
    try {
        const result = await axios.post("/api/voyage", newVoyage, getConfig());
        dispatch({ type: CREATE_VOYAGE, payload: result.data.voyage });
    } catch (error) {
        dispatch({ type: FAIL_VOYAGE, payload: error.response });
    }
};

// UPDATE (admin)
export const updateVoyage = (id, updatedData) => async (dispatch) => {
    dispatch({ type: LOAD_VOYAGE });
    try {
        const result = await axios.put(`/api/voyage/${id}`, updatedData, getConfig());
        dispatch({ type: UPDATE_VOYAGE, payload: result.data.voyage });
    } catch (error) {
        dispatch({ type: FAIL_VOYAGE, payload: error.response });
    }
};

// DELETE (admin)
export const deleteVoyage = (id) => async (dispatch) => {
    dispatch({ type: LOAD_VOYAGE });
    try {
        await axios.delete(`/api/voyage/${id}`, getConfig());
        dispatch({ type: DELETE_VOYAGE, payload: id });
    } catch (error) {
        dispatch({ type: FAIL_VOYAGE, payload: error.response });
    }
};