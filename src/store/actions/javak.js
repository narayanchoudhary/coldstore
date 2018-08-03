import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveJavak = (values, thenCallback) => {
    return dispatch => {
        ipc.send('saveJavak', values);
        ipc.once('saveJavakResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_JAVAK,
                payload: response
            });
            thenCallback(response);
        })
    }
};

export const fetchJavaks = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavaks', {});
        ipc.once('fetchJavaksResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_JAVAKS,
                payload: response
            });
            thenCallback();
        });
    }
}

export const deleteJavak = (JavakId) => {
    return dispatch => {
        ipc.send('deleteJavak', { JavakId: JavakId });
        ipc.once('deleteJavakResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_JAVAK,
                payload: response
            });
        });
    }
}

export const editJavak = (data) => {
    return dispatch => {
        ipc.send('editJavak', data);
        ipc.once('editJavakResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_JAVAK,
                payload: response
            });
        });
    }
}

export const fetchAvaksOfParty = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaksOfParty', { partyId: partyId });
        ipc.once('fetchAvaksOfPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_AVAKS_OF_PARTY,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const fetchJavaksByPartyId = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavaksByPartyId', { partyId: partyId });
        ipc.once('fetchJavaksByPartyIdResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_JAVAKS_BY_PARTY_ID,
                payload: response
            });
            thenCallback(response);
        });
    }
}
