const ipc = require('electron').ipcMain;
const avaksDB = require('./connections').getInstance().avaksDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const itemsDB = require('./connections').getInstance().itemsDB;
const varietyDB = require('./connections').getInstance().varietyDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const javaksDB = require('./connections').getInstance().javaksDB;
const rentsDB = require('./connections').getInstance().rentsDB;

class DashboardDatabase {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.fetchDashboard = this.fetchDashboard.bind(this);
        this.fetchPartiesWithRemainingPackets = this.fetchPartiesWithRemainingPackets.bind(this);
        this.fetchPartiesWithRemainingPackets = this.fetchPartiesWithRemainingPackets.bind(this);
        this.fetchCounters = this.fetchCounters.bind(this);
        this.editCounter = this.editCounter.bind(this);
        ipc.on('fetchDashboard', this.fetchDashboard);
        ipc.on('fetchPartiesWithRemainingPackets', this.fetchPartiesWithRemainingPackets);
        ipc.on('fetchCounters', this.fetchCounters);
        ipc.on('editCounter', this.editCounter);
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
                                            item: item,
                                            type: type,
                                            variety: variety
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
                                    // do not add item type variety here we doesn't need it here
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
                            itemList.sort(function (a, b) {
                                if (a.itemName < b.itemName) { return -1; }
                                if (a.itemName > b.itemName) { return 1; }
                                return 0;
                            })

                        });
                        this.mainWindow.webContents.send('fetchDashboardResponse', itemList);
                    });
                });
            });
        });
    };

    fetchPartiesWithRemainingPackets(event, data) {
        partiesDB.find({}, (err, parties) => {
            avaksDB.find({ $and: [{ variety: data.variety }, { type: data.type }, { item: data.item }] }, (err, avaks) => {
                javakLotsDB.find({}, (err, javakLots) => {

                    let partiesWithRemainingPackets = [];
                    parties.forEach(party => {

                        let filteredAvaks = avaks.filter((avak) => avak.party === party._id);
                        let filteredAvakIds = filteredAvaks.map(avak => avak._id);
                        let filteredJavakLots = javakLots.filter((javakLot) => filteredAvakIds.includes(javakLot.avakId));

                        var sumOfAvaks = filteredAvaks.reduce(((acc, filteredAvak) => acc + parseInt(filteredAvak.packet, 10)), 0);
                        var sumOfJavakLots = filteredJavakLots.reduce(((acc, filteredJavakLot) => acc + parseInt(filteredJavakLot.packet, 10)), 0);
                        var balance = sumOfAvaks - sumOfJavakLots;

                        if (balance > 0) {
                            partiesWithRemainingPackets.push({ party: party.name, partyId: party._id, balance });
                        }

                    });
                    this.mainWindow.webContents.send('fetchPartiesWithRemainingPacketsResponse', partiesWithRemainingPackets);
                });
            });
        });

    }

    fetchCounters(event, data) {
        let counters = [];
        avaksDB.findOne({ _id: '__autoid__chips' }, (err, chipsCounterOfAvak) => {
            avaksDB.findOne({ _id: '__autoid__rashan' }, (err, rashanCounterOfAvak) => {
                javaksDB.findOne({ _id: '__autoid__chips' }, (err, chipsCounterOfJavak) => {
                    javaksDB.findOne({ _id: '__autoid__rashan' }, (err, rashanCounterOfJavak) => {
                        rentsDB.findOne({ _id: '__autoid__cash' }, (err, cashCounterOfRent) => {
                            rentsDB.findOne({ _id: '__autoid__bank' }, (err, bankCounterOfRent) => {
                                counters.push({ ...chipsCounterOfAvak, database: 'avak', counterName: 'Chips Avak' });
                                counters.push({ ...rashanCounterOfAvak, database: 'avak', counterName: 'Rashan Avak' });
                                counters.push({ ...chipsCounterOfJavak, database: 'javak', counterName: 'Chips Javak' });
                                counters.push({ ...rashanCounterOfJavak, database: 'javak', counterName: 'Rashan Javak' });
                                counters.push({ ...cashCounterOfRent, database: 'rent', counterName: 'Cash Rent' });
                                counters.push({ ...bankCounterOfRent, database: 'rent', counterName: 'Bank Rent' });
                                this.mainWindow.webContents.send('fetchCountersResponse', counters);
                            });
                        });
                    });
                });
            });
        });
    }

    editCounter(event, data) {
        let DB = null;
        if (data.database === 'avak') {
            DB = avaksDB;
        } else if (data.database === 'javak') {
            DB = javaksDB;
        } else if (data.database === 'rent') {
            DB = rentsDB;
        }

        DB.update({ _id: data._id }, { $set: { value: data.value } }, (err, numReplaced) => {
            this.mainWindow.webContents.send('editCounterResponse', numReplaced);
        });

    }
}

module.exports = DashboardDatabase;