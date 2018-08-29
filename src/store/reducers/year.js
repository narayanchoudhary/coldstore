import * as actionTypes from '../actions/actionTypes';

const initState = {
    currentYear: null,
    years: []
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.CHANGE_YEAR:
            newState = {
                ...state,
                currentYear: action.payload
            }
            break;
        case actionTypes.FETCH_YEARS:
            newState = {
                ...state,
                years: action.payload
            };
            break;
        case actionTypes.FETCH_CURRENT_YEAR:
            newState = {
                ...state,
                currentYear: action.payload
            };
            break;
        default: return state;
    }
    return newState;
}

export default reducer;