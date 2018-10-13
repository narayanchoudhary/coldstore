import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const fetchDashboard = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchDashboard', {});
        ipc.once('fetchDashboardResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_DASHBOARD,
                payload: response
            });
            thenCallback(response);
        });
    }
}