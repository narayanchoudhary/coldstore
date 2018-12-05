import * as actionTypes from '../actions/actionTypes';
const initState = {
    dashboard: [],
    partiesWithRemainingPackets: [],
    counters: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_DASHBOARD:
            newState = {
                ...state,
                dashboard: action.payload
            };
            break;
        case actionTypes.FETCH_PARTIES_WITH_REMAINING_PACKETS:
            newState = {
                ...state,
                partiesWithRemainingPackets: action.payload
            };
            break;
        case actionTypes.FETCH_COUNTERS:
            newState = {
                ...state,
                counters: action.payload
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;