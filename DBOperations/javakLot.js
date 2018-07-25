const ipc = require('electron').ipcMain;
const convertToLowerCase = require('../util').convertToLowerCase;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const avaksDB = require('./connections').getInstance().avaksDB;


class JavakLotsDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.saveJavakLot = this.saveJavakLot.bind(this);
        this.fetchJavakLots = this.fetchJavakLots.bind(this);
        this.fetchJavakLotsByJavakId = this.fetchJavakLotsByJavakId.bind(this);
        this.deleteJavakLot = this.deleteJavakLot.bind(this);
        this.editJavakLot = this.editJavakLot.bind(this);
        ipc.on('saveJavakLot', this.saveJavakLot);
        ipc.on('fetchJavakLots', this.fetchJavakLots);
        ipc.on('fetchJavakLotsByJavakId', this.fetchJavakLotsByJavakId);
        ipc.on('deleteJavakLot', this.deleteJavakLot);
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
            console.log('avakIds: ', avakId);
            javakLotsDB.find({ avakId: avakId}).sort({ updatedAt: -1 }).exec((err, javakLots) => {
                console.log('err: ', err);
                console.log('javakLots: ', javakLots);
                resolve(javakLots);
            });
        });
    }

    fetchJavakLots(event, data) {
        javakLotsDB.find({}).sort({ updatedAt: -1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchJavakLotsResponse', response);
        });
    };

    fetchJavakLotsByJavakId(event, data) {
        javakLotsDB.find({ javakId: data.javakId }).sort({ updatedAt: -1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchJavakLotsByJavakIdResponse', response);
        });
    };

    fetchJavakLotsByAvakId(event, data) {
        javakLotsDB.find({ avakId: data.avakId }).sort({ updatedAt: -1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchJavakLotsByAvakIdResponse', response);
        });
    };

    deleteJavakLot(event, data) {
        javakLotsDB.remove({ _id: data.JavakId }, {}, (err, numRemoved) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('deleteJavakLotResponse', response);
        });
    };

    editJavakLot(event, data) {
        let _id = data._id;
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        // data = convertToLowerCase(data);
        javakLotsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('editJavakLotResponse', response);
        });
    };

}

module.exports = JavakLotsDatabase;