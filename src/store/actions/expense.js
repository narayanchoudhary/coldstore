import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveExpense = (values, thenCallback) => {
    return dispatch => {    
        ipc.send('saveExpense', values);
        ipc.once('saveExpenseResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_EXPENSE,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchExpenses = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchExpenses', {});
        ipc.once('fetchExpensesResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_EXPENSES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteExpense = (expenseId) => {
    return dispatch => {
        ipc.send('deleteExpense', { expenseId: expenseId });
        ipc.once('deleteExpenseResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_EXPENSE,
                payload: response
            });
        });
    }
}

export const editExpense = (data) => {
    return dispatch => {
        ipc.send('editExpense', data);
        ipc.once('editExpenseResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_EXPENSE,
                payload: response
            });
        });
    }
}