import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const fetchSettings = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchSettings', {});
        ipc.once('fetchSettingsResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_SETTINGS,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const editSetting = (data) => {
    return dispatch => {
        ipc.send('editSetting', data);
        ipc.once('editSettingResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_SETTING,
                payload: response
            });
        });
    }
}