import * as actionTypes from '../actions/actionTypes';
const initState = {
    avaks: {
        data: [],
        error: false
    },
    addAvak: {
        error: false
    },
    deleteAvak: {
        error: false
    }
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.SAVE_AVAK:
            if (action.payload.error) {
                newState = { ...state };
                newState.addAvak = { ...state.addAvak, error: true };
            } else {
                newState = { ...state };
                newState.addAvak = { ...state.addAvak, error: false };
            }
            break;
        case actionTypes.FETCH_AVAKS:
            newState = { ...state };
            newState.avaks = { ...state.avaks, data: action.payload.data };
            break;
        case actionTypes.DELETE_AVAK:
            if (action.payload.error) {
                newState = { ...state };
                newState.deleteAvak = { ...state.deleteAvak, error: true };
            } else {
                newState = { ...state };
                newState.deleteAvak = { ...state.deleteAvak, error: false };
            }
            break;
        default: return state;
    }
    return newState;
}

export default reducer;