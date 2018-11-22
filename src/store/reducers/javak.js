import * as actionTypes from '../actions/actionTypes';
const initState = {
    javaks: {
        data: [],
        error: false
    },
    addJavak: {
        error: false
    },
    deleteJavak: {
        error: false
    },
    avaksOfParty: [],
    lastJavak: { party: {}, type: {} },
    newReceiptNumber: undefined,
    javaksOfSingleMerchant: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.SAVE_JAVAK:
            if (action.payload.error) {
                newState = { ...state };
                newState.addJavak = { ...state.addJavak, error: true };
            } else {
                newState = { ...state };
                newState.addJavak = { ...state.addJavak, error: false };
            }
            break;
        case actionTypes.FETCH_JAVAKS:
            newState = { ...state };
            newState.javaks = { ...state.javaks, data: action.payload.data };
            break;
        case actionTypes.DELETE_JAVAK:
            if (action.payload.error) {
                newState = { ...state };
                newState.deleteJavak = { ...state.deleteJavak, error: true };
            } else {
                newState = { ...state };
                newState.deleteJavak = { ...state.deleteJavak, error: false };
            }
            break;
        case actionTypes.FETCH_AVAKS_OF_PARTY:
            newState = { ...state, avaksOfParty: action.payload.data };
            break;
        case actionTypes.FETCH_LAST_JAVAK:
            newState = { ...state, lastJavak: action.payload };
            break;
        case actionTypes.FETCH_JAVAKS_OF_SINGLE_MERCHANT:
            newState = {
                ...state,
                javaksOfSingleMerchant: action.payload
            }
            break;
        default: return state;
    }
    return newState;
}

export default reducer;