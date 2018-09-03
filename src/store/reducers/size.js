import * as actionTypes from '../actions/actionTypes';
const initState = {
    sizes: [],
    options: []// formatted varieties for dropdown
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_SIZES:
            newState = {
                sizes: action.payload.data,
                options: action.payload.options
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