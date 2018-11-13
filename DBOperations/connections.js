// Created this file separately so that single instance of this file can access. Which will not create problem in the nedb

const Datastore = require('nedb');
var Connections = (function () {
    var instance;

    function createInstance() {
        var object = {
            partiesDB: new Datastore({ filename: 'database/parties', autoload: true, timestampData: true }),
            javaksDB: new Datastore({ filename: 'database/javaks', autoload: true, timestampData: true }),
            avaksDB: new Datastore({ filename: 'database/avaks', autoload: true, timestampData: true }),
            javakLotsDB: new Datastore({ filename: 'database/javakLots', autoload: true, timestampData: true }),
            transactionsDB: new Datastore({ filename: 'database/transactions', autoload: true, timestampData: true }),
            itemsDB: new Datastore({ filename: 'database/items', autoload: true, timestampData: true }),
            varietyDB: new Datastore({ filename: 'database/varieties', autoload: true, timestampData: true }),
            sizesDB: new Datastore({ filename: 'database/sizes', autoload: true, timestampData: true }),
            yearsDB: new Datastore({ filename: 'database/years', autoload: true, timestampData: true }),
            setupsDB: new Datastore({ filename: 'database/setups', autoload: true, timestampData: true }),
            addressesDB: new Datastore({ filename: 'database/addresses', autoload: true, timestampData: true }),
            banksDB: new Datastore({ filename: 'database/banks', autoload: true, timestampData: true }),
            expenseCategoriesDB: new Datastore({ filename: 'database/expenseCategories', autoload: true, timestampData: true }),
            expensesDB: new Datastore({ filename: 'database/expense', autoload: true, timestampData: true }),
            openingBalanceDB: new Datastore({ filename: 'database/openingBalance', autoload: true, timestampData: true }),
            rentsDB: new Datastore({ filename: 'database/rents', autoload: true, timestampData: true }),
        };
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = Connections;