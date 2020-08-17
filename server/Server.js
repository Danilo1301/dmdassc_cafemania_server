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
    tileItems: {}
  };

  static loadedGameLogic = false;

  static users = {};

  static setup(io) {
    this.io = io;
    this.io.on('connection', this.onSocketConnection.bind(this));

    GameLogic.gameData = Server.data;
    this.getLocalResources();
  }


  static onSocketConnection(socket)
  {
    socket.on("data", function(packetData, callback) {
      var id = packetData.id;
      var data = packetData.data;

      if(id == "login") {


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
    })
  }

  static getLocalResources()
  {
    this.data.player = Gen3DPlayer.getData();
    this.data.animations = Gen3DPlayer.getAnimations();

    this.getTileItems("cooker");
    this.getTileItems("floor");
    this.getTileItems("wall");

    console.log(this.data)
  }

  static getTileItems(name)
  {
    var files = fs.readdirSync('./resources/data/'+name);

    for (var f of files) {
      if(f.includes(".")) { files.splice(files.indexOf(f), 1); }
    }

    for (var file of files) {
      var data = JSON.parse(fs.readFileSync('./resources/data/' + name + '/' + file + '/data.json', "utf8"));

      data.id = TILE_ITEM[data.id];
      data.type = TILE_ITEM_TYPE[data.type];
      data.path = name + "/" + file;

      this.data.tileItems[data.id] = data;
    }
  }
}
