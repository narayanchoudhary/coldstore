import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveRent = (values, thenCallback) => {
    return dispatch => {
        ipc.send('saveRent', values);
        ipc.once('saveRentResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_RENT,
                payload: response
            });
            thenCallback(response);
        })
    }
};

// fetchRentsByPartyId DBOperation.js me bana he pehle se
export const fetchRents = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchRents', {});
        ipc.once('fetchRentsResponse', (event, rents) => {
            dispatch({
                type: actionTypes.FETCH_RENTS,
                payload: rents
            });
            thenCallback();
        });
    }
}

export const fetchRentsByPartyId = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchRentsByPartyId', { partyId: partyId });
        ipc.once('fetchRentsByPartyIdResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_RENTS_BY_PARTY_ID,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteRent = (RentId, thenCallback) => {
    return dispatch => {
        ipc.send('deleteRent', { RentId: RentId });
        ipc.once('deleteRentResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_RENT,
                payload: response
            });
        });
        thenCallback();
    }
}

export const editRent = (data, thenCallback) => {
    return dispatch => {
        ipc.send('editRent', data);
        ipc.once('editRentResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_RENT,
                payload: response
            });
            thenCallback();
        });
    }
}

export const fetchLastRent = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchLastRent', {});
        ipc.once('fetchLastRentResponse', (event, lastRent) => {

            dispatch({
                type: actionTypes.FETCH_LAST_RENT,
                payload: lastRent,
            });
            thenCallback(lastRent);
        });
    }
}

export const fetchNewReceiptNumberOfRent = (bank, thenCallback) => {
    return dispatch => {
        ipc.send('fetchNewReceiptNumberOfRent', { bank: bank });
        ipc.once('fetchNewReceiptNumberOfRentResponse', (event, newRentReceiptNumber) => {
            dispatch({
                type: actionTypes.FETCH_NEW_RECEIPT_NUMBER_OF_RENT,
                payload: newRentReceiptNumber,
            });
            thenCallback(newRentReceiptNumber);
        });
    }
}