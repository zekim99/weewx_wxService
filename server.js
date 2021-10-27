var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    helmet = require('helmet'),
    pjson = require('./package.json');

const PORT=8080;
const process = require('process');

var _fullBody = '';
var wx;

console.log("weewx_server %s", pjson.version)

var app = express();

app.use(helmet());

// set up for ssl
const options = {
  cert: fs.readFileSync('/etc/apache2/ssl/4054ad5e41215c9a.crt'),
  key: fs.readFileSync('/etc/apache2/ssl/private/www_sahaleeweather_com.key'),
  dhparam: fs.readFileSync('/etc/apache2/ssl/dh-strong.pem')
}

// process handler
process.on('uncaughtExeption', (code) => {
  process.exit(1);
});


// requesting weather data
app.get('/wx', function (req, res) {
  console.log('Request for data:');
  res.writeHead(200, 'OK', {
    'Content-Type': 'text/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': 0
  });
  res.write(_fullBody);
  res.end();
});


// posting weather data
app.post('/wxupdate', function(req, res) {
  console.log('[200] ' + req.method + ' to ' + req.url);

  _fullBody = '';

  req.on('data', function(chunk) {
    console.log('Received body data:');
    _fullBody += chunk.toString();
    console.log(_fullBody);
   });

  req.on('end', function() {
    // empty 200 OK response for now
    res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
    res.end();
  });
});

// reject root
app.get('/', function (req, res) {
  console.log('[501] ' + req.method + ' to ' + req.url);
  res.writeHead(501, 'Not implemented', {'Content-Type': 'text/html'});
  res.end('<html><head><title>501 - Not implemented</title></head><body><h1>Not implemented!</h1></body></html>');
});

//app.listen(PORT);

//Create a server
var server = https.createServer(options, app);

server.listen(PORT, "0.0.0.0");
if (server.listening)
  console.log("Server listening on: https://0.0.0.0:%s, PORT");

