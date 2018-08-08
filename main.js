const electron = require('electron');
const app  = electron.app;
const BrowserWindow = electron.BrowserWindow;
const PartyDatabase = require('./DBOperations/party.js');
const AvakDatabase = require('./DBOperations/avak.js');
const JavakDatabase = require('./DBOperations/javak.js');
const JavakLotDatabase = require('./DBOperations/javakLot.js');
const TransactionDatabase = require('./DBOperations/transaction.js');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('http://localhost:3000/');
  const partyDatabase = new PartyDatabase(mainWindow);
  const avakDatabase = new AvakDatabase(mainWindow);
  const javakDatabase = new JavakDatabase(mainWindow);
  const javakLotDatabase = new JavakLotDatabase(mainWindow);
  const transactionsDatabase = new TransactionDatabase(mainWindow);
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