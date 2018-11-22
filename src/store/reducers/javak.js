import * as actionTypes from '../actions/actionTypes';
const initState = {
    javaks: [],
    avaksOfParty: [],
    lastJavak: { party: {}, type: {} },
    newReceiptNumber: undefined,
    javaksOfSingleMerchant: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_JAVAKS:
            newState = {
                ...state,
                javaks: action.payload
            };
            break;
        case actionTypes.FETCH_AVAKS_OF_PARTY:
            newState = {
                ...state,
                avaksOfParty: action.payload.data
            };
            break;
        case actionTypes.FETCH_LAST_JAVAK:
            newState = {
                ...state,
                lastJavak: action.payload
            };
            break;
        case actionTypes.FETCH_JAVAKS_OF_SINGLE_MERCHANT:
            newState = {
                ...state,
                javaksOfSingleMerchant: action.payload
            }
            break;
        case actionTypes.FETCH_NEW_RECEIPT_NUMBER_FOR_JAVAK:
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