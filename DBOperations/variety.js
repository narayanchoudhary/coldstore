const ipc = require('electron').ipcMain;
const varietyDB = require('./connections').getInstance().varietyDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class VarietyDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveVariety = this.saveVariety.bind(this);
    this.fetchVarieties = this.fetchVarieties.bind(this);
    this.deleteVariety = this.deleteVariety.bind(this);
    this.editVariety = this.editVariety.bind(this);
    ipc.on('saveVariety', this.saveVariety);
    ipc.on('fetchVarieties', this.fetchVarieties);
    ipc.on('deleteVariety', this.deleteVariety);
    ipc.on('editVariety', this.editVariety);
  }

  saveVariety(event, data) {
    data = convertToLowerCase(data);
    varietyDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('saveVarietyResponse', response);
    });
  };

  fetchVarieties(event, data) {
    varietyDB.find().sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchVarietiesResponse', response);
    });
  };

  deleteVariety(event, data) {
    varietyDB.remove({ _id: data.varietyId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteVarietyResponse', response);
    });
  };

  editVariety(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    varietyDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editVarietyResponse', response);
    });
  };
}

module.exports = VarietyDatabase;