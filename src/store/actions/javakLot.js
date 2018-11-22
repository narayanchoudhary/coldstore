import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveJavakLot = (avakId, javakId, thenCallback) => {
    return dispatch => {
        ipc.send('saveJavakLot', { avakId: avakId, javakId: javakId });
        ipc.once('saveJavakLotResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_JAVAK_LOT,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchJavakLotsByJavakId = (javakId, type, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavakLotsByJavakId', { javakId: javakId, type: type });
        ipc.once('fetchJavakLotsByJavakIdResponse', (event, response) => {
            // Calculate sum of packets of javak lots
            let sumOfJavakLots = 0;
            response.data.forEach(javakLot => {
                sumOfJavakLots += parseInt(javakLot.packet, 10);
            });

            // Prepare payload
            let payload = {};
            payload.sumOfJavakLots = sumOfJavakLots;
            payload.lots = response.data;

            dispatch({
                type: actionTypes.FETCH_JAVAK_LOTS_BY_JAVAK_ID,
                payload: payload
            });
            thenCallback(response);
        });
    }
}

export const fetchJavakLotsByAvakIds = (avakIds, thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavakLotsByAvakIds', { avakIds: avakIds });
        ipc.once('fetchJavakLotsByAvakIdsResponse', (event, javakLots) => {
            dispatch({
                type: actionTypes.FETCH_JAVAK_LOTS_BY_AVAK_ID,
                payload: javakLots
            });
            thenCallback(javakLots);
        });
    }
}

export const fetchJavakLots = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchJavakLots', {});
        ipc.once('fetchJavakLotsResponse', (event, javakLots) => {
            dispatch({
                type: actionTypes.FETCH_JAVAK_LOTS,
                payload: javakLots
            });
            thenCallback();
        });
    }
}

export const deleteJavakLot = (JavakLotId) => {
    return dispatch => {
        ipc.send('deleteJavakLot', { JavakLotId: JavakLotId });
        ipc.once('deleteJavakLotResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_JAVAK_LOT,
                payload: response
            });
        });
    }
}

export const removeTempJavakLots = () => {
    return dispatch => {
        ipc.send('removeTempJavakLots', {});
        ipc.once('removeTempJavakLotsResponse', (event, response) => {
            dispatch({
                type: actionTypes.REMOVE_TEMP_JAVAK_LOTS,
                payload: response
            });
        });
    }
}

export const editJavakLot = (data, thenCallback) => {
    return dispatch => {
        ipc.send('editJavakLot', data);
        ipc.once('editJavakLotResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_JAVAK,
                payload: response
            });
        });
        thenCallback();
    }
}

export const fetchAvaksOfParty = (partyId, type, thenCallback) => {
    return dispatch => {
        ipc.send('fetchAvaksOfParty', { partyId: partyId });
        ipc.once('fetchAvaksOfPartyResponse', (event, response) => {

            // filter avakOfParty according to type
            if (type === 'chips') {
                response.data = response.data.filter(avak => avak.type === 'chips');
            } else {
                response.data = response.data.filter(avak => avak.type !== 'chips');
            }

            let avaks = response.data.map((avak) => {
                // add label for remaining packet
                let remainingPacket = avak.packet - avak.sentPacket;
                let label = avak.packet.toString() + '-' + remainingPacket.toString();
                // add disabled field if the remaining packet is 0
                return { ...avak, remainingPacket: remainingPacket, packet: label, disabled: remainingPacket === 0 ? true : false }
            });
            dispatch({
                type: actionTypes.FETCH_AVAKS_OF_PARTY,
                payload: avaks
            });
            thenCallback(response);
        });
    }
}

export const modifyAvaks = (avaks, avakId, status) => {
    var index = avaks.findIndex(a => a._id === avakId);
    let newAvaks = Object.assign([...avaks], { [index]: Object.assign({}, avaks[index], { disabled: status }) });
    return dispatch => {
        dispatch({
            type: actionTypes.MODIFY_AVAKS,
            payload: newAvaks
        });
    }
}