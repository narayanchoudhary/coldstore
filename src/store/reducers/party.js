import * as actionTypes from '../actions/actionTypes';
const initState = {
    parties: [],
    options: [],
    filteredPartiesOptions: [],
    filteredMerchantsOptions: [],
    showPartySearchPopup: false,
    statusOfSingleParty: [],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_PARTIES:
            newState = {
                ...state,
                parties: action.payload.data,
                options: action.payload.options
            };
            break;
        case actionTypes.FILTER_PARTIES:
            newState = {
                ...state,
                filteredPartiesOptions: action.payload,
            };
            break;
        case actionTypes.FILTER_MERCHANTS:
            newState = {
                ...state,
                filteredMerchantsOptions: action.payload,
            };
            break;
        case actionTypes.SHOW_PARTY_SEARCH_POPUP:
            newState = {
                ...state,
                showPartySearchPopup: action.payload
            }
            break;
        case actionTypes.FETCH_STATUS_OF_SINGLE_PARTY:
            newState = {
                ...state,
                statusOfSingleParty: action.payload
            }
            break;

        default: return state;
    }
    return newState;
}

export default reducer;