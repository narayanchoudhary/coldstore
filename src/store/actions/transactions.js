import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveTransaction = (values, thenCallback) => {
    return dispatch => {
        ipc.send('saveTransaction', values);
        ipc.once('saveTransactionResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_TRANSACTION,
                payload: response
            });
            thenCallback(response);
        })
    }
};

export const fetchTransactions = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchTransactions', {});
        ipc.once('fetchTransactionsResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_TRANSACTIONS,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteTransaction = (TransactionId) => {
    return dispatch => {
        ipc.send('deleteTransaction', { TransactionId: TransactionId });
        ipc.once('deleteTransactionResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_TRANSACTION,
                payload: response
            });
        });
    }
}

export const editTransaction = (data) => {
    return dispatch => {
        ipc.send('editTransaction', data);
        ipc.once('editTransactionResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_TRANSACTION,
                payload: response
            });
        });
    }
}