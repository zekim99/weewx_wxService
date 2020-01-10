//var http = require('http');
var https = require('https');
const PORT=8080;
var _fullBody = '';
var wx;
const options = {
  cert: fs.readFileSync("/etc/apache2/ssl/fe2b4db8c986695b.crt"),
  key: fs.readFileSync("/etc/apache2/ssl/private/www_sahaleeweather_com.key") 
}

//We need a function which handles requests and send response
function handleRequest(req, res){

    switch(req.url) {
      case '/':
        console.log("[501] " + req.method + " to " + req.url);
        res.writeHead(501, "Not implemented", {'Content-Type': 'text/html'});
        res.end('<html><head><title>501 - Not implemented</title></head><body><h1>Not implemented!</h1></body></html>');
        break;

      case '/wxupdate':
        if (req.method == 'POST') {
          console.log("[200] " + req.method + " to " + req.url);

          _fullBody = '';
          req.on('data', function(chunk) {
            console.log("Received body data:");
            _fullBody += chunk.toString();
            console.log(_fullBody);
          });

          req.on('end', function() {
            // empty 200 OK response for now
            res.writeHead(200, "OK", {'Content-Type': 'text/html'});
            res.end();
          });

        } else {
          console.log("[405] " + req.method + " to " + req.url);
          res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
          res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
        }
        break;

      case '/wx':
        if (req.method == 'GET') {
          console.log("Request for data:");
          res.writeHead(200, "OK", {
            'Content-Type': 'text/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
          });
          res.write(_fullBody);
          res.end();
        } else {
          console.log("[405] " + req.method + " to " + req.url);
          res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
          res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
        }
        break;

      default:
        res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
        res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
        console.log("[404] " + req.method + " to " + req.url);
      };
}



//Create a server
//var server = http.createServer(handleRequest);
var server = https.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    //console.log("Server listening on: http://localhost:%s", PORT);
    console.log("Server listening on: https://localhost:%s", PORT);
});
