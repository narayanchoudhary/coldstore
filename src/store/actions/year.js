import * as actionTypes from './actionTypes';

export const changeYear = (year) => {
    return dispatch => {
        dispatch({
            type: actionTypes.CHANGE_YEAR,
            payload: year
        });
    }
};