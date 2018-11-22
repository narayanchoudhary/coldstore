import * as actionTypes from '../actions/actionTypes';
const initState = {
    expenses: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_EXPENSES:
            newState = {
                expenses: action.payload.data,
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;