TILE_ITEM_TYPE = {
  FLOOR: 0,
  COOKER: 1,
  TABLE: 2,
  CHAIR: 3,
  WALL: 4,
  WALL_OBJECT: 5,
  DOOR: 6,
  FLOOR_OBJECT: 7
}

TILE_ITEM = {
  FLOOR_0: 0,
  FLOOR_1: 1,
  COOKER_0: 2,
  WALL_0: 3
}

//front   [+extra images]
//
//
//

//front
//
//back
//

//front
//back
//front_flipped
//back_flipped

//~~ index
//front 0 = 0
//front 1 = 1
//back 0 = 2
//back 1 = 3
//front_flipped 0 = 4
//front_flipped 1 = 5


class TileItem {
  constructor(data)
  {
    console.log(data)

    this.id = data.id;
    this.uniqueid = data.uniqueid;
    this.data = data.data;
    this.type = Game.data.tileItems[this.id].type;
    this.parts = [];
  }

  destroySprites()
  {
    for (var part of this.parts) { part.sprite.destroy(); }
    this.parts = [];

    //this.moveSprite.destroy();
  }

  setRotation(rotation)
  {
    this.data.rotation = rotation;

    this.destroySprites();
    this.createSprites();
    this.createMoveSprite();

    if(this.placedAtTile)
    {
      this.placedAtTile.placeItem(this);
    }
  }

  createSprites()
  {
    var tileItemData = Game.data.tileItems[this.id];
    var ocuppedTiles = GameLogic.getTilesItemOcuppes(this.id, this.data.rotation);
    var renderTile = SceneRenderTileItem.tiles[this.id];
    var usingRotation = GameLogic.getRotationData(this.data.rotation);

    for (var t of ocuppedTiles) {
      var textures = [];

      for (var i = 0; i < tileItemData.images; i++) {
        var name = `${usingRotation.k}_${i}_${t[2]}:${t[3]}`;
        var index = renderTile.textures_index[name];
        textures.push(renderTile.textures[index]);
      }

      var sprite = new PIXI.AnimatedSprite(textures);
      sprite.gotoAndPlay(0);
      sprite.animationSpeed = 0.05;
      sprite.pivot.set(TileMap.tileSize.width/2, sprite.height-TileMap.tileSize.height/2);
      sprite.scale.x = usingRotation.flipcoords ? -1 : 1;

      this.parts.push({
        t: t,
        sprite: sprite
      });
    }
  }

  createMoveSprite()
  {
    return

    var moveContainer = new PIXI.Container();

    for (var part of this.parts) {
      var sprite = part.sprite;

      var pos = TileMap.getTilePosition(part.t[0], part.t[1]);

      sprite.x = pos.x;
      sprite.y = pos.y;

      moveContainer.addChild(part.sprite);
    }

    var tex = Game.app.renderer.generateTexture(moveContainer); // container with all your sprites as children
    this.moveSprite = new PIXI.Sprite(tex);

    for (var part of this.parts) {
      moveContainer.removeChild(part.sprite);
      part.sprite.position.set(0, 0);
    }
    moveContainer.destroy();

    SceneTileMap.viewport.container.addChild(this.moveSprite);

    this.moveSprite.alpha = 0.5;
  }



  create()
  {
    var tileItemData = Game.data.tileItems[this.id];
    var ocuppedTiles = GameLogic.getTilesItemOcuppes(this._object);
    var renderTile = SceneRenderTileItem.tiles[this.id];
    var usingRotation = GameLogic.getRotationData(this.data.rotation);

    var moveContainer = new PIXI.Container();

    for (var t of ocuppedTiles) {

      var textures = [];

      for (var i = 0; i < tileItemData.images; i++) {

        var name = `${usingRotation.k}_${i}_${t[2]}:${t[3]}`;

        var index = renderTile.textures_index[name];

        textures.push(renderTile.textures[index]);
      }



      var atTile = [this.tile.mapPos.x + t[0], this.tile.mapPos.y + t[1]]
      atTile = TileMap.tiles[`${atTile[0]}:${atTile[1]}`]

      var pos = TileMap.getTilePosition(t[0], t[1]);

      var sprite = new PIXI.AnimatedSprite(textures);
      sprite.x = pos.x;
      sprite.y = pos.y;
      sprite.gotoAndStop(0);
      sprite.pivot.set(TileMap.tileSize.width/2, sprite.height-TileMap.tileSize.height/2);
      sprite.scale.x = usingRotation.flipcoords ? -1 : 1;
      moveContainer.addChild(sprite);

      this.parts.push({tile: atTile, sprite: sprite});

      //ObjectOrigin.show(sprite, `sprite`);
    }

    //var tex = Game.app.renderer.generateTexture(moveContainer); // container with all your sprites as children
    //this.moveSprite = new PIXI.Sprite(tex);

    moveContainer.destroy();

    for (var part of this.parts) {
      part.sprite.x = 0;
      part.sprite.y = 0;
      part.sprite.animationSpeed = 0.05;
      part.sprite.gotoAndPlay(0);
      part.tile.topFloor.container.addChild(part.sprite);
    }

    //Game.app.stage.addChild(this.moveSprite);

  }

  destroy()
  {
    for (var part of this.parts) {
      part.tile.topFloor.container.removeChild(part.sprite);
      part.sprite.destroy()
    }
    //this.moveSprite.destroy();
  }
}

class TileItemCooker extends TileItem {
  constructor(data)
  {
    super(data);
  }
}

class TileItemFloor extends TileItem {
  constructor(data)
  {
    super(data);
  }
}

class TileItemWall extends TileItem {
  constructor(data)
  {
    super(data);
  }
}
