const electron = require('electron');
const isDev = require('electron-is-dev');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const PartyDatabase = require('./DBOperations/party.js');
const AvakDatabase = require('./DBOperations/avak.js');
const JavakDatabase = require('./DBOperations/javak.js');
const JavakLotDatabase = require('./DBOperations/javakLot.js');
const TransactionDatabase = require('./DBOperations/transaction.js');
const ItemDatabase = require('./DBOperations/item.js');
const SizeDatabase = require('./DBOperations/size.js');
const VarietyDatabase = require('./DBOperations/variety.js');
const YearDatabase = require('./DBOperations/year.js');
const SetupDatabase = require('./DBOperations/setup.js');
const AddressDatabase = require('./DBOperations/address.js');
const BankDatabase = require('./DBOperations/bank.js');
const ExpenseCategoryDatabase = require('./DBOperations/expenseCategory.js');
const Expense = require('./DBOperations/expense.js');
const Dashboard = require('./DBOperations/dashboard.js');
const Rent = require('./DBOperations/rent.js');

const path = require('path');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 700 });
  mainWindow.maximize();
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    console.log('Running in development');
  } else {
    mainWindow.loadURL(path.join('file://', __dirname, '/build/index.html'));
    console.log('Running in production');
  }
  const partyDatabase = new PartyDatabase(mainWindow);
  const avakDatabase = new AvakDatabase(mainWindow);
  const javakDatabase = new JavakDatabase(mainWindow);
  const javakLotDatabase = new JavakLotDatabase(mainWindow);
  const transactionsDatabase = new TransactionDatabase(mainWindow);
  const itemDatabase = new ItemDatabase(mainWindow);
  const varietyDatabase = new VarietyDatabase(mainWindow);
  const sizeDatabase = new SizeDatabase(mainWindow);
  const yearDatabase = new YearDatabase(mainWindow);
  const setupDatabase = new SetupDatabase(mainWindow);
  const addressDatabase = new AddressDatabase(mainWindow);
  const bankDatabase = new BankDatabase(mainWindow);
  const expenseCategoryDatabase = new ExpenseCategoryDatabase(mainWindow);
  const expense = new Expense(mainWindow);
  const dashboard = new Dashboard(mainWindow);
  const rent = new Rent(mainWindow);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});