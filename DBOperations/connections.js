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
            settingsDB: new Datastore({ filename: 'database/setting', autoload: true, timestampData: true })
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