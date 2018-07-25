const ipc = require('electron').ipcMain;
const javaksDB = require('./connections').getInstance().javaksDB;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class JavakDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveJavak = this.saveJavak.bind(this);
    this.fetchJavaks = this.fetchJavaks.bind(this);
    this.deleteJavak = this.deleteJavak.bind(this);
    this.editJavak = this.editJavak.bind(this);
    this.fetchAvaksOfParty = this.fetchAvaksOfParty.bind(this);
    ipc.on('saveJavak', this.saveJavak);
    ipc.on('fetchJavaks', this.fetchJavaks);
    ipc.on('deleteJavak', this.deleteJavak);
    ipc.on('editJavak', this.editJavak);
    ipc.on('fetchAvaksOfParty', this.fetchAvaksOfParty);
  }

  saveJavak(event, data) {
    data = convertToLowerCase(data);
    javaksDB.insert(data, (err, newDoc) => {
      let response = {};
      response.error = err;
      response.data = newDoc
      this.mainWindow.webContents.send('saveJavakResponse', response);
    });
  };

  fetchJavaks(event, data) {
    javaksDB.find({}).sort({ updatedAt: -1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchJavaksResponse', response);
    });
  };

  deleteJavak(event, data) {
    javaksDB.remove({ _id: data.JavakId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteJavakResponse', response);
    });
  };

  editJavak(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    data = convertToLowerCase(data);
    javaksDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editJavakResponse', response);
    });
  };

  fetchAvaksOfParty(event, data) {
    let response = {};
    let avaksOuter;
    this.fetchAvaks(data).
      then((avaks) => {
        avaksOuter = avaks;
        let avakIds = [];
        avaks.forEach((avak) => {
          avakIds.push(avak._id);
        });
        return this.fetchLots(avakIds);
      }).then((javakLots) => {
        let finalAvaks = avaksOuter.map((avakOuter) => {
          let sum = 0;
          javakLots.forEach((javakLot) => {
            if (javakLot.avakId == avakOuter._id) {
              sum += parseInt(javakLot.packet)
            }
          });
          return { ...avakOuter, sentPacket: sum }
        });
        response.data = finalAvaks
        this.mainWindow.webContents.send('fetchAvaksOfPartyResponse', response);
      });
  };

  fetchAvaks(data) {
    return new Promise((resolve, reject) => {
      avaksDB.find({ party: data.partyId }).sort({ updatedAt: -1 }).exec((err, avaks) => {
        resolve(avaks);
      });
    });
  }

  fetchLots(avakIds) {
    return new Promise((resolve, reject) => {
      javakLotsDB.find({ avakId: { $in: avakIds } }).sort({ updatedAt: -1 }).exec((err, javakLots) => {
        resolve(javakLots);
      });
    });
  }
}

module.exports = JavakDatabase;