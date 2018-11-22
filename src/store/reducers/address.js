import * as actionTypes from '../actions/actionTypes';
const initState = {
    addresses: [],
    options: []// formatted varieties for dropdown
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_ADDRESSES:
            newState = {
                ...state,
                addresses: action.payload.data,
                options: action.payload.options
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;