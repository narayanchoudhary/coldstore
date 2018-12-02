const ipc = require('electron').ipcMain;
const yearsDB = require('./connections').getInstance().yearsDB;
const OpeningBalanceDB = require('./connections').getInstance().openingBalanceDB;
const partiesDB = require('./connections').getInstance().partiesDB;
const avaksDB = require('./connections').getInstance().avaksDB;
const setupsDB = require('./connections').getInstance().setupsDB;
const itemsDB = require('./connections').getInstance().itemsDB;
const varietyDB = require('./connections').getInstance().varietyDB;
const rentsDB = require('./connections').getInstance().rentsDB;
const javakLotsDB = require('./connections').getInstance().javakLotsDB;
const banksDB = require('./connections').getInstance().banksDB;
const javaksDB = require('./connections').getInstance().javaksDB;

class PartyDatabase {
	constructor(mainWindow) {
		this.mainWindow = mainWindow;
		this.saveParty = this.saveParty.bind(this);
		this.fetchParties = this.fetchParties.bind(this);
		this.fetchParty = this.fetchParty.bind(this);
		this.deleteParty = this.deleteParty.bind(this);
		this.editParty = this.editParty.bind(this);
		this.fetchOpeningBalanceOfParty = this.fetchOpeningBalanceOfParty.bind(this);
		this.fetchTransactionsOfSingleParty = this.fetchTransactionsOfSingleParty.bind(this);
		this.fetchStatusOfSingleParty = this.fetchStatusOfSingleParty.bind(this);
		ipc.on('saveParty', this.saveParty);
		ipc.on('fetchParties', this.fetchParties);
		ipc.on('fetchParty', this.fetchParty);
		ipc.on('deleteParty', this.deleteParty);
		ipc.on('editParty', this.editParty);
		ipc.on('fetchOpeningBalanceOfParty', this.fetchOpeningBalanceOfParty);
		ipc.on('fetchTransactionsOfSingleParty', this.fetchTransactionsOfSingleParty);
		ipc.on('fetchStatusOfSingleParty', this.fetchStatusOfSingleParty);
	}

	saveParty(event, data) {
		// Convert name to lower case
		data.name = data.name.toLowerCase();

		// store openingBalnce and side of transaction in different variable
		let openingBalance = data.openingBalance;
		let side = data.side;// side of transaction i.e debit or credit

		// delete openingBalance and side from the data we dont want to store it in the party
		delete data.openingBalance;
		delete data.side;

		// insert party
		partiesDB.insert(data, (err, newParty) => {

			// find current year id
			yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {

				// Create opening balance object
				let openingBalanceData = {};
				openingBalanceData.particularId = newParty._id;
				openingBalanceData.openingBalance = openingBalance;// from the form submitted
				openingBalanceData.yearId = currentYear.yearId;
				openingBalanceData.side = side;

				// insert opening balance
				OpeningBalanceDB.insert(openingBalanceData, (err, newDoc) => {
					let response = {};
					response.error = err;
					this.mainWindow.webContents.send('savePartyResponse', response);
				});

			});
		});
	};

	fetchParties(event, data) {
		partiesDB.find({}).sort({ name: 1 }).exec((err, parties) => {
			avaksDB.find({}, (err, avaks) => {
				javakLotsDB.find({}, (err, javakLots) => {

					let modifiedParties = [];
					parties.forEach(party => {
						let sumOfTotalAvakPackets = 0;
						let sumOfTotalJavakPackets = 0;
						avaks.forEach(avak => {
							if (avak.party === party._id) {
								sumOfTotalAvakPackets += parseInt(avak.packet, 10);
								javakLots.forEach(javakLot => {
									if (javakLot.avakId === avak._id) {
										sumOfTotalJavakPackets += parseInt(javakLot.packet, 10);
									}
								});
							}
						});
						modifiedParties.push({ ...party, totalAvak: sumOfTotalAvakPackets, totalJavak: sumOfTotalJavakPackets, balance: sumOfTotalAvakPackets - sumOfTotalJavakPackets });
					});
					let response = {};
					response.error = err;
					response.data = modifiedParties;
					this.mainWindow.webContents.send('fetchPartiesResponse', response);
				});
			});
		});
	};

	fetchParty(event, data) {
		partiesDB.findOne({ _id: data.partyId }).exec((err, party) => {
			this.mainWindow.webContents.send('fetchPartyResponse', party);
		});
	};

	deleteParty(event, data) {
		partiesDB.remove({ _id: data.partyId }, {}, (err, numRemoved) => {
			let response = {};
			response.error = err;
			this.mainWindow.webContents.send('deletePartyResponse', response);
		});
	};

	editParty(event, data) {
		let _id = data._id;
		delete data._id;
		delete data.createdAt;
		delete data.updatedAt;
		data.name = data.name.toLowerCase();
		partiesDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
			let response = {};
			response.error = err;
			this.mainWindow.webContents.send('editPartyResponse', response);
		});
	};

	fetchOpeningBalanceOfParty(event, data) {
		// fetch current year
		yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {
			// get opening balance of the party of current year
			OpeningBalanceDB.findOne({ $and: [{ particularId: data.partyId }, { yearId: currentYear.yearId }] }, (err, doc) => {
				let response = {};
				response.error = err;
				response.data = doc
				this.mainWindow.webContents.send('fetchOpeningBalanceOfPartyResponse', response);
			});
		});
	};

	fetchTransactionsOfSingleParty(event, partyId) {
		let transactions = [];
		yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => { // fetch current year
			OpeningBalanceDB.findOne({ $and: [{ particularId: partyId }, { yearId: currentYear.yearId }] }, (err, openingBalanceDoc) => { // get opening balance of the party of current year
				avaksDB.find({ party: partyId }, (err, avaks) => {
					setupsDB.find({ year: currentYear.yearId }, (err, setups) => {
						rentsDB.find({ party: partyId }).sort({ createdAt: 1 }).exec((err, rents) => {
							partiesDB.find({}, (err, parties) => {
								banksDB.find({}, (err, banks) => {
									banks.push({ _id: 'cash', bankName: 'cash' }); // insert cash bank
									javaksDB.find({ $and: [{ party: partyId }, { merchant: { $ne: partyId } }] }, (err, merchantJavaks) => { //javaks jo ye nahi lega
										javakLotsDB.find({ javakId: { $in: merchantJavaks.map((javak) => javak._id) } }, (err, javakLots) => { // javaks jo ye legaya kisi dusare ke account me se

											javaksDB.find({ $and: [{ merchant: partyId }, { party: { $ne: partyId } }] }, (err, javaksFromOtherAccounts) => {
												javakLotsDB.find({ javakId: { $in: javaksFromOtherAccounts.map((javak) => javak._id) } }, (err, javakLotsFromOtherAccounts) => { // javaks jo ye legaya kisi dusare ke account me se
													avaksDB.find({ _id: { $in: javakLotsFromOtherAccounts.map((javakLotFromOtherAccount) => javakLotFromOtherAccount.avakId) } }, (err, avaksFromOtherAccount) => {

														// Calculate totoalRent and TotalAvakHammali
														let totalRent = 0;
														let totalAvakHammali = 0;
														let totalMotorBhada = 0;

														avaks.forEach(avak => {
															totalRent += parseInt(avak.weight, 10) * this.getItemRent(setups, avak.item);
															totalAvakHammali += parseInt(avak.avakHammali, 10) || 0;
															console.log('parseInt(avak.avakHammali, 10);: ', parseInt(avak.avakHammali, 10));
															totalMotorBhada += parseInt(avak.motorBhada, 10) || 0;
														});

														// 1 Add opening balance
														transactions.push({ _id: 'openingBalance', amount: openingBalanceDoc.openingBalance, particular: 'Opening Balance', side: openingBalanceDoc.side, deleteButton: 'no' }); // Insert opening balance row

														// 2 Add Avak hammali
														transactions.push({ _id: 'avakHammali', amount: Math.round(totalAvakHammali), particular: 'Avak Hammali', side: 'debit', deleteButton: 'no' }); // Insert avak Hammali
														console.log('totalAvakHammali: ', totalAvakHammali);

														// 3 Add motor Bhada
														transactions.push({ _id: 'motorBhada', amount: Math.round(totalMotorBhada), particular: 'motor Bhada', side: 'debit', deleteButton: 'no' }); // Insert motor bhada

														// 4 Add amounts to be taken from parties jo es account se maal le gaye he
														let rentFromParties = [];
														let merchantIds = [...new Set(merchantJavaks.map(javak => javak.merchant))];
														let totalAmountFromMerchants = 0;
														merchantIds.forEach(merchantId => {

															// sirf es marchant ki javaks nikalo
															let idn = merchantJavaks.filter(merchantJavak => merchantJavak.merchant === merchantId);

															// fir en javaks se ids extract karo
															let idn2 = idn.map(idn => idn._id);

															// fir vo sare javak lots nikalo jo ye merchant le gaya he
															let idn3 = javakLots.filter(javakLot => idn2.includes(javakLot.javakId));


															let totalAmount = 0;
															let totalPacket = 0;
															idn3.forEach(javakLot => {
																let amount = 0;
																avaks.forEach((avak) => {
																	if (javakLot.avakId === avak._id) {
																		amount = Math.round((parseInt(avak.weight, 10) / parseInt(avak.packet, 10) * parseInt(javakLot.packet, 10)) * this.getItemRent(setups, avak.item));
																		totalPacket += parseInt(javakLot.packet, 10);
																	}
																});
																totalAmount += amount;
															});

															totalAmountFromMerchants += totalAmount;

															rentFromParties.push({
																_id: 'asdf',
																date: '',
																amount: totalAmount,
																particular: parties.filter(party => party._id === merchantId)[0].name + ' se lena ' + totalPacket + ' packet ka rent',
																side: 'debit',
															});
														});
														transactions = transactions.concat(rentFromParties);

														// 5 Add rent jo svyam khatedar se lena he
														transactions.push({ _id: 'totalRent', amount: Math.round(totalRent - totalAmountFromMerchants), particular: 'Swayam Khatedar se lena', side: 'debit', deleteButton: 'no' }); // Insert total rent row

														// 6 Add un packets ka bhada jo ye le gaya he kisi aur ke account me se as a merchant
														let totalAmountFromOtherAccounts = 0;
														javakLotsFromOtherAccounts.forEach(javakLotFromOtherAccount => {
															let amount = 0;
															avaksFromOtherAccount.forEach((avak) => {
																if (javakLotFromOtherAccount.avakId === avak._id) {
																	amount = Math.round((parseInt(avak.weight, 10) / parseInt(avak.packet, 10) * javakLotFromOtherAccount.packet) * this.getItemRent(setups, avak.item));
																}
															});
															totalAmountFromOtherAccounts += amount;
														});


														transactions.push({
															_id: 'abc',
															date: '',
															amount: totalAmountFromOtherAccounts,
															particular: 'dusro ke jama karna',
															side: 'debit',
														});


														// 7 Add rents jo swayam esne ya kisi marchant ne jama kiye he
														rents.forEach(rent => {
															let merchant = 'self';
															if (rent.merchant !== rent.party) {
																merchant = parties.filter((party) => party._id === rent.merchant)[0].name; // get Merchant
															}

															let bankName = 'cash';
															if (rent.rentType !== 'cash') {
																bankName = banks.filter((bank) => bank._id === rent.bank)[0].bankName;
															}

															let remark = rent.remark ? rent.remark : '';
															transactions.push({
																_id: rent._id,
																date: rent.date,
																amount: rent.amount,
																particular: bankName + ' ' + rent.receiptNumber + ' ' + merchant + ' ' + remark,
																side: 'credit',
															});
														});

														// Add footer
														let sumOfCredits = 0;
														let sumOfDebits = 0;
														transactions.forEach(transaction => {
															if (transaction.side === 'credit') {
																sumOfCredits += parseInt(transaction.amount, 10);
															} else {
																sumOfDebits += transaction.amount;
															}
														});

														let balance = parseInt((sumOfCredits - sumOfDebits), 10);
														
														

														transactions.push({
															_id: 'footer',
															amount: Math.abs(balance),
															particular: 'Balance',
															side: balance > 0 ? 'credit' : 'debit'
														});
														
														this.mainWindow.webContents.send('fetchTransactionsOfSinglePartyResponse', transactions);
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	}

	getItemRent(setups, itemId) {
		let itemRent = null;
		setups.forEach(setup => {
			if (setup.item === itemId) {
				itemRent = setup.rent;
			}
		});

		return parseFloat(itemRent);
	}

	getItemAvakHammali(setups, itemId) {
		let itemAvakHammali = null;
		setups.forEach(setup => {
			if (setup.item === itemId) {
				itemAvakHammali = setup.avakHammali;
			}
		});

		return parseFloat(itemAvakHammali);
	}

	fetchStatusOfSingleParty(event, partyId) {
		partyId = partyId.partyId;
		let types = ['chips', 'rashan', 'beeju'];
		yearsDB.findOne({ _id: '__currentYear__' }, (err, currentYear) => {
			avaksDB.find({ party: partyId }, (err, avaks) => {
				javakLotsDB.find({ avakId: { $in: avaks.map((avak) => avak._id) } }, (err, javakLots) => {
					itemsDB.find({}, (err, items) => {
						varietyDB.find({}, (err, varieties) => {


							let itemsList = [];
							items.forEach(item => {
								let totalAvakPacketOfItem = 0;
								let totalJavakLotsPacketOfItem = 0;

								let typesList = [];
								types.forEach(type => {
									let totalAvakPacketOfType = 0;
									let totalJavakLotsPacketOfType = 0;

									let varietiesList = [];
									varieties.forEach(variety => {
										let totalAvakOfVariety = 0;
										let totalJavakOfVariety = 0;
										avaks.forEach(avak => {
											if ((avak.item === item._id) && (avak.type === type) && (avak.variety === variety._id)) {
												totalAvakOfVariety += parseInt(avak.packet, 10);
												javakLots.forEach(javakLot => {
													if (javakLot.avakId === avak._id) {
														totalJavakOfVariety += parseInt(javakLot.packet, 10);
													}
												});
											}
										});

										varietiesList.push({
											varietyName: variety.varietyName,
											totalAvakOfVariety: totalAvakOfVariety,
											totalJavakOfVariety: totalJavakOfVariety,
											balance: totalAvakOfVariety - totalJavakOfVariety,
										});

										totalAvakPacketOfType += totalAvakOfVariety;
										totalJavakLotsPacketOfType += totalJavakOfVariety;

									});

									varietiesList.push({
										varietyName: 'total',
										totalAvakOfVariety: totalAvakPacketOfType,
										totalJavakOfVariety: totalJavakLotsPacketOfType,
										balance: totalAvakPacketOfItem - totalJavakLotsPacketOfItem,
									});

									typesList.push({
										type: type,
										varietyList: varietiesList
									});

									totalAvakPacketOfItem += totalAvakPacketOfType;
									totalJavakLotsPacketOfItem += totalJavakLotsPacketOfType;

								});

								itemsList.push({
									itemName: item.itemName,
									_id: item._id,
									typeList: typesList,
									totalAvakPacket: totalAvakPacketOfItem,
									totalJavakLotsPacket: totalJavakLotsPacketOfItem,
								});

								// sort item list alphabatically
								itemsList.sort(function (a, b) {
									if (a.itemName < b.itemName) { return -1; }
									if (a.itemName > b.itemName) { return 1; }
									return 0;
								})

							});
							this.mainWindow.webContents.send('fetchStatusOfSinglePartyResponse', itemsList);
						});
					});
				});
			});
		});
	}

}

module.exports = PartyDatabase;