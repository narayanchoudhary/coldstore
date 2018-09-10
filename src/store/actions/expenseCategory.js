import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveExpenseCategory = (values) => {
    return dispatch => {    
        ipc.send('saveExpenseCategory', values);
        ipc.once('saveExpenseCategoryResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_EXPENSE_CATEGORY,
                payload: response
            });
        })
    }
};

export const fetchExpenseCategories = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchExpenseCategories', {});
        ipc.once('fetchExpenseCategoriesResponse', (event, response) => {
            response.options = response.data.map((expenseCategory) => {
                
                return { value: expenseCategory._id, label: expenseCategory.expenseCategoryName };
            });
            dispatch({
                type: actionTypes.FETCH_EXPENSE_CATEGORIES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteExpenseCategory = (expenseCategoryId) => {
    return dispatch => {
        ipc.send('deleteExpenseCategory', { expenseCategoryId: expenseCategoryId });
        ipc.once('deleteExpenseCategoryResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_EXPENSE_CATEGORY,
                payload: response
            });
        });
    }
}

export const editExpenseCategory = (data) => {
    return dispatch => {
        ipc.send('editExpenseCategory', data);
        ipc.once('editExpenseCategoryResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_EXPENSE_CATEGORY,
                payload: response
            });
        });
    }
}