import * as actionTypes from '../actions/actionTypes';
const initState = {
    items: [],
    options: [], // formatted items for dropdown
    type: ['chips', 'rashan', 'beeju'],
    typeOptions: [
        { value: 'chips', label: 'chips' },
        { value: 'rashan', label: 'rashan' },
        { value: 'beeju', label: 'beeju' },
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
        default:
            return state;
    }
    return newState;
}

export default reducer;