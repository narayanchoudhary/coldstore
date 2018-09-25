import * as actionTypes from '../actions/actionTypes';
const initState = {
    dashboard: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_DASHBOARD:
            newState = {
                dashboard: action.payload
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;