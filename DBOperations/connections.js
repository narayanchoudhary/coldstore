// Created this file separately so that single instance of this file can access. Which will not create problem in the nedb

const Datastore = require('nedb');
var Connections = (function () {
    var instance;

    function createInstance() {
        var object = {
            javaksDB: new Datastore({ filename: 'database/javaks', autoload: true, timestampData: true }),
            avaksDB: new Datastore({ filename: 'database/avaks', autoload: true, timestampData: true }),
            javakLotsDB: new Datastore({ filename: 'database/javakLots', autoload: true, timestampData: true }),
            transactionsDB: new Datastore({ filename: 'database/transactions', autoload: true, timestampData: true }),
            itemsDB: new Datastore({ filename: 'database/items', autoload: true, timestampData: true }),
            varietyDB: new Datastore({ filename: 'database/varieties', autoload: true, timestampData: true }),
            sizeDB: new Datastore({ filename: 'database/sizes', autoload: true, timestampData: true }),
            yearsDB: new Datastore({ filename: 'database/years', autoload: true, timestampData: true }),
            setupsDB: new Datastore({ filename: 'database/setup', autoload: true, timestampData: true }),
            addressesDB: new Datastore({ filename: 'database/address', autoload: true, timestampData: true })
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