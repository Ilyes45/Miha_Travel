import {
    LOAD_VOYAGE,
    FAIL_VOYAGE,
    GET_ALL_VOYAGES,
    GET_ONE_VOYAGE,
    CREATE_VOYAGE,
    UPDATE_VOYAGE,
    DELETE_VOYAGE,
} from "../ActionsType/voyage";

const initState = {
    voyages: [],
    voyage: null,
    loadVoyage: false,
    errors: [],
};

const voyageReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case LOAD_VOYAGE:
            return { ...state, loadVoyage: true };
        case GET_ALL_VOYAGES:
            return { ...state, loadVoyage: false, voyages: payload };
        case GET_ONE_VOYAGE:
            return { ...state, loadVoyage: false, voyage: payload };
        case CREATE_VOYAGE:
            return { ...state, loadVoyage: false, voyages: [...state.voyages, payload] };
        case UPDATE_VOYAGE:
            return {
                ...state,
                loadVoyage: false,
                voyages: state.voyages.map((v) => v._id === payload._id ? payload : v),
            };
        case DELETE_VOYAGE:
            return {
                ...state,
                loadVoyage: false,
                voyages: state.voyages.filter((v) => v._id !== payload),
            };
        case FAIL_VOYAGE:
            return { ...state, loadVoyage: false, errors: payload };
        default:
            return state;
    }
};

export default voyageReducer;