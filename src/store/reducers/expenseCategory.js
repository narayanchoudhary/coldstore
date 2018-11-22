import * as actionTypes from '../actions/actionTypes';
const initState = {
    expenseCategories: [],
    options: []// formatted varieties for dropdown
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_EXPENSE_CATEGORIES:
            newState = {
                expenseCategories: action.payload.data,
                options: action.payload.options
            };
            break;
        default:
            return state;
    }
    return newState;
}

export default reducer;