import {
     CURRENT_USER, 
     FAIL_USER,
      LOAD_USER,
       LOGOUT_USER,
        SUCC_USER ,
        UPDATE_USER,   
    DELETE_USER
} from "../ActionsType/user";

const initState = {
    user: null,
    loadUser: !!localStorage.getItem("token"), 
    errors: [],
    isAuth: false,
    msg: "",  // ✅ ajoute msg ici
};

const userReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case LOAD_USER:
            return { ...state, loadUser: true, msg: "" }; // ✅ reset msg à chaque requête
        case SUCC_USER:
            localStorage.setItem("token", payload.token);
            return { ...state, loadUser: false, user: payload.user, isAuth: true, msg: "" };
        case FAIL_USER:
            return { 
                ...state, 
                loadUser: false, 
                errors: payload,
                msg: payload?.data?.msg || payload?.data?.errors?.[0]?.msg || "Erreur"  // ✅ extrait le msg
            };
        case CURRENT_USER:    
            return { ...state, loadUser: false, user: payload, isAuth: true };
        case UPDATE_USER:
            return { ...state, loadUser: false, user: payload }; 
        case DELETE_USER:
            localStorage.removeItem("token");
            return { user: null, loadUser: false, errors: [], isAuth: false, msg: "" }; 
        case LOGOUT_USER:
            localStorage.removeItem("token");
            return { user: null, loadUser: false, errors: [], isAuth: false, msg: "" };
        default:
            return state;
    }
};

export default userReducer;