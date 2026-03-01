import {
    LOAD_HOTEL,
    FAIL_HOTEL,
    GET_ALL_HOTELS,
    GET_ONE_HOTEL,
    CREATE_HOTEL,
    UPDATE_HOTEL,
    DELETE_HOTEL,
} from "../ActionsType/hotel";

const initState = {
    hotels: [],
    hotel: null,
    loadHotel: false,
    errors: [],
};

const hotelReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case LOAD_HOTEL:
            return { ...state, loadHotel: true };
        case GET_ALL_HOTELS:
            return { ...state, loadHotel: false, hotels: payload };
        case GET_ONE_HOTEL:
            return { ...state, loadHotel: false, hotel: payload };
        case CREATE_HOTEL:
            return { ...state, loadHotel: false, hotels: [...state.hotels, payload] };
        case UPDATE_HOTEL:
            return {
                ...state,
                loadHotel: false,
                hotels: state.hotels.map((h) => h._id === payload._id ? payload : h),
            };
        case DELETE_HOTEL:
            return {
                ...state,
                loadHotel: false,
                hotels: state.hotels.filter((h) => h._id !== payload),
            };
        case FAIL_HOTEL:
            return { ...state, loadHotel: false, errors: payload };
        default:
            return state;
    }
};

export default hotelReducer;