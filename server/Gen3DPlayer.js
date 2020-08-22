const fs = require('fs');

Gen3DPlayer = class {
  static bodyParts = {
    "head": ["Head"],
    "arms": ["ArmL", "ArmR"],
    "body": ["Body"],
    "legs": ["LegL", "LegR"]
  };

  static getData()
  {
    var data = {};

    for (var part in this.bodyParts) {
      data[part] = this.getPartData(part);
    }

    return data;
  }

  static getPartData(part)
  {
    var data = {layers: {}, parts: this.bodyParts[part]};
    var layers = this.getFolders(part);

    for (var layer of layers) {
      //data.layers[layer] ;

      var skins = this.getFolders(part + "/" + layer);

      for (var skin of skins) {
        data.layers[layer] = skins;
      }
    }

    return data;
  }

  static getAnimations()
  {
    return JSON.parse(fs.readFileSync('./resources/data/player/animations.json', "utf8"));
  }

  static getFolders(dir)
  {
    var files = fs.readdirSync('./resources/data/player/' + dir);

    for (var f of files) {
      if(f.endsWith(".png")) {
        files.splice(files.indexOf(f), 1);
      }
    }

    return files;
  }
}
