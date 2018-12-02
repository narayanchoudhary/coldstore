const ipc = require('electron').ipcMain;
const yearsDB = require('./connections').getInstance().yearsDB;
const banksDB = require('./connections').getInstance().banksDB;
const TransactionsDB = require('./connections').getInstance().transactionsDB;
const ExpensesDB = require('./connections').getInstance().expensesDB;
const OpeningBalanceDB = require('./connections').getInstance().openingBalanceDB;
const RentsDB = require('./connections').getInstance().rentsDB;

class BankDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveBank = this.saveBank.bind(this);
    this.fetchBanks = this.fetchBanks.bind(this);
    this.deleteBank = this.deleteBank.bind(this);
    this.editBank = this.editBank.bind(this);
    this.fetchTransactionsOfSingleBank = this.fetchTransactionsOfSingleBank.bind(this);
    this.fetchExpensesOfSingleBank = this.fetchExpensesOfSingleBank.bind(this);
    this.fetchOpeningBalanceOfBank = this.fetchOpeningBalanceOfBank.bind(this);

    ipc.on('saveBank', this.saveBank);
    ipc.on('fetchBanks', this.fetchBanks);
    ipc.on('deleteBank', this.deleteBank);
    ipc.on('editBank', this.editBank);
    ipc.on('fetchTransactionsOfSingleBank', this.fetchTransactionsOfSingleBank);
    ipc.on('fetchExpensesOfSingleBank', this.fetchExpensesOfSingleBank);
    ipc.on('fetchOpeningBalanceOfBank', this.fetchOpeningBalanceOfBank);
  }

  saveBank(event, data) {

    // store openingBalnce and side of transaction in different variable
    let openingBalance = data.openingBalance;
    let side = data.side;// side of transaction i.e debit or credit

    // delete openingBalance and side from the data we dont want to store it in the bank
    delete data.openingBalance;
    delete data.side;

    // insert bank 
    banksDB.insert(data, (err, newBank) => {

      // find current year id
      yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {

        // Create opening balance object
        let openingBalanceData = {};
        openingBalanceData.particularId = newBank._id;
        openingBalanceData.openingBalance = openingBalance;// from the form submitted
        openingBalanceData.yearId = currentYear.yearId;
        openingBalanceData.side = side;

        // insert opening balance
        OpeningBalanceDB.insert(openingBalanceData, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('saveBankResponse', response);
        });

      });
    });
  };

  fetchBanks(event, data) {
    banksDB.find().sort({ date: 1 }).exec((err, data) => {
      data.push({
        _id: 'cash',
        bankName: 'cash',
      });
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
    RentsDB.find({ bank: data.bankId }).sort({ createdAt: -1 }).exec((err, rents) => {
      let finalRents = [];
      let totalCredit = 0;
      let totalDebit = 0;
      rents.forEach(rent => {
        finalRents.push({ ...rent, credit: rent.amount });
        totalCredit += parseInt(rent.amount, 10);
      });

      finalRents.push({
        _id: 'balance',
        party: 'Balance',
        credit: totalCredit,
      });

      this.mainWindow.webContents.send('fetchTransactionsOfsingleBankResponse', finalRents);
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

  fetchOpeningBalanceOfBank(event, data) {
    // fetch current year
    yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {
      // get opening balance of the Bank of current year
      OpeningBalanceDB.findOne({ $and: [{ particularId: data.bankId }, { yearId: currentYear.yearId }] }, (err, doc) => {
        let response = {};
        response.error = err;
        response.data = doc
        this.mainWindow.webContents.send('fetchOpeningBalanceOfBankResponse', response);
      });
    });
  };

}

module.exports = BankDatabase;