const ipc = require('electron').ipcMain;
const Datastore = require('nedb');
const partiesDB = new Datastore({ filename: 'database/parties', autoload: true, timestampData: true });
const convertToLowerCase = require('../util').convertToLowerCase;
class PartyDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveParty = this.saveParty.bind(this);
    this.fetchParties = this.fetchParties.bind(this);
    this.fetchParty = this.fetchParty.bind(this);
    this.deleteParty = this.deleteParty.bind(this);
    this.editParty = this.editParty.bind(this);
    ipc.on('saveParty', this.saveParty);
    ipc.on('fetchParties', this.fetchParties);
    ipc.on('fetchParty', this.fetchParty);
    ipc.on('deleteParty', this.deleteParty);
    ipc.on('editParty', this.editParty);
  }

  saveParty(event, data) {
    data = convertToLowerCase(data);
    partiesDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('savePartyResponse', response);
    });
  };

  fetchParties(event, data) {
    partiesDB.find({}).sort({ updatedAt: -1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchPartiesResponse', response);
    });
  };

  fetchParty(event, data) {
    partiesDB.findOne({ _id: data.partyId }).exec((err, doc) => {
      let response = {};
      response.error = err;
      response.data = doc;
      this.mainWindow.webContents.send('fetchPartyResponse', response);
    });
  };

  deleteParty(event, data) {
    partiesDB.remove({ _id: data.partyId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deletePartyResponse', response);
    });
  };

  editParty(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    data = convertToLowerCase(data);
    partiesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editPartyResponse', response);
    });
  };

}

module.exports = PartyDatabase;