const ipc = require('electron').ipcMain;
const yearsDB = require('./connections').getInstance().yearsDB;
const OpeningBalanceDB = require('./connections').getInstance().openingBalanceDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const avaksDB = require('./connections').getInstance().avaksDB;
const setupsDB = require('./connections').getInstance().setupsDB;
const rentsDB = require('./connections').getInstance().rentsDB;

class PartyDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveParty = this.saveParty.bind(this);
    this.fetchParties = this.fetchParties.bind(this);
    this.fetchParty = this.fetchParty.bind(this);
    this.deleteParty = this.deleteParty.bind(this);
    this.editParty = this.editParty.bind(this);
    this.fetchOpeningBalanceOfParty = this.fetchOpeningBalanceOfParty.bind(this);
    this.fetchTransactionsOfSingleParty = this.fetchTransactionsOfSingleParty.bind(this);
    ipc.on('saveParty', this.saveParty);
    ipc.on('fetchParties', this.fetchParties);
    ipc.on('fetchParty', this.fetchParty);
    ipc.on('deleteParty', this.deleteParty);
    ipc.on('editParty', this.editParty);
    ipc.on('fetchOpeningBalanceOfParty', this.fetchOpeningBalanceOfParty);
    ipc.on('fetchTransactionsOfSingleParty', this.fetchTransactionsOfSingleParty);
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

  fetchTransactionsOfSingleParty(event, partyId) {
    let transactions = [];
    yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => { // fetch current year
      OpeningBalanceDB.findOne({ $and: [{ particularId: partyId }, { yearId: currentYear.yearId }] }, (err, openingBalanceDoc) => { // get opening balance of the party of current year
        avaksDB.find({ party: partyId }, (err, avaks) => {
          setupsDB.find({ year: currentYear.yearId }, (err, setups) => {
            rentsDB.find({ party: partyId }).sort({ createdAt: 1 }).exec((err, rents) => {
              partiesDB.find({}, (err, parties) => {
                // Calculate totoalRent and TotalAvakHammali
                let totalRent = 0;
                let totalAvakHammali = 0;

                avaks.forEach(avak => {
                  // find avak hammali and rent of single item from setup
                  let itemRent = null;
                  let itemAvakHammali = null;

                  setups.forEach(setup => {
                    if (setup.item === avak.item) {
                      itemRent = setup.rent;
                      itemAvakHammali = setup.avakHammali;
                    }
                  });

                  totalRent += parseInt(avak.weight, 10) * parseFloat(itemRent, 10);
                  totalAvakHammali += parseInt(avak.packet, 10) * parseFloat(itemAvakHammali, 10);
                });

                transactions.push({ _id: 'openingBalance', amount: openingBalanceDoc.openingBalance, particular: 'Opening Balance', side: openingBalanceDoc.side, deleteButton: 'no' }); // Insert opening balance row
                transactions.push({ _id: 'totalRent', amount: Math.round(totalRent), particular: 'Total Rent', side: 'debit', deleteButton: 'no' }); // Insert total rent row
                transactions.push({ _id: 'avakHammali', amount: Math.round(totalAvakHammali), particular: 'Avak Hammali', side: 'debit', deleteButton: 'no' }); // Insert avak Hammali

                // Add rents
                rents.forEach(rent => {
                  transactions.push({
                    _id: rent._id,
                    date: rent.date,
                    amount: rent.amount,
                    particular: 'RNo: ' + rent.receiptNumber + ' ' + rent.remark,
                    side: 'credit',
                  });
                });

                // Add footer
                let sumOfCredits = 0;
                let sumOfDebits = 0;
                transactions.forEach(transaction => {
                  if (transaction.side === 'credit') {
                    sumOfCredits += parseInt(transaction.amount, 10);
                  } else {
                    sumOfDebits += transaction.amount;
                  }
                });

                let balance = parseInt((sumOfCredits - sumOfDebits), 10);

                transactions.push({
                  _id: 'footer',
                  amount: Math.abs(balance),
                  particular: 'Balance',
                  side: balance > 0 ? 'credit' : 'debit'
                });

                this.mainWindow.webContents.send('fetchTransactionsOfSinglePartyResponse', transactions);
              });
            });
          });
        });
      });
    });
  }

}

module.exports = PartyDatabase;