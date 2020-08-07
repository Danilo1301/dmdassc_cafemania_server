Server = class {
  static io;
  static data = {
    player: {},
    animations: {}
  };

  static setup(io) {
    this.io = io;
    this.io.on('connection', this.onSocketConnection.bind(this));

    this.getLocalResources();
  }

  static onSocketConnection(socket)
  {
    socket.on("data", function(packetData, callback) {
      var id = packetData.id;
      var data = packetData.data;

      if(id == "login") {

        callback({id: "nsei", data: Server.data});

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
  }
}
