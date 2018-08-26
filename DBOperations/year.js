const ipc = require('electron').ipcMain;
const yearsDB = require('./connections').getInstance().yearsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class YearDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.saveYear = this.saveYear.bind(this);
        this.fetchYears = this.fetchYears.bind(this);
        this.deleteYear = this.deleteYear.bind(this);
        this.editYear = this.editYear.bind(this);
        ipc.on('saveYear', this.saveYear);
        ipc.on('fetchYears', this.fetchYears);
        ipc.on('deleteYear', this.deleteYear);
        ipc.on('editYear', this.editYear);
    }

    saveYear(event, data) {
        data = convertToLowerCase(data);
        yearsDB.insert(data, (err, newDoc) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('saveYearResponse', response);
        });
    };

    fetchYears(event, data) {
        yearsDB.find().sort({ date: 1 }).exec((err, data) => {
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
}

module.exports = YearDatabase;