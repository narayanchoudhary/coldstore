import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveBank = (values, thenCallback) => {
    return dispatch => {
        ipc.send('saveBank', values);
        ipc.once('saveBankResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_BANK,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchBanks = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchBanks', {});
        ipc.once('fetchBanksResponse', (event, response) => {
            response.options = response.data.map((bank) => {

                return { value: bank._id, label: bank.bankName };
            });
            dispatch({
                type: actionTypes.FETCH_BANKS,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteBank = (bankId) => {
    return dispatch => {
        ipc.send('deleteBank', { bankId: bankId });
        ipc.once('deleteBankResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_BANK,
                payload: response
            });
        });
    }
}

export const editBank = (data) => {
    return dispatch => {
        ipc.send('editBank', data);
        ipc.once('editBankResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_BANK,
                payload: response
            });
        });
    }
}

export const fetchTransactionsOfSingleBank = (bankId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchTransactionsOfSingleBank', { bankId: bankId });
        ipc.once('fetchTransactionsOfsingleBankResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_TRANSACTIONS_OF_SINGLE_BANK,
                payload: response
            });
            thenCallback();
        });
    }
}

export const fetchExpensesOfSingleBank = (bankId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchExpensesOfSingleBank', { bankId: bankId });
        ipc.once('fetchExpensesOfsingleBankResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_EXPENSES_OF_SINGLE_BANK,
                payload: response
            });
            thenCallback();
        });
    }
}