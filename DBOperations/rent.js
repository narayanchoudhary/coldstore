const ipc = require('electron').ipcMain;
const RentsDB = require('./connections').getInstance().rentsDB;
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

    // for auto id of cash and bank rasids
    RentsDB.insert({ _id: '__autoid__cash', value: 0 });
    RentsDB.insert({ _id: '__autoid__bank', value: 0 });

    let autoId = '__autoid__bank';
    if (data.bank.value.toLowerCase() === 'cash') {
      autoId = '__autoid__cash';
    }

    // change format of the data from key value pairs to corresponding ids
    data.address = data.address.value;
    data.addressOfMerchant = data.addressOfMerchant.value;
    data.party = data.party.value;
    data.bank = data.bank.value; // for cash 
    data.merchant = data.merchant.value;
    data.rentType = data.rentType.value;


    // get new receiptNumber
    RentsDB.findOne({ _id: autoId }, (err, doc) => {

      // update receiptNumber to +1
      RentsDB.update({ _id: autoId }, { $set: { value: ++doc.value } }, {}, () => {

        // insert rent
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
    RentsDB.find({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).exec((err, rents) => {
      this.mainWindow.webContents.send('fetchRentsResponse', rents);
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

    data.receiptNumber = parseInt(data.receiptNumber, 10);// so that we don't face any problem in the sorting

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
            addressesDB.findOne({ _id: lastRent.addressOfMerchant }, (err1, addressOfMerchant) => {
              partiesDB.findOne({ _id: lastRent.merchant }, (err, merchant) => {

                // Shit starts here   If we do not do this shit then the react-select will not work properly with redux form
                lastRent.address = { label: address.addressName, value: lastRent.address };
                lastRent.addressOfMerchant = { label: addressOfMerchant.addressName, value: lastRent.addressOfMerchant };
                lastRent.party = { label: party.name, value: lastRent.party };
                lastRent.merchant = { label: merchant.name, value: merchant._id };
                lastRent.rentType = { label: lastRent.rentType, value: lastRent.rentType };
                if (bank === null) {
                  lastRent.bank = { label: 'cash', value: 'cash' };
                } else {
                  lastRent.bank = { label: bank.bankName, value: lastRent.bank };
                }

                // Shit ends here

                // Delete the unnessecary data we don't want to initialize in the add Rent form
                delete lastRent._id;
                delete lastRent.createdAt;
                delete lastRent.updatedAt;
                delete lastRent.remark;
                this.mainWindow.webContents.send('fetchLastRentResponse', lastRent);
              });
            });
          });
        });
      });
    });
  };

  fetchNewReceiptNumberOfRent(event, data) {

    let autoId = '__autoid__bank';
    if (data.bank.toLowerCase() === 'cash') {
      autoId = '__autoid__cash';
    }

    RentsDB.findOne({ _id: autoId }, (err, rent) => {
      if (rent === null) { rent = { value: 1 }; } // if firstTime
      this.mainWindow.webContents.send('fetchNewReceiptNumberOfRentResponse', parseInt(rent.value, 10) + 1);
    });
  };

}

module.exports = RentDatabase;