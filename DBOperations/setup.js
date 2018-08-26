const ipc = require('electron').ipcMain;
const setupsDB = require('./connections').getInstance().setupsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class SetupDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveSetup = this.saveSetup.bind(this);
    this.fetchSetups = this.fetchSetups.bind(this);
    this.deleteSetup = this.deleteSetup.bind(this);
    this.editSetup = this.editSetup.bind(this);
    ipc.on('saveSetup', this.saveSetup);
    ipc.on('fetchSetups', this.fetchSetups);
    ipc.on('deleteSetup', this.deleteSetup);
    ipc.on('editSetup', this.editSetup);
  }

  saveSetup(event, data) {
    data = convertToLowerCase(data);
    setupsDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('saveSetupResponse', response);
    });
  };

  fetchSetups(event, data) {
    setupsDB.find().sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchSetupsResponse', response);
    });
  };

  deleteSetup(event, data) {
    setupsDB.remove({ _id: data.setupId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteSetupResponse', response);
    });
  };

  editSetup(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    setupsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editSetupResponse', response);
    });
  };
}

module.exports = SetupDatabase;