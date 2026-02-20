import {
    LOAD_DESTINATION,
    FAIL_DESTINATION,
    GET_ALL_DESTINATIONS,
    CREATE_DESTINATION,
    UPDATE_DESTINATION,
    DELETE_DESTINATION,
} from "../ActionsType/destination";

const initState = {
    destinations: [],
    loadDestination: false,
    errors: [],
};

const destinationReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case LOAD_DESTINATION:
            return { ...state, loadDestination: true };
        case GET_ALL_DESTINATIONS:
            return { ...state, loadDestination: false, destinations: payload };
        case CREATE_DESTINATION:
            return { ...state, loadDestination: false, destinations: [...state.destinations, payload] };
        case UPDATE_DESTINATION:
            return {
                ...state,
                loadDestination: false,
                destinations: state.destinations.map((d) => d._id === payload._id ? payload : d),
            };
        case DELETE_DESTINATION:
            return {
                ...state,
                loadDestination: false,
                destinations: state.destinations.filter((d) => d._id !== payload),
            };
        case FAIL_DESTINATION:
            return { ...state, loadDestination: false, errors: payload };
        default:
            return state;
    }
};

export default destinationReducer;