import * as actionTypes from '../actions/actionTypes';
const initState = {
    setups: []
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_SETUPS:
            newState = {
                setups: action.payload.data
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;