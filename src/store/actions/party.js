import * as actionTypes from './actionTypes';
const ipc = window.require("electron").ipcRenderer;

export const saveParty = (values, thenCallback) => {
    return dispatch => {
        ipc.send('saveParty', values);
        ipc.once('savePartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.SAVE_PARTY,
                payload: response
            });
            thenCallback();
        })
    }
};

export const fetchParties = (thenCallback) => {
    return dispatch => {
        ipc.send('fetchParties', {});
        ipc.once('fetchPartiesResponse', (event, response) => {
            response.options = response.data.map((party) => {
                return { value: party._id, label: party.name, address: party.address };
            });

            dispatch({
                type: actionTypes.FETCH_PARTIES,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const fetchParty = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchParty', { partyId: partyId });
        ipc.once('fetchPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.FETCH_PARTY,
                payload: response
            });
            thenCallback(response);
        });
    }
}

export const deleteParty = (partyId) => {
    return dispatch => {
        ipc.send('deleteParty', { partyId: partyId });
        ipc.once('deletePartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.DELETE_PARTY,
                payload: response
            });
        });
    }
}

export const editParty = (data, thenCallback) => {
    return dispatch => {
        ipc.send('editParty', data);
        ipc.once('editPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_PARTY,
                payload: response
            });
            thenCallback();
        });
    }
}

export const filterPartiesByAddress = (parties, address, thenCallback) => {
    let filteredParties = parties;
    if (address.value) {
        filteredParties = parties.filter(party => {
            return party.address === address.value;
        });
    }

    return dispatch => {
        dispatch({
            type: actionTypes.FILTER_PARTIES,
            payload: filteredParties
        });
        thenCallback(filteredParties);
    }
}


// Merchants are also parties
export const filterMerchantsByAddress = (parties, address, thenCallback) => {
    let filteredParties = parties;
    if (address.value) {
        filteredParties = parties.filter(party => {
            return party.address === address.value;
        });
    }

    return dispatch => {
        dispatch({
            type: actionTypes.FILTER_MERCHANTS,
            payload: filteredParties
        });
        // thenCallback();
    }
}

export const fetchOpeningBalanceOfParty = (partyId, thenCallback) => {
    return dispatch => {
        ipc.send('fetchOpeningBalanceOfParty', { partyId: partyId });
        ipc.once('fetchOpeningBalanceOfPartyResponse', (event, response) => {
            // here generaly, we dispatch some action
            thenCallback(response);
        });
    }
}