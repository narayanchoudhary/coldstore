const ipc = require('electron').ipcMain;
const RentsDB = require('./connections').getInstance().RentsDB;
const addressesDB = require('./connections').getInstance().addressesDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const banksDB = require('./connections').getInstance().banksDB;

class RentDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveRent = this.saveRent.bind(this);
    this.fetchRents = this.fetchRents.bind(this);
    this.fetchRentsByPartyId = this.fetchRentsByPartyId.bind(this);
    this.deleteRent = this.deleteRent.bind(this);
    this.editRent = this.editRent.bind(this);
    this.fetchLastRent = this.fetchLastRent.bind(this);
    this.fetchNewReceiptNumberOfRent = this.fetchNewReceiptNumberOfRent.bind(this);

    ipc.on('saveRent', this.saveRent);
    ipc.on('fetchRents', this.fetchRents);
    ipc.on('fetchRentsByPartyId', this.fetchRentsByPartyId);
    ipc.on('deleteRent', this.deleteRent);
    ipc.on('editRent', this.editRent);
    ipc.on('fetchLastRent', this.fetchLastRent);
    ipc.on('fetchNewReceiptNumberOfRent', this.fetchNewReceiptNumberOfRent);
  }

  saveRent(event, data) {
    // for auto id
    RentsDB.insert({ _id: '__autoid__', value: 0 });
    RentsDB.findOne({ _id: '__autoid__' }, (err, doc) => {
      RentsDB.update({ _id: '__autoid__' }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        RentsDB.insert(data, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('saveRentResponse', response);
        });
      });
    });
  };

  fetchRents(event, data) {
    RentsDB.find({ receiptNumber: { $exists: true } }).sort({ receiptNumber: -1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchRentsResponse', response);
    });
  };

  fetchRentsByPartyId(event, data) {
    RentsDB.find({ party: data.partyId }).sort({ updatedAt: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchRentsByPartyIdResponse', response);
    });
  };

  deleteRent(event, data) {
    RentsDB.remove({ _id: data.RentId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteRentResponse', response);
    });
  };

  editRent(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    RentsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editRentResponse', response);
    });
  };

  fetchLastRent(event, data) {
    RentsDB.findOne({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).limit(1).exec((err, lastRent) => {
      addressesDB.findOne({ _id: lastRent.address }, (err1, address) => {
        partiesDB.findOne({ _id: lastRent.party }, (err2, party) => {
          banksDB.findOne({ _id: lastRent.bank }, (err3, bank) => {

            // Shit starts here   If we do not do this shit then the react-select will not work properly with redux form
            lastRent.address = { label: address.addressName, value: lastRent.address };
            lastRent.party = { label: party.name, value: lastRent.party };
            lastRent.bank = { label: bank.bankName, value: lastRent.bank };
            // Shit ends here

            delete lastRent.remark;// Delete the unnessecary data we don't want to initialize in the add Rent form
            delete lastRent._id;
            delete lastRent.createdAt;
            delete lastRent.updatedAt;

            this.mainWindow.webContents.send('fetchLastRentResponse', lastRent);
          });
        });
      });
    });
  };

  fetchNewReceiptNumberOfRent(event, data) {
    RentsDB.findOne({ _id: '__autoid__' }, (err, Rent) => {
      this.mainWindow.webContents.send('fetchNewReceiptNumberOfRentResponse', parseInt(Rent.value, 10) + 1);
    });
  };

}

module.exports = RentDatabase;