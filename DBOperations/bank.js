const ipc = require('electron').ipcMain;
const banksDB = require('./connections').getInstance().banksDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class BankDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveBank = this.saveBank.bind(this);
    this.fetchBanks = this.fetchBanks.bind(this);
    this.deleteBank = this.deleteBank.bind(this);
    this.editBank = this.editBank.bind(this);
    ipc.on('saveBank', this.saveBank);
    ipc.on('fetchBanks', this.fetchBanks);
    ipc.on('deleteBank', this.deleteBank);
    ipc.on('editBank', this.editBank);
  }

  saveBank(event, data) {
    data = convertToLowerCase(data);
    banksDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('saveBankResponse', response);
    });
  };

  fetchBanks(event, data) {
    banksDB.find().sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchBanksResponse', response);
    });
  };

  deleteBank(event, data) {
    banksDB.remove({ _id: data.bankId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteBankResponse', response);
    });
  };

  editBank(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    banksDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editBankResponse', response);
    });
  };
}

module.exports = BankDatabase;