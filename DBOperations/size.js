const ipc = require('electron').ipcMain;
const sizesDB = require('./connections').getInstance().sizesDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class SizeDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveSize = this.saveSize.bind(this);
    this.fetchSizes = this.fetchSizes.bind(this);
    this.deleteSize = this.deleteSize.bind(this);
    this.editSize = this.editSize.bind(this);
    ipc.on('saveSize', this.saveSize);
    ipc.on('fetchSizes', this.fetchSizes);
    ipc.on('deleteSize', this.deleteSize);
    ipc.on('editSize', this.editSize);
  }

  saveSize(event, data) {
    data = convertToLowerCase(data);
    sizesDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('saveSizeResponse', response);
    });
  };

  fetchSizes(event, data) {
    sizesDB.find().sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchSizesResponse', response);
    });
  };

  deleteSize(event, data) {
    sizesDB.remove({ _id: data.sizeId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteSizeResponse', response);
    });
  };

  editSize(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    sizesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editSizeResponse', response);
    });
  };
}

module.exports = SizeDatabase;