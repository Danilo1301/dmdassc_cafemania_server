const fs = require('fs');

User = class {
  constructor(id)
  {
    this.id = id;
    this.userData = {};
  }
}

Server = class {
  static io;
  static data = {
    player: {},
    animations: {},
    floor: {},
    wall: {}
  };

  static loadedGameLogic = false;

  static users = {};

  static setup(io) {
    this.io = io;
    this.io.on('connection', this.onSocketConnection.bind(this));

    this.getLocalResources();
  }

  static loadGameLogic()
  {
    if(!this.loadedGameLogic) {
      require("C:\\Users\\danil\\Desktop\\PC\\Development\\Cafe Mania\\cafemania\\game\\GameLogic.js");
      require("C:\\Users\\danil\\Desktop\\PC\\Development\\Cafe Mania\\cafemania\\game\\Events.js");

      GameLogic.gameData = Server.data;

      this.loadedGameLogic = true;
    }

  }

  static onSocketConnection(socket)
  {
    socket.on("data", function(packetData, callback) {
      var id = packetData.id;
      var data = packetData.data;

      if(id == "login") {

        Server.loadGameLogic();

        if(!Server.users[data.id]) {
          Server.users[data.id] = new User(data.id);
          GameLogic.createNewGame()
        }

        var user = Server.users[data.id];

        user.userData = GameLogic.userData;

        callback({id: user.id, data: Server.data, userData: user.userData});

        return

        GoogleAuth.loginUser(data.id_token, function(payload) {
          callback(payload['sub']);
        });
      }

      console.log(id, data)

    })
  }

  static getLocalResources()
  {
    this.data.player = Gen3DPlayer.getData();
    this.data.animations = Gen3DPlayer.getAnimations();

    this.data.wall = this.getGameObjects("wall");
    this.data.floor = this.getGameObjects("floor");


    console.log(this.data)
  }

  static getGameObjects(name)
  {
    var files = fs.readdirSync('./resources/data/'+name);

    for (var f of files) {
      if(f.includes(".")) {
        files.splice(files.indexOf(f), 1);
      }
    }

    var objects = {};

    for (var file of files) {
      objects[file] = JSON.parse(fs.readFileSync('./resources/data/' + name + '/' + file + '/data.json', "utf8"));
    }

    return objects;
  }
}
