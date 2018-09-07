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
            response.parties = response.data.filter(party => {
                return party.type === 'party';
            });

            response.partiesOptions = response.parties.map((party) => {
                return { value: party._id, label: party.name, address: party.address };
            });

            response.banks = response.data.filter(party => {
                return party.type === 'bank';
            });

            response.banksOptions = response.banks.map((bank) => {
                return { value: bank._id, label: bank.name };
            });

            response.expenses = response.data.filter(party => {
                return party.type === 'expense';
            });

            response.expensesOptions = response.expenses.map((expense) => {
                return { value: expense._id, label: expense.name };
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

export const editParty = (data) => {
    return dispatch => {
        ipc.send('editParty', data);
        ipc.once('editPartyResponse', (event, response) => {
            dispatch({
                type: actionTypes.EDIT_PARTY,
                payload: response
            });
        });
    }
}

export const filterPartiesByAddress = (parties, address) => {

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
    }
}