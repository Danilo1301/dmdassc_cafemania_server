const express = require('express'), path = require('path'), app = express(), http = require('http').Server(app), io = require('socket.io')(http), cookieParser = require('cookie-parser');
const settings = {port: 3000, ip: "127.0.0.1"};

app.use(function (req, res, next) {
    var allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3001', 'http://localhost:3001', 'https://dmdassc-cafemania.glitch.me', 'https://cafemania.glitch.me'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(__dirname + "/resources"));

app.get("/", function(req, res) { res.end(); });

http.listen(settings.port, settings.ip, function() {
  console.log("[server.js] Listening on port " + settings.port);
});

//-----------
const fs = require('fs');

var files = ["tileItems/TileItem.js", "GameLogic.js", "Events.js"];
var dir = "C:\\Users\\danil\\Desktop\\PC\\Development\\Cafe Mania\\cafemania\\game";

for (var file of files)
{
  var from = dir + '\\' + file;
  var to = './tmpclass/' + file;

  if(process.env.IS_GLITCH != "true") {
    fs.copyFileSync(from, to);
  }

  require("./tmpclass/"+file);
}
//---

require("./server/Server.js");
require("./server/GoogleAuth.js");
require("./server/Gen3DPlayer.js");

Server.setup(io);
