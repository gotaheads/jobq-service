var mongodbRest = require('mongodb-rest/server.js');
var defaultLogger = {
    verbose: function (msg) {
//    console.log(msg);
    },

    info: function (msg) {
        console.log(msg);
    },

    warn: function (msg) {
        console.log(msg);
    },

    error: function (msg) {
        console.log(msg);
    },
};
var defaultConfig = {
    db: 'mongodb://localhost:27017',
    server: {
        port: 3200,
        address: "0.0.0.0"
    },
    accessControl: {
        allowOrigin: "*",
        allowMethods: "GET,POST,PUT,DELETE,HEAD,OPTIONS",
        allowCredentials: false
    },
    mongoOptions: {
        serverOptions: {
        },
        dbOptions: {
            w: 1
        }
    },
    humanReadableOutput: true,
    collectionOutputType: "json",
    urlPrefix: "",
    logger: defaultLogger,
    ssl: {
        enabled: false,
        options: {}
    }
};
mongodbRest.startServer(defaultConfig);