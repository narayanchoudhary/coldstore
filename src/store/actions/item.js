import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveItem = (values) => {
    console.log(values);
    return dispatch => {    
        ipc.send('saveItem', values);
        ipc.once('saveItemResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_ITEM,
                payload: response
            });
        })
    }
};

export const fetchItems = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchItems', {});
        ipc.once('fetchItemsResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_ITEMS,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteItem = (itemId) => {
    return dispatch => {
        ipc.send('deleteItem', { itemId: itemId });
        ipc.once('deleteItemResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_ITEM,
                payload: response
            });
        });
    }
}

export const editItem = (data) => {
    return dispatch => {
        ipc.send('editItem', data);
        ipc.once('editItemResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_ITEM,
                payload: response
            });
        });
    }
}