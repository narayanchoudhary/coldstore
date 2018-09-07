import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveSize = (values) => {
    return dispatch => {    
        ipc.send('saveSize', values);
        ipc.once('saveSizeResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_SIZE,
                payload: response
            });
        })
    }
};

export const fetchSizes = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchSizes', {});
        ipc.once('fetchSizesResponse', (event, response) => {
            response.options = response.data.map((size) => {
                
                return { value: size._id, label: size.sizeName };
            });
            dispatch({
                type: actionTypes.FETCH_SIZES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteSize = (sizeId) => {
    return dispatch => {
        ipc.send('deleteSize', { sizeId: sizeId });
        ipc.once('deleteSizeResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_SIZE,
                payload: response
            });
        });
    }
}

export const editSize = (data) => {
    return dispatch => {
        ipc.send('editSize', data);
        ipc.once('editSizeResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_SIZE,
                payload: response
            });
        });
    }
}