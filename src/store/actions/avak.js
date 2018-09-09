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
        ipc.once('fetchAvaksResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_AVAKS,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const fetchAvaksByPartyId = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaksByPartyId', {partyId : partyId});
        ipc.once('fetchAvaksByPartyIdResponse', (event, response) => {
            let avaks = response.data.map((avak) => {
                // add label for remaining packet
                let remainingPacket = avak.packet - avak.sentPacket;
                let label = avak.packet.toString() + '-' + remainingPacket.toString();
                // add disabled field if the remaining packet is 0
                return { ...avak, remainingPacket: remainingPacket, packet: label, disabled: remainingPacket === 0 ? true : false }
            });

            dispatch({
                type: actionTypes.FETCH_AVAKS_BY_PARTY_ID,
                payload: avaks
            });
            thenCallback(response);
        });
    }
}

export const deleteAvak = (AvakId) => {
    return dispatch => {
        ipc.send('deleteAvak', { AvakId: AvakId });
        ipc.once('deleteAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_AVAK,
                payload: response
            });
        });
    }
}

export const editAvak = (data) => {
    return dispatch => {
        ipc.send('editAvak', data);
        ipc.once('editAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_AVAK,
                payload: response
            });
        });
    }
}