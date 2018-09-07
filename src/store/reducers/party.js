import * as actionTypes from '../actions/actionTypes';
const initState = {
    data: [],
    banks: [],
    banksOptions: [],
    parties: [],
    partiesOptions: [],
    filteredPartiesOptions: [],
    expenses: [],
    expensesOptions: []
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.SAVE_PARTY:
            if (action.payload.error) {
                newState = { ...state };
                newState.addParty = { ...state.addParty, error: true };
            } else {
                newState = { ...state };
                newState.addParty = { ...state.addParty, error: false };
            }
            break;
        case actionTypes.FETCH_PARTIES:
            newState = {
                data: [...action.payload.data],
                banks: [...action.payload.banks],
                banksOptions: [...action.payload.banksOptions],
                parties: [...action.payload.parties],
                partiesOptions: [...action.payload.partiesOptions],
                filteredPartiesOptions: [...action.payload.partiesOptions],
                expenses: [...action.payload.expenses],
                expensesOptions: [...action.payload.expensesOptions]
            };
            break;
        case actionTypes.FILTER_PARTIES:
            newState = {
                ...state,
                filteredPartiesOptions: [...action.payload],
            };
            break;
        case actionTypes.DELETE_PARTY:
            if (action.payload.error) {
                newState = { ...state };
                newState.deleteParty = { ...state.deleteParty, error: true };
            } else {
                newState = { ...state };
                newState.deleteParty = { ...state.deleteParty, error: false };
            }
            break;
        default: return state;
    }
    return newState;
}

export default reducer;