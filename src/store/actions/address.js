import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveAddress = (values, thenCallback) => {
    return dispatch => {    
        ipc.send('saveAddress', values);
        ipc.once('saveAddressResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_ADDRESS,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchAddresses = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchAddresses', {});
        ipc.once('fetchAddressesResponse', (event, response) => {
            response.options = response.data.map((address) => {
                return { value: address._id, label: address.addressName };
            });
            dispatch({
                type: actionTypes.FETCH_ADDRESSES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteAddress = (addressId) => {
    return dispatch => {
        ipc.send('deleteAddress', { addressId: addressId });
        ipc.once('deleteAddressResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_SIZE,
                payload: response
            });
        });
    }
}

export const editAddress = (data, thenCallback) => {
    return dispatch => {
        ipc.send('editAddress', data);
        ipc.once('editAddressResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_SIZE,
                payload: response
            });
            thenCallback();
        });
    }
}