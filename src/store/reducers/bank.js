import * as actionTypes from '../actions/actionTypes';
const initState = {
    banks: [],
    options: [],
    transactions: [],
    expenses: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_BANKS:
            newState = {
                banks: action.payload.data,
                options: action.payload.options
            };
            break;
        case actionTypes.FETCH_TRANSACTIONS_OF_SINGLE_BANK:
            newState = {
                ...state,
                transactions: action.payload
            };
            break;
        case actionTypes.FETCH_EXPENSES_OF_SINGLE_BANK:
            newState = {
                ...state,
                expenses: action.payload.data
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;