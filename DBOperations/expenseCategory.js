const ipc = require('electron').ipcMain;
const expenseCategoriesDB = require('./connections').getInstance().expenseCategoriesDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class ExpenseCategoryDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveExpenseCategory = this.saveExpenseCategory.bind(this);
    this.fetchExpenseCategories = this.fetchExpenseCategories.bind(this);
    this.deleteExpenseCategory = this.deleteExpenseCategory.bind(this);
    this.editExpenseCategory = this.editExpenseCategory.bind(this);
    ipc.on('saveExpenseCategory', this.saveExpenseCategory);
    ipc.on('fetchExpenseCategories', this.fetchExpenseCategories);
    ipc.on('deleteExpenseCategory', this.deleteExpenseCategory);
    ipc.on('editExpenseCategory', this.editExpenseCategory);
  }

  saveExpenseCategory(event, data) {
    data = convertToLowerCase(data);
    expenseCategoriesDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('saveExpenseCategoryResponse', response);
    });
  };

  fetchExpenseCategories(event, data) {
    expenseCategoriesDB.find().sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchExpenseCategoriesResponse', response);
    });
  };

  deleteExpenseCategory(event, data) {
    expenseCategoriesDB.remove({ _id: data.expenseCategoryId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteExpenseCategoryResponse', response);
    });
  };

  editExpenseCategory(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    expenseCategoriesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editExpenseCategoryResponse', response);
    });
  };
}

module.exports = ExpenseCategoryDatabase;