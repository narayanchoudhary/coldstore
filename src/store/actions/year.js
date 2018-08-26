import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const changeYear = (year) => {
    return dispatch => {
        dispatch({
            type: actionTypes.CHANGE_YEAR,
            payload: year
        });
    }
};

export const saveYear = (values) => {
    return dispatch => {
        ipc.send('saveYear', values);
        ipc.once('saveYearResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_YEAR,
                payload: response
            });
        })
    }
};

export const fetchYears = () => {
    return dispatch => {
        ipc.send('fetchYears', {});
        ipc.once('fetchYearsResponse', (event, response) => {
            let years = response.data.map((year)=>{
                return {value: year._id, label: year.name};
            });
            dispatch({
                type: actionTypes.FETCH_YEARS,
                payload: years
            });
            changeYear(years[0]);
        });
    }
}

export const deleteYear = (yearId) => {
    console.log('yearId: ', yearId);
    return dispatch => {
        ipc.send('deleteYear', { yearId: yearId });
        ipc.once('deleteYearResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_YEAR,
                payload: response
            });
        });
    }
}

export const editYear = (data) => {
    return dispatch => {
        ipc.send('editYear', data);
        ipc.once('editYearResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_YEAR,
                payload: response
            });
        });
    }
}