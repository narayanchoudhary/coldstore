import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveVariety = (values) => {
    return dispatch => {    
        ipc.send('saveVariety', values);
        ipc.once('saveVarietyResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_VARIETY,
                payload: response
            });
        })
    }
};

export const fetchVarieties = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchVarieties', {});
        ipc.once('fetchVarietiesResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_VARIETIES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteVariety = (varietyId) => {
    return dispatch => {
        ipc.send('deleteVariety', { varietyId: varietyId });
        ipc.once('deleteVarietyResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_VARIETY,
                payload: response
            });
        });
    }
}

export const editVariety = (data) => {
    return dispatch => {
        ipc.send('editVariety', data);
        ipc.once('editVarietyResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_VARIETY,
                payload: response
            });
        });
    }
}