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
        ipc.send('fetchAvaksByPartyId', { partyId: partyId });
        ipc.once('fetchAvaksByPartyIdResponse', (event, response) => {
            // Extract avaks ids
            let avakIdsOfSingleParty = [];// we will use this ids to fetch javak lots
            response.data.forEach((avak) => {
                avakIdsOfSingleParty.push(avak._id);
            });

            // Add footer in the table
            let footer = getFooterData(response.data);
            if (footer) {
                response.data.push(footer);
            }

            dispatch({
                type: actionTypes.FETCH_AVAKS_BY_PARTY_ID,
                payload: { avaks: response.data, avakIdsOfSingleParty: avakIdsOfSingleParty }
            });
            thenCallback();
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

export const editAvak = (data, thenCallback) => {
    return dispatch => {
        ipc.send('editAvak', data);
        ipc.once('editAvakResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_AVAK,
                payload: response
            });
            thenCallback();
        });
    }
}

export const fetchLastAvak = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchLastAvak', {});
        ipc.once('fetchLastAvakResponse', (event, response) => {
            // delete the data we dont want to initialize in the add avak form
            delete response.data[0].remark;
            delete response.data[0].rack;
            delete response.data[0].motorNumber;
            delete response.data[0].packet;
            delete response.data[0].weight;
            delete response.data[0]._id;
            delete response.data[0].createdAt;
            delete response.data[0].updatedAt;

            dispatch({
                type: actionTypes.FETCH_LAST_AVAK,
                payload: response.data[0],
            });
            thenCallback(response);
        });
    }
}


const getFooterData = (avaks) => {
    // Do not create footer if no avaks
    if (avaks.length === 0) {
        return;
    }

    let totalPacket = 0;
    let totalWeight = 0;
    avaks.forEach((avak) => {
        totalPacket += parseInt(avak.packet, 10);
        totalWeight += parseInt(avak.weight, 10);
    });

    let footer = {
        _id: 'footer',
        packet: totalPacket,
        weight: totalWeight,
        deleteButton: 'no'
    }

    return footer;
}