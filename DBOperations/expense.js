const ipc = require('electron').ipcMain;
const ExpensesDB = require('./connections').getInstance().expensesDB;
class ExpenseDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveExpense = this.saveExpense.bind(this);
    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.fetchExpensesByPartyId = this.fetchExpensesByPartyId.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.editExpense = this.editExpense.bind(this);
    ipc.on('saveExpense', this.saveExpense);
    ipc.on('fetchExpenses', this.fetchExpenses);
    ipc.on('fetchExpensesByPartyId', this.fetchExpensesByPartyId);
    ipc.on('deleteExpense', this.deleteExpense);
    ipc.on('editExpense', this.editExpense);
  }

  saveExpense(event, data) {
    // for auto id
    ExpensesDB.insert({ _id: '__autoid__', value: 0 });
    ExpensesDB.findOne({ _id: '__autoid__' }, (err, doc) => {
      ExpensesDB.update({ _id: '__autoid__' }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        ExpensesDB.insert(data, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('saveExpenseResponse', response);
        });
      });
    });
  };

  fetchExpenses(event, data) {
    ExpensesDB.find({ receiptNumber: { $exists: true } }).sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchExpensesResponse', response);
    });
  };

  fetchExpensesByPartyId(event, data) {
    ExpensesDB.find({ party: data.partyId }).sort({ updatedAt: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchExpensesByPartyIdResponse', response);
    });
  };

  deleteExpense(event, data) {
    ExpensesDB.remove({ _id: data.expenseId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteExpenseResponse', response);
    });
  };

  editExpense(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    ExpensesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editExpenseResponse', response);
    });
  };
  
}

module.exports = ExpenseDatabase;