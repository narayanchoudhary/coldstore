const ipc = require('electron').ipcMain;
const TransactionDB = require('./connections').getInstance().transactionsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class TransactionDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveTransaction = this.saveTransaction.bind(this);
    this.fetchTransactions = this.fetchTransactions.bind(this);
    this.fetchTransactionsByPartyId = this.fetchTransactionsByPartyId.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.editTransaction = this.editTransaction.bind(this);
    ipc.on('saveTransaction', this.saveTransaction);
    ipc.on('fetchTransactions', this.fetchTransactions);
    ipc.on('fetchTransactionsByPartyId', this.fetchTransactionsByPartyId);
    ipc.on('deleteTransaction', this.deleteTransaction);
    ipc.on('editTransaction', this.editTransaction);
  }

  saveTransaction (event, data) {
    data = convertToLowerCase(data);
    TransactionDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err; 
      this.mainWindow.webContents.send('saveTransactionResponse', response);
    });
  };

  fetchTransactions (event, data) {
    TransactionDB.find({}).sort({ date: 1 }).exec((err, data) => {   
      let response = {};
      response.error = err;
      response.data  = data;
      this.mainWindow.webContents.send('fetchTransactionsResponse', response);
    });
  };

  fetchTransactionsByPartyId (event, data) {
    TransactionDB.find({party: data.partyId}).sort({ updatedAt: 1 }).exec((err, data) => {   
      let response = {};
      response.error = err;
      response.data  = data;
      this.mainWindow.webContents.send('fetchTransactionsByPartyIdResponse', response);
    });
  };

  deleteTransaction (event, data) {
    TransactionDB.remove({ _id: data.TransactionId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err; 
      this.mainWindow.webContents.send('deleteTransactionResponse', response);
    });
  };

  editTransaction (event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    TransactionDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editTransactionResponse', response);
    });
  };

}

module.exports = TransactionDatabase;