const ipc = require('electron').ipcMain;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const avaksDB = require('./connections').getInstance().avaksDB;


class JavakLotsDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.saveJavakLot = this.saveJavakLot.bind(this);
        this.fetchJavakLotsByJavakId = this.fetchJavakLotsByJavakId.bind(this);
        this.fetchJavakLotsByAvakIds     = this.fetchJavakLotsByAvakIds.bind(this);
        this.deleteJavakLot = this.deleteJavakLot.bind(this);
        this.removeTempJavakLots = this.removeTempJavakLots.bind(this);
        this.editJavakLot = this.editJavakLot.bind(this);
        ipc.on('saveJavakLot', this.saveJavakLot);
        ipc.on('fetchJavakLotsByJavakId', this.fetchJavakLotsByJavakId);
        ipc.on('fetchJavakLotsByAvakIds', this.fetchJavakLotsByAvakIds);
        ipc.on('deleteJavakLot', this.deleteJavakLot);
        ipc.on('removeTempJavakLots', this.removeTempJavakLots);
        ipc.on('editJavakLot', this.editJavakLot);
    }

    saveJavakLot(event, data) {
        // Get javakId
        let javakId = data.javakId

        // Get Avak
        avaksDB.find({ _id: data.avakId }).sort({ updatedAt: -1 }).exec((err, data) => {
            data = data[0]; // Because data is array

            // get remaining packet and the
            this.fetchLots(data._id).then((javakLots) => {
                // Get already sent packet of this avak
                let sentPacket = 0;
                javakLots.forEach((javakLot) => {
                    sentPacket += parseInt(javakLot.packet)
                });

                // Get remaining packet
                let remainingPacket = data.packet - sentPacket;
                // Create lot object
                let lot = {};
                lot.avakId = data._id;
                lot.itemId = data.item;
                lot.packet = remainingPacket;
                lot.chamber = data.chamber;
                lot.floor = data.floor;
                lot.rack = data.rack;
                lot.javakId = javakId;
                
                // Insert lot in the db
                javakLotsDB.insert(lot, (err, newDoc) => {
                    let response = {};
                    response.error = err;
                    this.mainWindow.webContents.send('saveJavakLotResponse', response);
                });
            });
        });
    };

    fetchLots(avakId) {
        return new Promise((resolve, reject) => {
            javakLotsDB.find({ avakId: avakId }).sort({ createdAt: -1 }).exec((err, javakLots) => {
                resolve(javakLots);
            });
        });
    }

    fetchJavakLotsByJavakId(event, data) {
        javakLotsDB.find({ javakId: data.javakId }).sort({ updatedAt: -1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchJavakLotsByJavakIdResponse', response);
        });
    };

    fetchJavakLotsByAvakIds(event, data) {
        javakLotsDB.find({ avakId: { $in: data.avakIds } }).sort({ createdAt: 1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchJavakLotsByAvakIdsResponse', response);
        });
    };

    deleteJavakLot(event, data) {
        javakLotsDB.remove({ _id: data.JavakLotId }, {}, (err, numRemoved) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('deleteJavakLotResponse', response);
        });
    };

    removeTempJavakLots(event, data) {
        javakLotsDB.remove({ javakId: 'tempJavakId' }, { multi: true }, (err, numRemoved) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('removeTempJavakLotsResponse', response);
        });
    };

    editJavakLot(event, data) {
        let _id = data._id;
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        javakLotsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('editJavakLotResponse', response);
        });
    };

}

module.exports = JavakLotsDatabase;