var pjson = require('./package.json');
console.log("weewx_server %s", pjson.version)

var server = require ('./server');

var port = Number(process.env.SERVER_PORT) || 8081;
