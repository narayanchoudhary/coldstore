const ipc = require('electron').ipcMain;
const banksDB = require('./connections').getInstance().banksDB;
const TransactionsDB = require('./connections').getInstance().transactionsDB;
const ExpensesDB = require('./connections').getInstance().expensesDB;
const convertToLowerCase = require('../util').convertToLowerCase;

class BankDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveBank = this.saveBank.bind(this);
    this.fetchBanks = this.fetchBanks.bind(this);
    this.deleteBank = this.deleteBank.bind(this);
    this.editBank = this.editBank.bind(this);
    this.fetchTransactionsOfSingleBank = this.fetchTransactionsOfSingleBank.bind(this);
    this.fetchExpensesOfSingleBank = this.fetchExpensesOfSingleBank.bind(this);
    ipc.on('saveBank', this.saveBank);
    ipc.on('fetchBanks', this.fetchBanks);
    ipc.on('deleteBank', this.deleteBank);
    ipc.on('editBank', this.editBank);
    ipc.on('fetchTransactionsOfSingleBank', this.fetchTransactionsOfSingleBank);
    ipc.on('fetchExpensesOfSingleBank', this.fetchExpensesOfSingleBank);
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

    banksDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editBankResponse', response);
    });
  };

  fetchTransactionsOfSingleBank(event, data) {
    TransactionsDB.find({ bank: data.bankId }).sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchTransactionsOfsingleBankResponse', response);
    });
  }

  fetchExpensesOfSingleBank(event, data) {
    ExpensesDB.find({ bank: data.bankId }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchExpensesOfsingleBankResponse', response);
    });
  }

}

module.exports = BankDatabase;