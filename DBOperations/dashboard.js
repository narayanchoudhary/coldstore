const ipc = require('electron').ipcMain;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const itemsDB = require('./connections').getInstance().itemsDB;
const varietyDB = require('./connections').getInstance().varietyDB;

class DashboardDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.fetchDashboard = this.fetchDashboard.bind(this);
        ipc.on('fetchDashboard', this.fetchDashboard);
    }

    fetchDashboard(event, data) {

        // get everything from database
        itemsDB.find({}, (err, items) => {
            avaksDB.find({}, (err, avaks) => {
                javakLotsDB.find({}, (err, javakLots) => {
                    varietyDB.find({}, (err, varieties) => {
                        let types = ['chips', 'rashan', 'beeju'];

                        let itemList = [];
                        items.forEach(item => {
                            
                            let filteredAvaksByItem = avaks.filter(avak => avak.item === item._id); // filter the avaks
                            let filteredJavakLots = javakLots.filter(javakLot => javakLot.itemId === item._id); // filter the javakLots

                            // Calculate the sum of packets of the avaks which has this particular item
                            let totalAvakPacket = 0;
                            filteredAvaksByItem.forEach(avak => {
                                totalAvakPacket += parseInt(avak.packet, 10);
                            });

                            // Calculate the sum of packets of the javaks which has this particular item
                            let totalJavakLotsPacket = 0;
                            filteredJavakLots.forEach(javakLot => {
                                totalJavakLotsPacket += parseInt(javakLot.packet, 10);
                            });

                            let typeList = [];

                            types.forEach(type => {

                                let filteredAvaksByItemThenType = filteredAvaksByItem.filter(avak => avak.type === type);
                                let varietyList = [];
                                let totalAvakOfType = 0;
                                let totalJavakOfType = 0;

                                varieties.forEach((variety) => {
                                    let totalAvakOfVariety = 0;
                                    let filteredAvakIds = []; // for getting all the javakLots of this variety to calculate the sum of packts of javakLots
                                    let totalJavakOfVariety = 0;

                                    filteredAvaksByItemThenType.forEach(avak => {
                                        if (variety._id === avak.variety) {
                                            totalAvakOfVariety += parseInt(avak.packet, 10);
                                            filteredAvakIds.push(avak._id);
                                        }
                                    });

                                    filteredJavakLots.forEach(javakLot => {
                                        if (filteredAvakIds.includes(javakLot.avakId)) {
                                            totalJavakOfVariety += parseInt(javakLot.packet, 10);
                                        }
                                    });

                                    varietyList.push(
                                        {
                                            varietyName: variety.varietyName,
                                            totalAvakOfVariety: totalAvakOfVariety,
                                            totalJavakOfVariety: totalJavakOfVariety,
                                            balance: totalAvakOfVariety - totalJavakOfVariety,
                                        }
                                    );

                                    totalAvakOfType += totalAvakOfVariety;
                                    totalJavakOfType += totalJavakOfVariety;
                                });

                                varietyList.push({
                                    varietyName: 'total',
                                    totalAvakOfVariety: totalAvakOfType,
                                    totalJavakOfVariety: totalJavakOfType,
                                    balance: totalAvakOfType - totalJavakOfType,

                                });

                                typeList.push({
                                    type: type,
                                    varietyList: varietyList
                                });

                            });

                            // create itemList array
                            itemList.push({
                                ...item,
                                totalAvakPacket: totalAvakPacket,
                                totalJavakLotsPacket: totalJavakLotsPacket,
                                typeList: typeList,
                            });

                            // sort item list alphabatically
                            itemList.sort(function(a, b){
                                if(a.itemName < b.itemName) { return -1; }
                                if(a.itemName > b.itemName) { return 1; }
                                return 0;
                            })

                        });
                        this.mainWindow.webContents.send('fetchDashboardResponse', itemList);
                    });
                });
            });
        });
    };

}

module.exports = DashboardDatabase;