const ipc = require('electron').ipcMain;
const javaksDB = require('./connections').getInstance().javaksDB;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
class JavakDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveJavak = this.saveJavak.bind(this);
    this.fetchJavaks = this.fetchJavaks.bind(this);
    this.deleteJavak = this.deleteJavak.bind(this);
    this.editJavak = this.editJavak.bind(this);
    this.fetchAvaksOfParty = this.fetchAvaksOfParty.bind(this);
    this.fetchJavaksByPartyId = this.fetchJavaksByPartyId.bind(this);
    this.fetchLastJavak = this.fetchLastJavak.bind(this);
    this.fetchNewReceiptNumberForJavak = this.fetchNewReceiptNumberForJavak.bind(this);

    ipc.on('saveJavak', this.saveJavak);
    ipc.on('fetchJavaks', this.fetchJavaks);
    ipc.on('deleteJavak', this.deleteJavak);
    ipc.on('editJavak', this.editJavak);
    ipc.on('fetchAvaksOfParty', this.fetchAvaksOfParty);
    ipc.on('fetchJavaksByPartyId', this.fetchJavaksByPartyId);
    ipc.on('fetchLastJavak', this.fetchLastJavak);
    ipc.on('fetchNewReceiptNumberForJavak', this.fetchNewReceiptNumberForJavak);
  }

  saveJavak(event, data) {
    // for auto id of rashan and chips
    javaksDB.insert({ _id: '__autoid__chips', value: 0 });
    javaksDB.insert({ _id: '__autoid__rashan', value: 0 });

    let autoId = '__autoid__chips';
    if (data.type === 'rashan') { // potato type
      autoId = '__autoid__rashan';
    }

    javaksDB.findOne({ _id: autoId }, (err, doc) => {
      javaksDB.update({ _id: autoId }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        javaksDB.insert(data, (err, newDoc) => {
          //Change id of javak lots from temp
          javakLotsDB.update({ javakId: 'tempJavakId', type: newDoc.type }, { $set: { javakId: newDoc._id } }, { multi: true }, function (err, numReplaced) {
          });
          let response = {};
          response.error = err;
          response.data = newDoc
          this.mainWindow.webContents.send('saveJavakResponse', response);
        });
      });
    });


  };

  fetchJavaks(event, data) {
    javaksDB.find({ receiptNumber: { $exists: true } }).sort({ updatedAt: -1 }).exec((err, data) => {
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
    javaksDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editJavakResponse', response);
    });
  };

  fetchAvaksOfParty(event, data) {
    let response = {};
    let avaksOuter;
    this.fetchAvaks(data)
      .then((avaks) => {
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
            if (javakLot.avakId === avakOuter._id) {
              sum += parseInt(javakLot.packet, 10)
            }
          });
          return { ...avakOuter, sentPacket: sum }
        });
        response.data = finalAvaks;
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

  fetchJavaksByPartyId(event, data) {
    javaksDB.find({ party: data.partyId }).sort({ updatedAt: -1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchJavaksByPartyIdResponse', response);
    });
  };

  fetchLastJavak(event, data) {
    javaksDB.find({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).limit(1).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchLastJavakResponse', response);
    });
  };

  fetchNewReceiptNumberForJavak(event, data) {

    let autoId = '__autoid__rashan';
    if (data.type === 'chips') {
      autoId = '__autoid__chips';
    }
    javaksDB.findOne({ _id: autoId }, (err, data) => {

      let response = {};
      response.error = err;
      response.data = data.value;

      this.mainWindow.webContents.send('fetchNewReceiptNumberForJavakResponse', response);
    });
  };

}

module.exports = JavakDatabase;