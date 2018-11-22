import * as actionTypes from '../actions/actionTypes';
const initState = {
    avaks: [],
    avaksOfSingleParty: [],
    lastAvak: {},
    newReceiptNumber: undefined
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_AVAKS:
            newState =  {
                ...state,
                avaks: action.payload };
            break;
        case actionTypes.FETCH_AVAKS_BY_PARTY_ID:
            newState = {
                ...state,
                avaksOfSingleParty: action.payload.avaks,
                avakIdsOfSingleParty: action.payload.avakIdsOfSingleParty
            }
            break;
        case actionTypes.FETCH_LAST_AVAK:
            newState = {
                ...state,
                lastAvak: action.payload
            }
            break;
        case actionTypes.FETCH_NEW_RECEIPT_NUMBER:
            newState = {
                ...state,
                newReceiptNumber: action.payload
            }
            break;
        default: return state;
    }
    return newState;
}

export default reducer;