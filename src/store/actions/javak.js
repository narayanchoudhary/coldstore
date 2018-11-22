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
        ipc.once('fetchJavaksResponse', (event, javaks) => {
            dispatch({
                type: actionTypes.FETCH_JAVAKS,
                payload: javaks
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

export const fetchJavaksByPartyId = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavaksByPartyId', { partyId: partyId });
        ipc.once('fetchJavaksByPartyIdResponse', (event, javaks) => {
            dispatch({
                type: actionTypes.FETCH_JAVAKS_BY_PARTY_ID,
                payload: javaks
            });
            thenCallback(javaks);
        });
    }
}

export const fetchLastJavak = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchLastJavak', {});
        ipc.once('fetchLastJavakResponse', (event, lastJavak) => {

            dispatch({
                type: actionTypes.FETCH_LAST_JAVAK,
                payload: lastJavak,
            });
            thenCallback(lastJavak);
        });
    }
}

export const fetchNewReceiptNumberForJavak = (type, thenCallback) => {
    return dispatch => {
        ipc.send('fetchNewReceiptNumberForJavak', { type });
        ipc.once('fetchNewReceiptNumberForJavakResponse', (event, newJavakReceiptNumber) => {
            // delete the data we dont want to initialize in the add avak form
            dispatch({
                type: actionTypes.FETCH_NEW_RECEIPT_NUMBER_FOR_JAVAK,
                payload: newJavakReceiptNumber,
            });
            thenCallback(newJavakReceiptNumber);
        });
    }
}

export const fetchJavaksOfSingleMerchant = (merchantId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavaksOfSingleMerchant', { merchantId: merchantId });
        ipc.once('fetchJavaksOfSingleMerchantResponse', (event, javaks) => {
            dispatch({
                type: actionTypes.FETCH_JAVAKS_OF_SINGLE_MERCHANT,
                payload: javaks
            });
            thenCallback(javaks);
        });
    }
}