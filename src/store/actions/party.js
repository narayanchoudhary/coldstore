import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveParty = (values) => {
    return dispatch => {    
        ipc.send('saveParty', values);
        ipc.once('savePartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_PARTY,
                payload: response
            });
        })
    }
};

export const fetchParties = (type, thenCallback) => {
    return dispatch => {
        ipc.send('fetchParties', {type: type});
        ipc.once('fetchPartiesResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_PARTIES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const fetchParty = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchParty', {partyId: partyId});
        ipc.once('fetchPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_PARTY,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteParty = (partyId) => {
    return dispatch => {
        ipc.send('deleteParty', { partyId: partyId });
        ipc.once('deletePartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_PARTY,
                payload: response
            });
        });
    }
}

export const editParty = (data) => {
    return dispatch => {
        ipc.send('editParty', data);
        ipc.once('editPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_PARTY,
                payload: response
            });
        });
    }
}