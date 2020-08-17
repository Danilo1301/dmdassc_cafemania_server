GameLogic = class {
  static userData = {};
  static gameData;

  static rotationData = {
    0: {
      k: "front",
      flipcoords: false,
      invertx: false,
      inverty: false
    },
    1: {
      k: "front",
      flipcoords: true,
      invertx: false,
      inverty: false
    },
    2: {
      k: "back",
      flipcoords: false,
      invertx: false,
      inverty: true
    },
    3: {
      k: "back",
      flipcoords: true,
      invertx: true,
      inverty: false
    },
  }

  static createNewGame()
  {
    this.userData = {};
    this.userData.money = 2500;
    this.userData.totalItems = 0;
    this.userData.inventory = [];
    this.userData.tiles = {};

    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 4; x++) {
        this.userData.tiles[`${x}:${y}`] = {
          objects: [],
          x: x,
          y: y
        }

        var customFloor = this.createFloor(Math.random() > 0.5 ? TILE_ITEM.FLOOR_1 : TILE_ITEM.FLOOR_0);

        customFloor.data.custom = 123;

        this.placeItem(customFloor, x, y);
      }
    }

    //console.log(this.userData)
  }

  static setupGame()
  {
    for (var tile_key in this.userData.tiles) {
      var tile = this.userData.tiles[tile_key];
      Events.trigger("UPDATE_TILE", {x: tile.x, y: tile.y});
    }
  }

  static buyItem(id)
  {
    var tileItemInfo = GameLogic.gameData.tileItems[id];

    var item = {id: id, uniqueid: this.userData.totalItems, data: {rotation: 0}};

    this.userData.inventory.push(item);

    this.userData.totalItems++;
  }

  static canItemBePlaced(item, x, y)
  {
    var canPlace = true;

    var tilesOcupped = this.getTilesItemOcuppes(item.id, item.data.rotation, x, y);

    for (var tile of tilesOcupped) {

      var tile = this.userData.tiles[`${tile[0]}:${tile[1]}`];

      if(!tile) {
        canPlace = false;
      }
    }

    return canPlace;
  }

  static getRotationData(rotation)
  {
    return this.rotationData[rotation];
  }

  static getTilesItemOcuppes(id, rotation, originx, originy)
  {
    originx = originx || 0;
    originy = originy || 0;

    var tiles = [];

    var tileItemInfo = GameLogic.gameData.tileItems[id];

    var usingRotation = this.getRotationData(rotation);

    var flipcoords = usingRotation.flipcoords;
    var invertx = usingRotation.invertx;
    var inverty = usingRotation.inverty;

    var size = [
      tileItemInfo.size[flipcoords ? 1 : 0],
      tileItemInfo.size[flipcoords ? 0 : 1]
    ];

    var canPlace = true;

    for (var y = 0; y < size[1]; y++) {
      for (var x = 0; x < size[0]; x++) {

        var newx = -size[0]+1 + x;
        var newy = -size[1]+1 + y;

        var kx = invertx ? newx : x;
        var ky = inverty ? newy : y;

        tiles.push([kx, ky, flipcoords ? y : x, flipcoords ? x : y])
      }
    }

    for (var tile of tiles) {
      tile[0] += originx;
      tile[1] += originy;
    }

    return tiles
  }

  static createDefaultItem(id)
  {
    var item = {id: id, uniqueid: this.userData.totalItems, data: {rotation: 0}};

    this.userData.totalItems++;

    return item;
  }

  static createCooker(id)
  {
    var item = this.createDefaultItem(id);
    item.data.cooking = 999;
    return item;
  }

  static createFloor(id)
  {
    var item = this.createDefaultItem(id);
    item.data.justAFloor = true;
    return item;
  }

  static createWall(id)
  {
    var item = this.createDefaultItem(id);
    item.data.isAWall = true;
    return item;
  }

  static placeItem(item, x, y)
  {
    //item.data.rotation = 0;

    console.log("place item", item)

    var canPlace = this.canItemBePlaced(item, x, y);

    if(canPlace)
    {
      this.userData.tiles[`${x}:${y}`].objects.push(item);
      Events.trigger("UPDATE_TILE", {x: x, y: y});
    } else {
      console.log("cannot place item")
    }
  }
}
