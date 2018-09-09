import * as actionTypes from '../actions/actionTypes';
const initState = {
    javakLots: {
        data: [],
        error: false
    },
    addJavakLot: {
        error: false
    },
    deleteJavakLot: {
        error: false
    },
    avaks: [],
    lots: []
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.SAVE_JAVAK_LOT:
            if (action.payload.error) {
                newState = { ...state };
                newState.addJavakLot = { ...state.addJavakLot, error: true };
            } else {
                newState = { ...state };
                newState.addJavakLot = { ...state.addJavakLot, error: false };
            }
            break;
        case actionTypes.FETCH_JAVAK_LOTS:
            newState = { ...state };
            newState.javakLots = { ...state.javakLots, data: action.payload.data };
            break;
        case actionTypes.DELETE_JAVAK:
            if (action.payload.error) {
                newState = { ...state };
                newState.deleteJavak = { ...state.deleteJavak, error: true };
            } else {
                newState = { ...state };
                newState.deleteJavak = { ...state.deleteJavak, error: false };
            }
            break;
        case actionTypes.FETCH_AVAKS_OF_PARTY:
            newState = { ...state, avaks: action.payload };
            break;
        case actionTypes.FETCH_JAVAK_LOTS_BY_JAVAK_ID:
            newState = { ...state, lots: action.payload };
            break;
        case actionTypes.MODIFY_AVAKS:
            newState = { ...state, avaks: action.payload };
            break;
        default: return state;
    }
    return newState;
}

export default reducer;