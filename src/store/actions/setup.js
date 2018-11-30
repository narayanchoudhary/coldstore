import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveSetup = (values) => {
    return dispatch => {    
        ipc.send('saveSetup', values);
        ipc.once('saveSetupResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_SETUP,
                payload: response
            });
        })
    }
};

export const fetchSetups = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchSetups', {});
        ipc.once('fetchSetupsResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_SETUPS,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteSetup = (setupId) => {
    return dispatch => {
        ipc.send('deleteSetup', { setupId: setupId });
        ipc.once('deleteSetupResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_SETUP,
                payload: response
            });
        });
    }
}

export const editSetup = (data) => {
    return dispatch => {
        ipc.send('editSetup', data);
        ipc.once('editSetupResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_SETUP,
                payload: response
            });
        });
    }
}

export const fetchDefaultAvakHammaliRateOfItem = (itemId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchDefaultAvakHammaliRateOfItem', {itemId: itemId});
        ipc.once('fetchDefaultAvakHammaliRateOfItemResponse', (event, defaultAvakHammaliRate) => {
            thenCallback(defaultAvakHammaliRate);
        });
    }
}