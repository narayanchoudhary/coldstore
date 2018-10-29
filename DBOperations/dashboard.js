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
        // find all items
        itemsDB.find().exec((err, items) => {
            // find all avaks
            avaksDB.find({}).exec((err, avaks) => {
                // fetch all the javak lots
                javakLotsDB.find({}).exec((err, javakLots) => {
                    // fetch all varieties
                    varietyDB.find({}).exec((err, varieties) => {


                        let dashboard = [];
                        // then foreach item
                        items.forEach(item => {

                            // filter the avaks
                            let filteredAvaks = avaks.filter(avak => avak.item === item._id);
                            // filter the javakLots
                            let filteredJavakLots = javakLots.filter(javakLot => javakLot.itemId === item._id);

                            // Calculate the sum of packets of the avaks which has this particular item
                            let totalAvakPacket = 0;
                            filteredAvaks.forEach(avak => {
                                totalAvakPacket += parseInt(avak.packet, 10);
                            });

                            // Calculate the sum of packets of the javaks which has this particular item
                            let totalJavakLotsPacket = 0;
                            filteredJavakLots.forEach(javakLot => {
                                totalJavakLotsPacket += parseInt(javakLot.packet, 10);
                            });

                            let varietiesDescription = [];
                            //foreach variety
                            varieties.forEach((variety) => {
                                let sumOfPackets = 0;
                                filteredAvaks.forEach(avak => {
                                    if (variety._id === avak.variety)
                                        sumOfPackets += parseInt(avak.packet, 10);
                                });

                                if(sumOfPackets !== 0) // We want to show the varieties in dashboard which has at least one packet of this item
                                varietiesDescription.push(
                                    { varietyName: variety.varietyName, sumOfPackets }
                                );

                            });


                            // Calculate sum of packets in chips and rashan
                            let typeDescription = {
                                totalChipsPacket: 0,
                                totalRashanPacket: 0,
                            };

                            filteredAvaks.forEach(avak => {
                                if (avak.type === 'chips') {
                                    typeDescription.totalChipsPacket += parseInt(avak.packet, 10);
                                } else { // for both beeju and rashan
                                    typeDescription.totalRashanPacket += parseInt(avak.packet, 10);
                                }
                            });

                            // create dashboard array
                            dashboard.push({
                                ...item,
                                totalAvakPacket: totalAvakPacket,
                                totalJavakLotsPacket: totalJavakLotsPacket,
                                varietiesDescription: varietiesDescription,
                                typeDescription: typeDescription,
                            });
                        });
                        this.mainWindow.webContents.send('fetchDashboardResponse', dashboard);
                    });
                });
            });
        });
    };

}

module.exports = DashboardDatabase;