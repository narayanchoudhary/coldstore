const ipc = require('electron').ipcMain;
const itemsDB = require('./connections').getInstance().itemsDB;
const convertToLowerCase = require('../util').convertToLowerCase;
class ItemDatabase {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.saveItem = this.saveItem.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    ipc.on('saveItem', this.saveItem);
    ipc.on('fetchItems', this.fetchItems);
    ipc.on('deleteItem', this.deleteItem);
    ipc.on('editItem', this.editItem);
  }

  saveItem(event, data) {
    // for auto id
    itemsDB.insert({ _id: '__autoid__', value: 0 });

    itemsDB.findOne({ _id: '__autoid__' }, (err, doc) => {
      itemsDB.update({ _id: '__autoid__' }, { $set: { value: ++doc.value } }, {}, () => {
        data.receiptNumber = doc.value;
        data = convertToLowerCase(data);
        itemsDB.insert(data, (err, newDoc) => {
          let response = {};
          response.error = err;
          this.mainWindow.webContents.send('saveItemResponse', response);
        });
      });
    });
  };

  fetchItems(event, data) {
    itemsDB.find({ receiptNumber : { $exists: true }}).sort({ date: 1 }).exec((err, data) => {
      let response = {};
      response.error = err;
      response.data = data;
      this.mainWindow.webContents.send('fetchItemsResponse', response);
    });
  };

  deleteItem(event, data) {
    itemsDB.remove({ _id: data.AvakId }, {}, (err, numRemoved) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('deleteItemResponse', response);
    });
  };

  editItem(event, data) {
    let _id = data._id;
    delete data._id;
    delete data.createdAt;
    delete data.updatedAt;

    data = convertToLowerCase(data);
    itemsDB.update({ _id: _id }, { ...data }, {}, (err, numReplaced) => {
      let response = {};
      response.error = err;
      this.mainWindow.webContents.send('editItemResponse', response);
    });
  };
}

module.exports = ItemDatabase;