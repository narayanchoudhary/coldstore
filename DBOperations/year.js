const ipc = require('electron').ipcMain;
const yearsDB = require('./connections').getInstance().yearsDB;
const itemsDB = require('./connections').getInstance().itemsDB;
const setupsDB = require('./connections').getInstance().setupsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class YearDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.saveYear = this.saveYear.bind(this);
        this.fetchYears = this.fetchYears.bind(this);
        this.deleteYear = this.deleteYear.bind(this);
        this.editYear = this.editYear.bind(this);
        this.fetchCurrentYear = this.fetchCurrentYear.bind(this);
        this.changeCurrentYear = this.changeCurrentYear.bind(this);
        ipc.on('saveYear', this.saveYear);
        ipc.on('fetchYears', this.fetchYears);
        ipc.on('deleteYear', this.deleteYear);
        ipc.on('editYear', this.editYear);
        ipc.on('fetchCurrentYear', this.fetchCurrentYear);
        ipc.on('changeCurrentYear', this.changeCurrentYear);
    }

    // insert year
    // then fetch items
    // then foreach item insert a setup
    saveYear(event, data) {
        data = convertToLowerCase(data);
        yearsDB.insert(data, (err, newDoc) => {
            yearsDB.insert({ _id: '__currentYear__', yearId: newDoc._id });// this line will run only once
            itemsDB.find({}, (err, docs) => {
                docs.forEach(doc => {
                    let setupData = {
                        year: newDoc._id,
                        item: doc._id,
                        rent: 1,
                        avakHammali: 1,
                        javakHammali: 1
                    };
                    setupsDB.insert(setupData, (err, newDoc) => {
                        let response = {};
                        response.error = err;
                        this.mainWindow.webContents.send('saveYearResponse', response);
                    });
                });
            });
        });
    };

    fetchYears(event, data) {
        yearsDB.find({ year: { $exists: true } }).sort({ updatedAt: -1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchYearsResponse', response);
        });
    };

    deleteYear(event, data) {
        yearsDB.remove({ _id: data.yearId }, {}, (err, numRemoved) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('deleteYearResponse', response);
        });
    };

    editYear(event, data) {
        let _id = data._id;
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;

        data = convertToLowerCase(data);
        yearsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('editYearResponse', response);
        });
    };

    fetchCurrentYear(event, data) {
        yearsDB.findOne({ _id: '__currentYear__' }, (err, data) => {
            yearsDB.findOne({ _id: data.yearId }, (err, data) => {
                let response = {};
                response.error = err;
                response.data = data;
                this.mainWindow.webContents.send('fetchCurrentYearResponse', response);
            });
        });
    }

    changeCurrentYear(event, data) {
        yearsDB.update({ _id: '__currentYear__' }, { yearId: data.yearId }, {}, (err, numReplaced) => {
            let response = {};
            if (err === null) {
                response.success = 'done';
            }
            this.mainWindow.webContents.send('changeCurrentYearResponse', response);
        });
    }
}

module.exports = YearDatabase;