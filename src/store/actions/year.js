import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const changeCurrentYear = (newYear) => {
    return dispatch => {
        ipc.send('changeCurrentYear', { yearId: newYear.value });
        ipc.once('changeCurrentYearResponse', (event, response) => {
            if (response.success === 'done') {// Changed the current year in the databse
                dispatch({
                    type: actionTypes.CHANGE_YEAR,
                    payload: newYear
                });
            }
        });
    }
};

export const fetchCurrentYear = () => {
    return dispatch => {
        ipc.send('fetchCurrentYear', {});
        ipc.once('fetchCurrentYearResponse', (event, response) => {
            let currentYear = {};
            currentYear.value = response.data._id;
            currentYear.label = response.data.year;
            dispatch({
                type: actionTypes.FETCH_CURRENT_YEAR,
                payload: currentYear
            });
        });
    }
};

// year methods
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
            let years = response.data.map((year) => {
                return { value: year._id, label: year.year };
            });
            dispatch({
                type: actionTypes.FETCH_YEARS,
                payload: years
            });
        });
    }
}

export const deleteYear = (yearId) => {
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