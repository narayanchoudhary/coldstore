import * as actionTypes from '../actions/actionTypes';
const initState = {
    rents: [],
    lastRent: null,
    newReceiptNumberOfRent: undefined,
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_RENTS:
        newState = {
            ...state,
            rents: action.payload,
        };
        break;
        case actionTypes.FETCH_LAST_RENT:
            newState = {
                ...state,
                lastRent: action.payload
            };
            break;
        case actionTypes.FETCH_NEW_RECEIPT_NUMBER_OF_RENT:
            newState = {
                ...state,
                newReceiptNumberOfRent: action.payload
            }
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;