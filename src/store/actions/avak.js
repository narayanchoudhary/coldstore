import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveAvak = (values, thenCallback) => {
    return dispatch => {
        ipc.send('saveAvak', values);
        ipc.once('saveAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_AVAK,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchAvaks = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaks', {});
        ipc.once('fetchAvaksResponse', (event, avaks) => {
            dispatch({
                type: actionTypes.FETCH_AVAKS,
                payload: avaks
            });
            thenCallback(avaks);
        });
    }
}

export const fetchAvaksByPartyId = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaksByPartyId', { partyId: partyId });
        ipc.once('fetchAvaksByPartyIdResponse', (event, avaks) => {
            // Extract avaks ids
            let avakIdsOfSingleParty = [];// we will use this ids to fetch javak lots
            avaks.forEach((avak) => {
                avakIdsOfSingleParty.push(avak._id);
            });

            dispatch({
                type: actionTypes.FETCH_AVAKS_BY_PARTY_ID,
                payload: { avaks: avaks, avakIdsOfSingleParty: avakIdsOfSingleParty }
            });
            thenCallback(avakIdsOfSingleParty);
        });
    }
}

export const deleteAvak = (avakId, thenCallback) => {
    return dispatch => {
        ipc.send('deleteAvak', { avakId: avakId });
        ipc.once('deleteAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_AVAK,
                payload: response
            });
            thenCallback();
        });
    }
}

export const editAvak = (data, thenCallback) => {
    return dispatch => {
        ipc.send('editAvak', data);
        ipc.once('editAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_AVAK,
                payload: response
            });
            thenCallback();
        });
    }
}

export const fetchLastAvak = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchLastAvak', {});
        ipc.once('fetchLastAvakResponse', (event, lastAvak) => {
            dispatch({
                type: actionTypes.FETCH_LAST_AVAK,
                payload: lastAvak,
            });
            thenCallback(lastAvak);
        });
    }
}

export const fetchNewReceiptNumber = (type, thenCallback) => {
    return dispatch => {
        ipc.send('fetchNewReceiptNumber', { type });
        ipc.once('fetchNewReceiptNumberResponse', (event, newAvakReceiptNumber) => {
            // delete the data we dont want to initialize in the add avak form
            dispatch({
                type: actionTypes.FETCH_NEW_RECEIPT_NUMBER,
                payload: newAvakReceiptNumber,
            });
            thenCallback(newAvakReceiptNumber);
        });
    }
}