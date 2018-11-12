const ipc = require('electron').ipcMain;
const TransactionsDB = require('./connections').getInstance().transactionsDB;
const addressesDB = require('./connections').getInstance().addressesDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const banksDB = require('./connections').getInstance().banksDB;

class TransactionDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveTransaction = this.saveTransaction.bind(this);
    this.fetchTransactions = this.fetchTransactions.bind(this);
    this.fetchTransactionsByPartyId = this.fetchTransactionsByPartyId.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.editTransaction = this.editTransaction.bind(this);
    this.fetchLastTransaction = this.fetchLastTransaction.bind(this);
    this.fetchNewReceiptNumberOfTransaction = this.fetchNewReceiptNumberOfTransaction.bind(this);

    ipc.on('saveTransaction', this.saveTransaction);
    ipc.on('fetchTransactions', this.fetchTransactions);
    ipc.on('fetchTransactionsByPartyId', this.fetchTransactionsByPartyId);
    ipc.on('deleteTransaction', this.deleteTransaction);
    ipc.on('editTransaction', this.editTransaction);
    ipc.on('fetchLastTransaction', this.fetchLastTransaction);
    ipc.on('fetchNewReceiptNumberOfTransaction', this.fetchNewReceiptNumberOfTransaction);
  }

  saveTransaction(event, data) {
    // for auto id
    TransactionsDB.insert({ _id: '__autoid__', value: 0 });
    TransactionsDB.findOne({ _id: '__autoid__' }, (err, doc) => {
      TransactionsDB.update({ _id: '__autoid__' }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        TransactionsDB.insert(data, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('saveTransactionResponse', response);
        });
      });
    });
  };

  fetchTransactions(event, data) {
    TransactionsDB.find({ receiptNumber: { $exists: true } }).sort({ receiptNumber: -1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchTransactionsResponse', response);
    });
  };

  fetchTransactionsByPartyId(event, data) {
    TransactionsDB.find({ party: data.partyId }).sort({ updatedAt: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchTransactionsByPartyIdResponse', response);
    });
  };

  deleteTransaction(event, data) {
    TransactionsDB.remove({ _id: data.TransactionId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteTransactionResponse', response);
    });
  };

  editTransaction(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    TransactionsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editTransactionResponse', response);
    });
  };

  fetchLastTransaction(event, data) {
    TransactionsDB.findOne({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).limit(1).exec((err, lastTransaction) => {
      addressesDB.findOne({ _id: lastTransaction.address }, (err1, address) => {
        partiesDB.findOne({ _id: lastTransaction.party }, (err2, party) => {
          banksDB.findOne({ _id: lastTransaction.bank }, (err3, bank) => {

            // Shit starts here   If we do not do this shit then the react-select will not work properly with redux form
            lastTransaction.address = { label: address.addressName, value: lastTransaction.address };
            lastTransaction.party = { label: party.name, value: lastTransaction.party };
            lastTransaction.bank = { label: bank.bankName, value: lastTransaction.bank };
            // Shit ends here

            delete lastTransaction.remark;// Delete the unnessecary data we don't want to initialize in the add transaction form
            delete lastTransaction._id;
            delete lastTransaction.createdAt;
            delete lastTransaction.updatedAt;

            this.mainWindow.webContents.send('fetchLastTransactionResponse', lastTransaction);
          });
        });
      });
    });
  };

  fetchNewReceiptNumberOfTransaction(event, data) {
    TransactionsDB.findOne({ _id: '__autoid__' }, (err, transaction) => {
      this.mainWindow.webContents.send('fetchNewReceiptNumberOfTransactionResponse', parseInt(transaction.value, 10) + 1);
    });
  };

}

module.exports = TransactionDatabase;