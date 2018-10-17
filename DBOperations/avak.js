const ipc = require('electron').ipcMain;
const avaksDB = require('./connections').getInstance().avaksDB;
class AvakDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveAvak = this.saveAvak.bind(this);
    this.fetchAvaks = this.fetchAvaks.bind(this);
    this.fetchAvaksByPartyId = this.fetchAvaksByPartyId.bind(this);
    this.deleteAvak = this.deleteAvak.bind(this);
    this.editAvak = this.editAvak.bind(this);
    this.fetchLastAvak = this.fetchLastAvak.bind(this);
    ipc.on('saveAvak', this.saveAvak);
    ipc.on('fetchAvaks', this.fetchAvaks);
    ipc.on('fetchAvaksByPartyId', this.fetchAvaksByPartyId);
    ipc.on('deleteAvak', this.deleteAvak);
    ipc.on('editAvak', this.editAvak);
    ipc.on('fetchLastAvak', this.fetchLastAvak);
  }

  saveAvak(event, data) {
    // for auto id of rashan and chips
    avaksDB.insert({ _id: '__autoid__chips', value: 0 });
    avaksDB.insert({ _id: '__autoid__rashan', value: 0 });

    let autoId = '__autoid__chips';
    if (data.type === 'rashan') { // potato type
      autoId = '__autoid__rashan';
    }

    avaksDB.findOne({ _id: autoId }, (err, doc) => {
      avaksDB.update({ _id: autoId }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        avaksDB.insert(data, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('saveAvakResponse', response);
        });
      });
    });
  };

  fetchAvaks(event, data) {
    avaksDB.find({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;

      this.mainWindow.webContents.send('fetchAvaksResponse', response);
    });
  };

  fetchAvaksByPartyId(event, data) {
    avaksDB.find({ party: data.partyId }).sort({ receiptNumber: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchAvaksByPartyIdResponse', response);
    });
  };

  deleteAvak(event, data) {
    avaksDB.remove({ _id: data.AvakId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteAvakResponse', response);
    });
  };

  editAvak(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    avaksDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editAvakResponse', response);
    });
  };

  fetchLastAvak(event, data) {
    avaksDB.find({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).limit(1).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;

      this.mainWindow.webContents.send('fetchLastAvakResponse', response);
    });
  };

}

module.exports = AvakDatabase;