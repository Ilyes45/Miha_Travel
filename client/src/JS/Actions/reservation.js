import axios from "axios";
import {
  LOAD_RESERVATION,
  FAIL_RESERVATION,
  GET_MY_RESERVATIONS,
  GET_ALL_RESERVATIONS,
  CREATE_RESERVATION,
  CANCEL_RESERVATION,
  UPDATE_STATUT,
  DELETE_RESERVATION,
} from "../ActionsType/reservation";

const getConfig = () => ({
  headers: { authorization: localStorage.getItem("token") },
});

export const createReservation = (data) => async (dispatch) => {
  dispatch({ type: LOAD_RESERVATION });
  try {
    const result = await axios.post("/api/reservation", data, getConfig());
    dispatch({ type: CREATE_RESERVATION, payload: result.data.reservation });
    return { success: true };
  } catch (error) {
    dispatch({ type: FAIL_RESERVATION, payload: error.response });
    return { success: false };
  }
};

export const getMyReservations = () => async (dispatch) => {
  dispatch({ type: LOAD_RESERVATION });
  try {
    const result = await axios.get("/api/reservation/mes-reservations", getConfig());
    dispatch({ type: GET_MY_RESERVATIONS, payload: result.data });
  } catch (error) {
    dispatch({ type: FAIL_RESERVATION, payload: error.response });
  }
};

export const cancelMyReservation = (id) => async (dispatch) => {
  dispatch({ type: LOAD_RESERVATION });
  try {
    const result = await axios.put(`/api/reservation/annuler/${id}`, {}, getConfig());
    dispatch({ type: CANCEL_RESERVATION, payload: result.data.reservation });
  } catch (error) {
    dispatch({ type: FAIL_RESERVATION, payload: error.response });
  }
};

export const getAllReservations = () => async (dispatch) => {
  dispatch({ type: LOAD_RESERVATION });
  try {
    const result = await axios.get("/api/reservation", getConfig());
    dispatch({ type: GET_ALL_RESERVATIONS, payload: result.data });
  } catch (error) {
    dispatch({ type: FAIL_RESERVATION, payload: error.response });
  }
};

export const updateStatut = (id, statut) => async (dispatch) => {
  dispatch({ type: LOAD_RESERVATION });
  try {
    const result = await axios.put(`/api/reservation/statut/${id}`, { statut }, getConfig());
    dispatch({ type: UPDATE_STATUT, payload: result.data.reservation });
  } catch (error) {
    dispatch({ type: FAIL_RESERVATION, payload: error.response });
  }
};

export const deleteReservation = (id) => async (dispatch) => {
  dispatch({ type: LOAD_RESERVATION });
  try {
    await axios.delete(`/api/reservation/${id}`, getConfig());
    dispatch({ type: DELETE_RESERVATION, payload: id });
  } catch (error) {
    dispatch({ type: FAIL_RESERVATION, payload: error.response });
  }
};