import * as actionTypes from '../actions/actionTypes';
const initState = {
    items: [],
    options: [], // formatted items for dropdown
    type: ['chips', 'rashan'],
    typeOptions: [
        { value: 'chips', label: 'chips' },
        { value: 'rashan', label: 'rashan' }
    ],
}

const reducer = (state = initState, action) => {
    let newState;
    switch (action.type) {
        case actionTypes.FETCH_ITEMS:
            newState = {
                ...state,
                items: action.payload.data,
                options: action.payload.options
            };
            break;
        case actionTypes.DELETE_PARTY:
            if (action.payload.error) {
                newState = {
                    ...state
                };
                newState.deleteParty = {
                    ...state.deleteParty,
                    error: true
                };
            } else {
                newState = {
                    ...state
                };
                newState.deleteParty = {
                    ...state.deleteParty,
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