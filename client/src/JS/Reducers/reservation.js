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

const initState = {
  reservations: [],
  myReservations: [],
  loadReservation: false,
  errors: null,
};

const reservationReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case LOAD_RESERVATION:
      return { ...state, loadReservation: true };

    case GET_MY_RESERVATIONS:
      return { ...state, loadReservation: false, myReservations: payload };

    case GET_ALL_RESERVATIONS:
      return { ...state, loadReservation: false, reservations: payload };

    case CREATE_RESERVATION:
      return {
        ...state,
        loadReservation: false,
        myReservations: [payload, ...state.myReservations],
      };

    case CANCEL_RESERVATION:
      return {
        ...state,
        loadReservation: false,
        myReservations: state.myReservations.map((r) =>
          r._id === payload._id ? payload : r
        ),
      };

    case UPDATE_STATUT:
      return {
        ...state,
        loadReservation: false,
        reservations: state.reservations.map((r) =>
          r._id === payload._id ? payload : r
        ),
      };

    case DELETE_RESERVATION:
      return {
        ...state,
        loadReservation: false,
        reservations: state.reservations.filter((r) => r._id !== payload),
      };

    case FAIL_RESERVATION:
      return { ...state, loadReservation: false, errors: payload };

    default:
      return state;
  }
};

export default reservationReducer;