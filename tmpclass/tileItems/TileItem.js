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
  WALL_0: 3,
  CHAIR_0: 4
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

class TileHitbox
{
  static addx(point, amount)
  {
    var w = TileMap.tileSize.width/2;
    var h = TileMap.tileSize.height/2;
    var hp = Math.sqrt(w*w + h*h);

    point[0] += amount*w/hp
    point[1] += amount*h/hp
  }

  static addy(point, amount)
  {
    var w = TileMap.tileSize.width/2;
    var h = TileMap.tileSize.height/2;
    var hp = Math.sqrt(w*w + h*h);

    point[0] += -amount*w/hp
    point[1] += amount*h/hp
  }

  static createBoxHitbox(offsetx, offsety, translate, height)
  {
    var point0 = [TileMap.tileSize.width/2, 0];
    var point1 = [TileMap.tileSize.width, TileMap.tileSize.height/2]
    var point2 = [TileMap.tileSize.width/2, TileMap.tileSize.height]
    var point3 = [0, TileMap.tileSize.height/2]

    this.addx(point1, -offsetx[1]);
    this.addx(point2, -offsetx[1]);

    this.addx(point3, offsetx[0]);
    this.addx(point0, offsetx[0]);

    this.addy(point0, offsety[0]);
    this.addy(point1, offsety[0]);

    this.addy(point2, -offsety[1]);
    this.addy(point3, -offsety[1]);


    this.addx(point0, translate[0]);
    this.addx(point1, translate[0]);
    this.addx(point2, translate[0]);
    this.addx(point3, translate[0]);

    this.addy(point0, translate[1]);
    this.addy(point1, translate[1]);
    this.addy(point2, translate[1]);
    this.addy(point3, translate[1]);

    var pts = [
      point0[0], point0[1]-height,
      point1[0], point1[1]-height,
      point1[0], point1[1],
      point2[0], point2[1],
      point3[0], point3[1],
      point3[0], point3[1]-height,
    ];

    this.hitbox = new PIXI.Graphics();
    this.hitbox.beginFill(0xffffff);
    this.hitbox.drawPolygon(pts);
    this.hitbox.endFill();
    this.hitbox.tint = 0xFF0000;

    return this.hitbox;
  }

  static createWallHitbox(offsetx, offsety, translate, height)
  {

    var point0 = [TileMap.tileSize.width/2, 0]; //right bottom
    var point1 = [TileMap.tileSize.width/2, -TileMap.tileSize.height*2.5] //right top
    var point2 = [0, -TileMap.tileSize.height*2.5 + TileMap.tileSize.height/2] //left top
    var point3 = [0, TileMap.tileSize.height/2] //left bottom


    this.addy(point0, offsetx[1]);
    this.addy(point1, offsetx[1]);

    this.addy(point2, -offsetx[0]);
    this.addy(point3, -offsetx[0]);

    this.addx(point1, offsety[0]);
    this.addy(point1, offsety[0]);
    this.addx(point2, offsety[0]);
    this.addy(point2, offsety[0]);

    this.addx(point3, -offsety[1]);
    this.addy(point3, -offsety[1]);
    this.addx(point0, -offsety[1]);
    this.addy(point0, -offsety[1]);

    //this.addy(point1, TileMap.tileSize.height*2);

    var pts = [
      point0[0], point0[1]-height,
      point1[0], point1[1]-height,
      point2[0], point2[1]-height,
      point3[0], point3[1]-height,
    ];

    this.hitbox = new PIXI.Graphics();
    this.hitbox.beginFill(0xffffff);
    this.hitbox.drawPolygon(pts);
    this.hitbox.endFill();
    this.hitbox.tint = 0xFF0000;

    return this.hitbox;
  }
}


class TileItem {
  constructor(data)
  {
    this.setData(data);
    this.parts = [];
  }

  setData(data)
  {
    console.log(data)
    this.id = data.id;
    this.uniqueid = data.uniqueid;
    this.data = data.data;
    this.type = Game.data.tileItems[data.id].type;
  }

  update(delta)
  {

  }

  onMouseOver(event)
  {
    console.log("onMouseOver")
    //this.hitbox.alpha = 0.5;
  }

  onMouseOut(event)
  {
    console.log("onMouseOut")
    //this.hitbox.alpha = 0;
  }

  setRotation(rotation)
  {
    var atTile = this.placedAtTile;
    this.data.rotation = rotation;

    this.destroy();

    this.createSprites();

    if(atTile)
    {
      atTile.removeItem(this.uniqueid);
      atTile.placeItem(this);
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


      var spriteContainer = new PIXI.Container();

      var sprite;

      spriteContainer.scale.x = usingRotation.flipcoords ? -1 : 1;



      if(this.type == TILE_ITEM_TYPE.CHAIR)
      {


        sprite = new PIXI.AnimatedSprite([textures[0]]);


        this.sprite_topchair = new PIXI.AnimatedSprite([textures[1]]);
        this.sprite_topchair.pivot.set(TileMap.tileSize.width/2, sprite.height-TileMap.tileSize.height/2);
        this.sprite_topchair.scale.x = usingRotation.flipcoords ? -1 : 1;
      } else {
        sprite = new PIXI.AnimatedSprite(textures);
      }

      sprite.gotoAndPlay(0);
      sprite.animationSpeed = 0.05;
      sprite.pivot.set(TileMap.tileSize.width/2, sprite.height-TileMap.tileSize.height/2);



      if(this.type == TILE_ITEM_TYPE.WALL)
      {
        var back = new PIXI.Sprite(Game.resources["wallback"].texture);
        back.pivot.set((back.width-sprite.width) + TileMap.tileSize.width/2, back.height-TileMap.tileSize.height/2);
        spriteContainer.addChild(back);


      }


      spriteContainer.addChild(sprite);

      var extremeLeft = t[2] == 0;
      var extremeRight = t[2] == tileItemData.size[0]-1;
      var extremeTop = t[3] == 0;
      var extremeBottom = t[3] == tileItemData.size[1]-1;

      var p1 = [extremeLeft ? tileItemData.hitbox.x : 0, extremeRight ? tileItemData.hitbox.x : 0];
      var p2 = [extremeTop ? tileItemData.hitbox.y : 0, extremeBottom ? tileItemData.hitbox.y : 0];

      var hitbox;

      if(this.type == TILE_ITEM_TYPE.WALL)
      {
        hitbox = TileHitbox.createWallHitbox(
          usingRotation.flipcoords ? p2 : p1,
          usingRotation.flipcoords ? p1 : p2,
          [0, 0], tileItemData.hitbox.z
        );

        hitbox.scale.x = usingRotation.flipcoords ? -1 : 1;
      } else {
        hitbox = TileHitbox.createBoxHitbox(
          usingRotation.flipcoords ? p2 : p1,
          usingRotation.flipcoords ? p1 : p2,
          [0, 0], tileItemData.hitbox.z
        );
      }

      hitbox.alpha = 0.0;
      hitbox.interactive = true;
      hitbox.buttonMode = true;
      hitbox.pivot.set(TileMap.tileSize.width/2, TileMap.tileSize.height/2);

      hitbox.on('mouseover', this.onMouseOverHitbox.bind(this));
      hitbox.on('mouseout', this.onMouseOutHitbox.bind(this));

      //spriteContainer.addChild(hitbox);

      this.parts.push({
        t: t,
        container: spriteContainer,
        sprite: sprite,
        hitbox: hitbox
      });
    }

    if(this.data.door != undefined)
    {
      this.createDoor();


    }

    //this.createMoveSprite();
    //this.createHitbox(tileItemData.hitbox.z, tileItemData.hitbox.x, tileItemData.hitbox.y);
  }

  onMouseOverHitbox()
  {
    for (var part of this.parts) {
      part.container.alpha = 0.2;
    }
  }

  onMouseOutHitbox()
  {
    for (var part of this.parts) {
      part.container.alpha = 1;
    }
  }

  createMoveSprite()
  {
    return
    var tex = Game.app.renderer.generateTexture(moveContainer); // container with all your sprites as children
    this.moveSprite = new PIXI.Sprite(tex);
  }

  destroy()
  {
    if(this.sprite_topchair)
    {
      this.sprite_topchair.destroy();
    }

    for (var part of this.parts) {
      console.log(this.parts)

      part.hitbox.destroy();
      part.sprite.destroy();
      part.container.destroy();

      if(this.placedAtTile)
      {
        //part.container.
        //this.placedAtTile.topFloor.container.removeChild(part.sprite)
        //part.container.destroy();
      }

      //part.sprite.destroy();
    }

    this.parts = [];

    //if(this.placedAtTile)
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

class TileItemChair extends TileItem {
  constructor(data)
  {
    super(data);
  }
}

class TileItemWall extends TileItem {
  constructor(data)
  {
    super(data);

    this.targetDoorRotation = -0.46;
    this.isDoorOpen = false;
    this.hasDoor = false;
    this.doorDirection = 0;
    this.doors = [];
  }

  createDoorHole()
  {

  }

  createDoor()
  {
    this.hasDoor = true;

    this.doors = [];

    for (var part of this.parts) {

      var sprite = part.sprite;

      if(!part.wallMask)
      {
        var wallMask;
        wallMask = new PIXI.Graphics();
        wallMask.beginFill(0xFFFFFF);
        wallMask.moveTo(0, 0);
        wallMask.lineTo(140, 0);
        wallMask.lineTo(140, 65);
        wallMask.lineTo(0, 135);
        wallMask.pivot.set(TileMap.tileSize.width/2, sprite.height-TileMap.tileSize.height/2);

        part.wallMask = wallMask;
      }



      var door = new PIXI.projection.Sprite2d(PIXI.Texture.from('/assets/images/door.png'));
      door.anchor.set(1, 1);
      door.position.set(0, -TileMap.tileSize.height/2);
      door.proj.affine = PIXI.projection.AFFINE.AXIS_X;
      door.rotation = -0.46

      part.container.addChild(door);
      part.container.addChild(part.wallMask);

      sprite.mask = part.wallMask;

      this.doors.push(door);
    }
  }

  openDoor()
  {
    for (var door of this.doors) {
      this.targetDoorRotation = this.doorDirection == 0 ? -2.8 : 0.6
    }
    this.isDoorOpen = true;
  }

  closeDoor()
  {
    for (var door of this.doors) {
      this.targetDoorRotation = -0.46
    }
    this.isDoorOpen = false;
  }

  setRotation(rotation)
  {
    super.setRotation(rotation);

    if(this.hasDoor)
    {
      //this.createDoor();
    }
  }

  flipDoorSide()
  {
    for (var door of this.doors) {
      door.scale.x = -1
      door.position.x = -TileMap.tileSize.width/2;
      door.position.y = 0;
      this.doorDirection = 1;
    }
  }

  update(delta)
  {
    super.update(delta);

    for (var door of this.doors) {
      door.scale.y = 1/Game.strechScale; //fixing dump issue
      door.rotation = Math.lerp(door.rotation, this.targetDoorRotation, 0.1);
    }
  }
}
