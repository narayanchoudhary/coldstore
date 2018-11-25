const ipc = require('electron').ipcMain;
const javaksDB = require('./connections').getInstance().javaksDB;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const addressesDB = require('./connections').getInstance().addressesDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const getItemRent = require('./dbUtils').getItemRent;
const yearsDB = require('./connections').getInstance().yearsDB;
const setupsDB = require('./connections').getInstance().setupsDB;

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
    this.fetchJavaksOfSingleMerchant = this.fetchJavaksOfSingleMerchant.bind(this);

    ipc.on('saveJavak', this.saveJavak);
    ipc.on('fetchJavaks', this.fetchJavaks);
    ipc.on('deleteJavak', this.deleteJavak);
    ipc.on('editJavak', this.editJavak);
    ipc.on('fetchAvaksOfParty', this.fetchAvaksOfParty);
    ipc.on('fetchJavaksByPartyId', this.fetchJavaksByPartyId);
    ipc.on('fetchLastJavak', this.fetchLastJavak);
    ipc.on('fetchNewReceiptNumberForJavak', this.fetchNewReceiptNumberForJavak);
    ipc.on('fetchJavaksOfSingleMerchant', this.fetchJavaksOfSingleMerchant);
  }

  saveJavak(event, data) {
    // for auto id of rashan and chips
    javaksDB.insert({ _id: '__autoid__chips', value: 0 });
    javaksDB.insert({ _id: '__autoid__rashan', value: 0 });

    let autoId = '__autoid__rashan';
    if (data.type === 'chips') {
      autoId = '__autoid__chips';
    }

    javaksDB.findOne({ _id: autoId }, (err, doc) => {
      javaksDB.update({ _id: autoId }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        javaksDB.insert(data, (err, newDoc) => {

          let whereCondition = { javakId: 'tempJavakId', type: newDoc.type };
          if (newDoc.type === 'rashan' || newDoc.type === 'beeju') {
            whereCondition = { javakId: 'tempJavakId', type: { $in: ['rashan', 'beeju'] } };
          }
          //Change id of javak lots from temp
          javakLotsDB.update(whereCondition, { $set: { javakId: newDoc._id } }, { multi: true }, function (err, numReplaced) {
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
    javaksDB.find({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).exec((err, javaks) => {
      javakLotsDB.find({}, (err, javakLots) => {
        let finalJavaks = [];
        javaks.forEach(javak => {
          let sumOfPacketsOfJavakLots = 0;
          javakLots.forEach((javakLot) => {
            if (javakLot.javakId === javak._id) {
              sumOfPacketsOfJavakLots += parseInt(javakLot.packet, 10);
            }
          });
          finalJavaks.push({ ...javak, sumOfPacketsOfJavakLots });
        });
        this.mainWindow.webContents.send('fetchJavaksResponse', finalJavaks);
      });
    });
  };

  deleteJavak(event, data) {
    javaksDB.remove({ _id: data.JavakId }, {}, (err, numRemoved) => {
      javakLotsDB.remove({ javakId: data.JavakId }, { multi: true }, (err, numRemoved) => {
        let response = {};
        response.error = err;
        this.mainWindow.webContents.send('deleteJavakResponse', response);
      });
    });
  };

  editJavak(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;
    data.receiptNumber = parseInt(data.receiptNumber, 10);// so that we don't face any problem in the sorting
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

        // Sort avaks according to the receipt Number
        finalAvaks.sort((a, b) => (a.receiptNumber > b.receiptNumber) ? 1 : ((b.receiptNumber > a.receiptNumber) ? -1 : 0));

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
    javaksDB.find({ party: data.partyId }).sort({ updatedAt: -1 }).exec((err, javaks) => {
      this.mainWindow.webContents.send('fetchJavaksByPartyIdResponse', javaks);
    });
  };

  fetchLastJavak(event, data) {
    javaksDB.findOne({ receiptNumber: { $exists: true } }).sort({ createdAt: -1 }).limit(1).exec((err, lastJavak) => {
      addressesDB.findOne({ _id: lastJavak.address }, (err, address) => {
        partiesDB.findOne({ _id: lastJavak.party }, (err, party) => {
          addressesDB.findOne({ _id: lastJavak.addressOfMerchant }, (err, addressOfMerchant) => {
            partiesDB.findOne({ _id: lastJavak.merchant }, (err, merchant) => {

              // Doing this shit so that the react-select does work correctly in the redux-form
              lastJavak.address = { label: address.addressName, value: address._id };
              lastJavak.addressOfMerchant = { label: addressOfMerchant.addressName, value: addressOfMerchant._id };
              lastJavak.party = { label: party.name, value: party._id };
              lastJavak.merchant = { label: merchant.name, value: merchant._id };
              lastJavak.type = { label: lastJavak.type, value: lastJavak.type };

              // Delete the data we dont want to initialize in the add javak form
              delete lastJavak.motorNumber;
              delete lastJavak.receiptNumber;
              delete lastJavak._id;
              delete lastJavak.createdAt;
              delete lastJavak.updatedAt;
              delete lastJavak.remark;
              delete lastJavak.yearId;

              this.mainWindow.webContents.send('fetchLastJavakResponse', lastJavak);
            });
          });
        });
      });
    });
  };

  fetchNewReceiptNumberForJavak(event, data) {

    let autoId = '__autoid__rashan';
    if (data.type === 'chips') {
      autoId = '__autoid__chips';
    }
    javaksDB.findOne({ _id: autoId }, (err, javak) => {
      this.mainWindow.webContents.send('fetchNewReceiptNumberForJavakResponse', parseInt(javak.value, 10) + 1);
    });
  };

  fetchJavaksOfSingleMerchant(event, merchant) {
    javaksDB.find({ merchant: merchant.merchantId }).sort({ createdAt: -1 }).exec((err, javaks) => {

      // add SumOfPacketsOfJavakLots
      let extractedJavakIds = javaks.map(javak => javak._id);  // extract Javak ids to find corresponding javakLots
      javakLotsDB.find({ javakId: { $in: extractedJavakIds } }, (err, javakLots) => {
        avaksDB.find({ _id: { $in: javakLots.map(javakLot => javakLot.avakId) } }, (err, avaks) => {
          yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => { // fetch current year
            setupsDB.find({ year: currentYear.yearId }, (err, setups) => {


              let finalJavaks = [];

              javaks.forEach(javak => {
                let sumOfPacketsOfJavakLots = 0;
                let totalWeight = 0;
                let totalRent = 0;
                javakLots.forEach(javakLot => {
                  avaks.forEach(avak => {

                    if (javak._id === javakLot.javakId && avak._id === javakLot.avakId) {
                      sumOfPacketsOfJavakLots += parseInt(javakLot.packet, 10);
                      totalWeight += (parseInt(avak.weight, 10) / parseInt(avak.packet, 10)) * parseInt(javakLot.packet, 10);
                      totalRent += (parseInt(avak.weight, 10) / parseInt(avak.packet, 10)) * parseInt(javakLot.packet, 10) * getItemRent(setups, avak.item);
                    }
                  });
                });
                finalJavaks.push({
                  ...javak,
                  sumOfPacketsOfJavakLots: sumOfPacketsOfJavakLots,
                  totalWeight: Math.round(totalWeight),
                  totalRent: Math.round(totalRent),
                });
              });

              this.mainWindow.webContents.send('fetchJavaksOfSingleMerchantResponse', finalJavaks);
            });
          });
        });
      });
    });
  }

}

module.exports = JavakDatabase;