const ipc = require('electron').ipcMain;
const addressesDB = require('./connections').getInstance().addressesDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class AddressDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveAddress = this.saveAddress.bind(this);
    this.fetchAddresses = this.fetchAddresses.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.editAddress = this.editAddress.bind(this);
    ipc.on('saveAddress', this.saveAddress);
    ipc.on('fetchAddresses', this.fetchAddresses);
    ipc.on('deleteAddress', this.deleteAddress);
    ipc.on('editAddress', this.editAddress);
  }

  saveAddress(event, data) {
    data = convertToLowerCase(data);
    addressesDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('saveAddressResponse', response);
    });
  };

  fetchAddresses(event, data) {
    addressesDB.find().sort({ addressName: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchAddressesResponse', response);
    });
  };

  deleteAddress(event, data) {
    addressesDB.remove({ _id: data.addressId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteAddressResponse', response);
    });
  };

  editAddress(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    addressesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editAddressResponse', response);
    });
  };
}

module.exports = AddressDatabase;