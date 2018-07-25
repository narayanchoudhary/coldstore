import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveJavakLot = (avakId, javakId, thenCallback) => {
    return dispatch => {    
        ipc.send('saveJavakLot', {avakId: avakId, javakId: javakId});
        ipc.once('saveJavakLotResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_JAVAK_LOT,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchJavakLotsByJavakId = (javakId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavakLotsByJavakId', {javakId: javakId});
        ipc.once('fetchJavakLotsByJavakIdResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_JAVAK_LOTS_BY_JAVAK_ID,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const fetchJavakLotsByAvakId = (avakId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavakLotsByAvakId', {avakId: avakId});
        ipc.once('fetchJavakLotsByAvakIdResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_JAVAK_LOTS_BY_AVAK_ID,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const fetchJavakLots = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavakLots', {});
        ipc.once('fetchJavakLotsResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_JAVAK_LOTS,
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

export const editJavakLot = (data) => {
    return dispatch => {
        ipc.send('editJavakLot', data);
        ipc.once('editJavakLotResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_JAVAK,
                payload: response
            });
        });
    }
}

export const fetchAvaksOfParty = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaksOfParty', {partyId: partyId});
        ipc.once('fetchAvaksOfPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_AVAKS_OF_PARTY,
                payload: response
            });
            thenCallback(response);
        });
    }
}

