import * as actionTypes from '../actions/actionTypes';
const initState = {
    transactions: [],
    lastTransaction: null,
    newReceiptNumberOfTransaction: undefined,
    transactionsOfSingleParty: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_TRANSACTIONS:
            newState = {
                ...state,
                transactions: action.payload,
            };
            break;
        case actionTypes.FETCH_LAST_TRANSACTION:
            newState = {
                ...state,
                lastTransaction: action.payload
            };
            break;
        case actionTypes.FETCH_NEW_RECEIPT_NUMBER_OF_TRANSACTION:
            newState = {
                ...state,
                newReceiptNumberOfTransaction: action.payload
            }
            break;
        case actionTypes.FETCH_TRANSACTIONS_OF_SINGLE_PARTY:
            newState = {
                ...state,
                transactionsOfSingleParty: action.payload
            }
            break;

        default:
            return state;
    }
    return newState;
}

export default reducer;