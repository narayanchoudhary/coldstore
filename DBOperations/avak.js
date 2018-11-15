const ipc = require('electron').ipcMain;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const addressesDB = require('./connections').getInstance().addressesDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const itemsDB = require('./connections').getInstance().itemsDB;
const varietyDB = require('./connections').getInstance().varietyDB;
const sizesDB = require('./connections').getInstance().sizesDB;

class AvakDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveAvak = this.saveAvak.bind(this);
    this.fetchAvaks = this.fetchAvaks.bind(this);
    this.fetchAvaksByPartyId = this.fetchAvaksByPartyId.bind(this);
    this.deleteAvak = this.deleteAvak.bind(this);
    this.editAvak = this.editAvak.bind(this);
    this.fetchLastAvak = this.fetchLastAvak.bind(this);
    this.fetchNewReceiptNumber = this.fetchNewReceiptNumber.bind(this);
    ipc.on('saveAvak', this.saveAvak);
    ipc.on('fetchAvaks', this.fetchAvaks);
    ipc.on('fetchAvaksByPartyId', this.fetchAvaksByPartyId);
    ipc.on('deleteAvak', this.deleteAvak);
    ipc.on('editAvak', this.editAvak);
    ipc.on('fetchLastAvak', this.fetchLastAvak);
    ipc.on('fetchNewReceiptNumber', this.fetchNewReceiptNumber);

    // This commented code is for the editing the avaks do not delete it
    // avaksDB.find({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).exec((err, data) => {
    //   data.forEach(avak => {
    //     if (avak.variety === 'aPzyNEZEmnLLHFnu') {
    //       let _id = avak._id;
    //       delete avak._id;
    //       delete avak.createdAt;
    //       delete avak.updatedAt;

    //       avak.type = 'beeju';
    //       avak.variety = 'SUMBeqAjuwkPXPqF';

    //       avaksDB.update({ _id: _id }, { ...avak }, {}, (err, numReplaced) => {
    //         console.log('numReplaced: ', numReplaced);
    //       });
    //     }

    //   });

    // });

  }

  saveAvak(event, data) {
    // for auto id of rashan/beeju and chips
    avaksDB.insert({ _id: '__autoid__rashan', value: 0 });
    avaksDB.insert({ _id: '__autoid__chips', value: 0 });

    let autoId = '__autoid__rashan';
    if (data.type === 'chips') {
      autoId = '__autoid__chips';
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
    avaksDB.find({ party: data.partyId }).sort({ receiptNumber: 1 }).exec((err, avaks) => {
      // For adding in footer
      let totalPacket = 0;
      let totalWeight = 0;
      let totalJavakPacket = 0; // total of javak lots

      // Doing this shit to add remaining and balance packet column

      // fetch javakLots
      javakLotsDB.find({}, (err, javakLots) => {
        let finalAvaks = [];
        avaks.forEach(avak => {
          // Calculate the sum of packets of javakLots
          let sumOfPacketsOfJavakLots = 0;
          javakLots.forEach(javakLot => {
            if (javakLot.avakId === avak._id) {
              sumOfPacketsOfJavakLots += parseInt(javakLot.packet, 10);
            }
          });
          finalAvaks.push({ ...avak, totalJavakPacket: sumOfPacketsOfJavakLots, balance: parseInt(avak.packet, 10) - sumOfPacketsOfJavakLots });

          // Calculate the totals to add into footer
          totalPacket += parseInt(avak.packet, 10);
          totalWeight += parseInt(avak.weight, 10);
          totalJavakPacket += sumOfPacketsOfJavakLots;

        });

        // Add footer
        let footer = {
          _id: 'footer',
          packet: totalPacket,
          weight: totalWeight,
          totalJavakPacket: totalJavakPacket,
          balance: totalPacket - totalJavakPacket,
          deleteButton: 'no'
        }
        finalAvaks.push(footer);

        let response = {};
        response.error = err;
        response.data = finalAvaks;
        this.mainWindow.webContents.send('fetchAvaksByPartyIdResponse', response);
      });
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
    data.receiptNumber = parseInt(data.receiptNumber, 10);// so that we don't face any problem in the sorting

    avaksDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editAvakResponse', response);
    });
  };

  fetchLastAvak(event, data) {
    avaksDB.findOne({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).limit(1).exec((err, lastAvak) => {
      addressesDB.findOne({ _id: lastAvak.address }, (err, address) => {
        partiesDB.findOne({ _id: lastAvak.party }, (err, party) => {
          itemsDB.findOne({ _id: lastAvak.item }, (err, item) => {
            varietyDB.findOne({ _id: lastAvak.variety }, (err, variety) => {
              sizesDB.findOne({ _id: lastAvak.size }, (err, size) => {

                // Doing this shit so that the react-select does work correctly in the redux-form
                lastAvak.address = { label: address.addressName, value: address._id };
                lastAvak.party = { label: party.name, value: party._id };
                lastAvak.item = { label: item.itemName, value: item._id };
                lastAvak.variety = { label: variety.varietyName, value: variety._id };
                lastAvak.size = { label: size.sizeName, value: size._id };
                lastAvak.type = { label: lastAvak.type, value: lastAvak.type };

                // delete the data we dont want to initialize in the add avak form
                delete lastAvak.remark;
                delete lastAvak.rack;
                delete lastAvak.motorNumber;
                delete lastAvak.packet;
                delete lastAvak.weight;
                delete lastAvak._id;
                delete lastAvak.createdAt;
                delete lastAvak.updatedAt;
                delete lastAvak.yearId;

                this.mainWindow.webContents.send('fetchLastAvakResponse', lastAvak);
              });
            });
          });
        });
      });
    });
  };

  fetchNewReceiptNumber(event, data) {

    let autoId = '__autoid__rashan';
    if (data.type === 'chips') {
      autoId = '__autoid__chips';
    }
    avaksDB.findOne({ _id: autoId }, (err, avak) => {
      this.mainWindow.webContents.send('fetchNewReceiptNumberResponse', parseInt(avak.value, 10) + 1);
    });
  };

}

module.exports = AvakDatabase;