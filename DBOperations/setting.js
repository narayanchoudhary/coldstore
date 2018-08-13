const ipc = require('electron').ipcMain;
const settingsDB = require('./connections').getInstance().settingsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class SettingDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.defaultSettings = this.defaultSettings.bind(this);
        this.fetchSettings = this.fetchSettings.bind(this);
        this.editSetting = this.editSetting.bind(this);
        ipc.on('defaultSettings', this.defaultSettings);
        ipc.on('fetchSettings', this.fetchSettings);
        ipc.on('editSetting', this.editSetting);
    }

    // Create default settings
    defaultSettings() {
        let data = [
            { settingName: 'rent', value: 1.9 },
            { settingName: 'maxChambers', value: 4 },
            { settingName: 'variety', value: 'jyoti,lr,lovker,chipsona,atl,fc3,fc5,super6,pukharaj' },
            { settingName: 'size', value: 'mota,gulla,chharri,chandi' },
            { settingName: 'item', value: 'aloo,pyaj,gajar,gobhi' },
        ];
        settingsDB.insert(data, (err, newDoc) => {
        });
    };

    fetchSettings(event, data) {
        settingsDB.find({}).sort({ date: 1 }).exec((err, data) => {
            let response = {};
            response.error = err;
            response.data = data;
            this.mainWindow.webContents.send('fetchSettingsResponse', response);
        });
    };

    editSetting(event, data) {
        let settingName = data.settingName;
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;

        data = convertToLowerCase(data);
        settingsDB.update({ settingName: settingName }, { ...data }, {}, (err, numReplaced) => {
            let response = {};
            response.error = err;
            this.mainWindow.webContents.send('editSettingResponse', response);
        });
    };

}

module.exports = SettingDatabase;