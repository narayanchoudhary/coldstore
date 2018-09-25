const ipc = require('electron').ipcMain;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const itemsDB = require('./connections').getInstance().itemsDB;

class DashboardDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.fetchDashboard = this.fetchDashboard.bind(this);
        ipc.on('fetchDashboard', this.fetchDashboard);
    }

    fetchDashboard(event, data) {
        // find all items
        itemsDB.find().exec((err, items) => {
            // find all avaks
            avaksDB.find({}).exec((err, avaks) => {
                let dashboard = [];
                // then foreach item
                items.forEach(item => {
                    // filter the avaks
                    let filteredAvaks = avaks.filter(avak => avak.item === item._id);
                    // Calculate the sum of packets of the avaks which has this particular item
                    let totalAvakPacket = 0;
                    filteredAvaks.forEach(avak => {
                        totalAvakPacket += parseInt(avak.packet, 10);
                    });
                    // create dashboard array
                    dashboard.push({ ...item, totalAvakPacket: totalAvakPacket });
                });
                this.mainWindow.webContents.send('fetchDashboardResponse', dashboard);
            });
        });
    };

}

module.exports = DashboardDatabase;