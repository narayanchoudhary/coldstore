import * as actionTypes from '../actions/actionTypes';
const initState = {
    parties: {
        data: [],
        error: false
    }
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.SAVE_PARTY:
            if (action.payload.error) {
                newState = { ...state };
                newState.addParty = { ...state.addParty, error: true };
            } else {
                newState = { ...state };
                newState.addParty = { ...state.addParty, error: false };
            }
            break;
        case actionTypes.FETCH_PARTIES:
            newState = { ...state };
            newState.parties = { ...state.parties, data: action.payload.data };
            break;
        case actionTypes.DELETE_PARTY:
            if (action.payload.error) {
                newState = { ...state };
                newState.deleteParty = { ...state.deleteParty, error: true };
            } else {
                newState = { ...state };
                newState.deleteParty = { ...state.deleteParty, error: false };
            }
            break;
        default: return state;
    }
    return newState;
}

export default reducer;