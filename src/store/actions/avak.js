import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveAvak = (values) => {
    return dispatch => {    
        ipc.send('saveAvak', values);
        ipc.once('saveAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_AVAK,
                payload: response
            });
        })
    }
};

export const fetchAvaks = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaks', {});
        ipc.once('fetchAvaksResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_AVAKS,
                payload: response
            });
            thenCallback();
        });
    }
}

export const deleteAvak = (AvakId) => {
    return dispatch => {
        ipc.send('deleteAvak', { AvakId: AvakId });
        ipc.once('deleteAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_AVAK,
                payload: response
            });
        });
    }
}

export const editAvak = (data) => {
    console.log('data: ', data);
    return dispatch => {
        ipc.send('editAvak', data);
        ipc.once('editAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_AVAK,
                payload: response
            });
        });
    }
}