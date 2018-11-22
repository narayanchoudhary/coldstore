import * as actionTypes from '../actions/actionTypes';
const initState = {
    javakLots: [],
    avaks: [],
    lots: [],
    sumOfJavakLots: 0,
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_JAVAK_LOTS:
            newState = {
                ...state,
                javakLots: action.payload
            };
            break;
        case actionTypes.FETCH_AVAKS_OF_PARTY:
            newState = {
                ...state,
                avaks: action.payload
            };
            break;
        case actionTypes.FETCH_JAVAK_LOTS_BY_JAVAK_ID:
            newState = {
                ...state,
                lots: action.payload.lots,
                sumOfJavakLots: action.payload.sumOfJavakLots
            };
            break;
        case actionTypes.MODIFY_AVAKS:
            newState = {
                ...state,
                avaks: action.payload
            };
            break;
        default: return state;
    }
    return newState;
}

export default reducer;