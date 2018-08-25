import * as actionTypes from '../actions/actionTypes';
const initState = {
    items: []
}

// indec file me daal
const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_VARIETIES:
            newState = {
                varieties: action.payload.data
            };
            break;
        case actionTypes.DELETE_PARTY:
            if (action.payload.error) {
                newState = { ...state
                };
                newState.deleteParty = { ...state.deleteParty,
                    error: true
                };
            } else {
                newState = { ...state
                };
                newState.deleteParty = { ...state.deleteParty,
                    error: false
                };
            }
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;