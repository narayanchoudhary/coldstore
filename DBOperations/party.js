const ipc = require('electron').ipcMain;
const Datastore = require('nedb');
const yearsDB = require('./connections').getInstance().yearsDB;
const OpeningBalanceDB = require('./connections').getInstance().openingBalanceDB;
const partiesDB = new Datastore({ filename: 'database/parties', autoload: true, timestampData: true });
class PartyDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveParty = this.saveParty.bind(this);
    this.fetchParties = this.fetchParties.bind(this);
    this.fetchParty = this.fetchParty.bind(this);
    this.deleteParty = this.deleteParty.bind(this);
    this.editParty = this.editParty.bind(this);
    this.fetchOpeningBalanceOfParty = this.fetchOpeningBalanceOfParty.bind(this);
    ipc.on('saveParty', this.saveParty);
    ipc.on('fetchParties', this.fetchParties);
    ipc.on('fetchParty', this.fetchParty);
    ipc.on('deleteParty', this.deleteParty);
    ipc.on('editParty', this.editParty);
    ipc.on('fetchOpeningBalanceOfParty', this.fetchOpeningBalanceOfParty);
  }

  saveParty(event, data) {
    // Convert name to lower case
    data.name = data.name.toLowerCase();

    // store openingBalnce and side of transaction in different variable
    let openingBalance = data.openingBalance;
    let side = data.side;// side of transaction i.e debit or credit

    // delete openingBalance and side from the data we dont want to store it in the party
    delete data.openingBalance;
    delete data.side;

    // insert party
    partiesDB.insert(data, (err, newParty) => {

      // find current year id
      yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {

        // Create opening balance object
        let openingBalanceData = {};
        openingBalanceData.particularId = newParty._id;
        openingBalanceData.openingBalance = openingBalance;// from the form submitted
        openingBalanceData.yearId = currentYear.yearId;
        openingBalanceData.side = side;

        // insert opening balance
        OpeningBalanceDB.insert(openingBalanceData, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('savePartyResponse', response);
        });

      });
    });
  };

  fetchParties(event, data) {
    partiesDB.find({}).sort({ name: 1 }).exec((err, data) => {
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
    data.name = data.name.toLowerCase();
    partiesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editPartyResponse', response);
    });
  };

  fetchOpeningBalanceOfParty(event, data) {
    // fetch current year
    yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {
      // get opening balance of the party of current year
      OpeningBalanceDB.findOne({ $and: [{ particularId: data.partyId }, { yearId: currentYear.yearId }] }, (err, doc) => {
        let response = {};
        response.error = err;
        response.data = doc
        this.mainWindow.webContents.send('fetchOpeningBalanceOfPartyResponse', response);
      });
    });
  };

}

module.exports = PartyDatabase;