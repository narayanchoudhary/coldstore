import * as actionTypes from '../actions/actionTypes';

const initState = {
    currentYear: '2017-18'
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.CHANGE_YEAR:
                newState = { currentYear: action.payload }
            break;
        default: return state;
    }
    return newState;
}

export default reducer;