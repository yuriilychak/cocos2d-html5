/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var TAG_TILE_MAP = 1;
var tileTestSceneIdx = -1;
//------------------------------------------------------------------
//
// TileDemo
//
//------------------------------------------------------------------

var TileDemo = class TileDemo extends BaseTestLayer {
    constructor() {
        super();

        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: function (touches, event) {
                    var touch = touches[0];
                    var delta = touch.getDelta();

                    var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                    node.x += delta.x;
                    node.y += delta.y;
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
                        var node = event.getCurrentTarget().getChildByTag(TAG_TILE_MAP);
                        node.x += event.getDeltaX();
                        node.y += event.getDeltaY();
                    }
                }
            }, this);
    }
    title() {
        return "No title";
    }
    subtitle() {
        return "drag the screen";
    }

    onRestartCallback(sender) {
        var s = new TileMapTestScene();
        s.addChild(restartTileMapTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new TileMapTestScene();
        s.addChild(nextTileMapTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new TileMapTestScene();
        s.addChild(previousTileMapTest());
        director.runScene(s);
    }
    // automation
    numberOfPendingTests() {
        return ( (arrayOfTileMapTest.length - 1) - tileTestSceneIdx );
    }
    getTestNumber() {
        return tileTestSceneIdx;
    }

};

/******************for vertexz bug**************/
// FixBugBaseTest: cc.Layer with BaseTestLayer methods mixed in
var FixBugBaseTest = class FixBugBaseTest extends cc.Layer {};
// Copy BaseTestLayer prototype methods (mixin pattern, originally cc.Layer.extend(BaseTestLayerProps))
Object.getOwnPropertyNames(BaseTestLayer.prototype).forEach(function(name) {
    if (name !== 'constructor' && typeof BaseTestLayer.prototype[name] === 'function') {
        FixBugBaseTest.prototype[name] = BaseTestLayer.prototype[name];
    }
});

// TMXFixBugLayer: FixBugBaseTest with TileDemo methods mixed in
var TMXFixBugLayer = class TMXFixBugLayer extends FixBugBaseTest {};
Object.getOwnPropertyNames(TileDemo.prototype).forEach(function(name) {
    if (name !== 'constructor' && typeof TileDemo.prototype[name] === 'function') {
        TMXFixBugLayer.prototype[name] = TileDemo.prototype[name];
    }
});
/***********************************************************/

var TileMapTest = class TileMapTest extends TileDemo {
    constructor() {
        super();
        var map = new cc.TileMapAtlas(s_tilesPng, s_levelMapTga, 16, 16);
        if ("opengl" in cc.sys.capabilities)
            map.texture.setAntiAliasTexParameters();

        this.log("ContentSize: " + map.width + " " + map.height);

        map.releaseMap();

        this.addChild(map, 0, TAG_TILE_MAP);

        map.anchorX = 0;
        map.anchorY = 0.5;

        var scale = new cc.ScaleBy(4, 0.8);
        var scaleBack = scale.reverse();

        var seq = cc.sequence(scale, scaleBack);

        map.runAction(seq.repeatForever());
    }
    title() {
        return "TileMapAtlas";
    }

};

var TileMapEditTest = class TileMapEditTest extends TileDemo {
    constructor() {
        super();
        var map = new cc.TileMapAtlas(s_tilesPng, s_levelMapTga, 16, 16);
        // Create an Aliased Atlas
        map.texture.setAliasTexParameters();
        this.log("ContentSize: " + map.width + " " + map.height);

        // If you are not going to use the Map, you can free it now
        // [tilemap releaseMap);
        // And if you are going to use, it you can access the data with:

        this.schedule(this.updateMap, 0.2);//:@selector(updateMap:) interval:0.2f);

        this.addChild(map, 0, TAG_TILE_MAP);

        map.anchorX = 0;
        map.anchorY = 0;
        map.x = -20;
        map.y = -200;

    }
    title() {
        return "Editable TileMapAtlas";
    }
    updateMap(dt) {
        // IMPORTANT
        //   The only limitation is that you cannot change an empty, or assign an empty tile to a tile
        //   The value 0 not rendered so don't assign or change a tile with value 0

        var tilemap = this.getChildByTag(TAG_TILE_MAP);

        // NEW since v0.7
        var c = tilemap.getTileAt(new cc.Point(13, 21));
        c.r++;
        c.r %= 50;
        if (c.r == 0)
            c.r = 1;

        // NEW since v0.7
        tilemap.setTile(c, new cc.Point(13, 21));
    }

};

//------------------------------------------------------------------
//
// TMXOrthoTest
//
//------------------------------------------------------------------
var TMXOrthoTest = class TMXOrthoTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 2.1;

        this.pixel1 = {"0":218, "1":218, "2":208, "3":255};

        this.pixel2 = {"0":193, "1":143, "2":72, "3":255};

        this.pixel3 = {"0":200, "1":15, "2":160, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test1.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.runAction(new cc.ScaleBy(2, 0.5));
    }
    title() {
        return "TMX Ortho test";
    }

    // Automation
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(82, 114, 10, 10);
        var ret2 = this.readPixels(475, 100, 10, 10);
        var ret3 = this.readPixels(312, 196, 10, 10);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel3, true,5) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoTest2
//
//------------------------------------------------------------------
var TMXOrthoTest2 = class TMXOrthoTest2 extends TileDemo {
    constructor() {
        super();

        this.pixel1 = {"0":192, "1":144, "2":16, "3":255};

        this.pixel2 = {"0":255, "1":255, "2":255, "3":255};

        this.pixel3 = {"0":40, "1":0, "2":0, "3":255};
        //
        // Test orthogonal with 3d camera and anti-alias textures
        //
        // it should not flicker. No artifacts should appear
        //
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test2.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);
    }
    title() {
        return "TMX Orthogonal test 2";
    }

    // Automation
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(99, 142, 5, 5);
        var ret2 = this.readPixels(238, 270, 5, 5);
        var ret3 = this.readPixels(419, 239, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};


//------------------------------------------------------------------
//
// TMXOrthoTest3
//
//------------------------------------------------------------------
var TMXOrthoTest3 = class TMXOrthoTest3 extends TileDemo {
    constructor() {
        super();

        this.pixel1 = {"0":247, "1":196, "2":131, "3":255};

        this.pixel2 = {"0":0, "1":0, "2":0, "3":255};

        this.pixel3 = {"0":0, "1":0, "2":0, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test3.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.scale = 0.2;
        map.anchorX = 0.5;
        map.anchorY = 0.5;
    }
    title() {
        return "TMX anchorPoint test";
    }

    // Automation
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(0, 0, 10, 10);
        var ret2 = this.readPixels(107, 58, 10, 10);
        var ret3 = this.readPixels(58, 107, 10, 10);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoTest4
//
//------------------------------------------------------------------
var TMXOrthoTest4 = class TMXOrthoTest4 extends TileDemo {
    constructor() {
        super();

        this.testDuration = 3;

        this.testLayerSize = null;

        this.pixel = {"0":0, "1":0, "2":0, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test4.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.anchorX = 0;
        map.anchorY = 0;

        var layer = map.getLayer("Layer 0");
        var s = layer.getLayerSize();

        this.tx = s.width - 10;
        this.ty = s.height - 1;

        var sprite;
        sprite = layer.getTileAt(new cc.Point(0, 0));
        sprite.scale = 2;

        sprite = layer.getTileAt(new cc.Point(s.width - 1, 0));
        sprite.scale = 2;

        sprite = layer.getTileAt(new cc.Point(0, s.height - 1));
        sprite.scale = 2;

        sprite = layer.getTileAt(new cc.Point(s.width - 1, s.height - 1));
        sprite.scale = 2;

        this.scheduleOnce(this.onRemoveSprite, 0.2);
    }
    onRemoveSprite(dt) {
        var map = this.getChildByTag(TAG_TILE_MAP);

        var layer = map.getLayer("Layer 0");
        var layerSize = layer.getLayerSize();

        var sprite = layer.getTileAt(new cc.Point(layerSize.width - 1, 0));
        layer.removeChild(sprite, true);

        this.testLayerSize = layerSize;
    }
    title() {
        return "TMX width/height test";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"width":14, "height":8, "pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(433, 240, 10, 10);
        var ret = {"width":this.testLayerSize.width, "height":this.testLayerSize.height, "pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};


//------------------------------------------------------------------
//
// TMXReadWriteTest
//
//------------------------------------------------------------------
var TMXReadWriteTest = class TMXReadWriteTest extends TileDemo {
    constructor() {
        super();

        this.gid = 0;

        this.testDuration = 2.2;

        this.pixel1 = {"0":0, "1":144, "2":0, "3":255};

        this.pixel2 = {"0":192, "1":144, "2":16, "3":255};

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test2.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        var layer = map.getLayer("Layer 0");
        if ("opengl" in cc.sys.capabilities)
            layer.texture.setAntiAliasTexParameters();

        map.scale = 1;

        var tile0 = layer.getTileAt(new cc.Point(1, 63));
        var tile1 = layer.getTileAt(new cc.Point(2, 63));
        var tile2 = layer.getTileAt(new cc.Point(3, 62));//new cc.Point(1,62));
        var tile3 = layer.getTileAt(new cc.Point(2, 62));

        tile0.anchorX = 0.5;
        tile0.anchorY = 0.5;
        tile1.anchorX = 0.5;
        tile1.anchorY = 0.5;
        tile2.anchorX = 0.5;
        tile2.anchorY = 0.5;
        tile3.anchorX = 0.5;
        tile3.anchorY = 0.5;

        var move = new cc.MoveBy(0.5, new cc.Point(0, 160));
        var rotate = new cc.RotateBy(2, 360);
        var scale = new cc.ScaleBy(2, 5);
        var opacity = new cc.FadeOut(2);
        var fadein = new cc.FadeIn(2);
        var scaleback = new cc.ScaleTo(1, 1);
        var finish = new cc.CallFunc(this.onRemoveSprite);   // 'this' is optional. Since it is not used, it is not passed.

        var seq0 = cc.sequence(move, rotate, scale, opacity, fadein, scaleback, finish);

        tile0.runAction(seq0);
        tile1.runAction(seq0.clone());
        tile2.runAction(seq0.clone());
        tile3.runAction(seq0.clone());

        this.gid = layer.getTileGIDAt(new cc.Point(0, 63));

        this.schedule(this.updateCol, 2.0);
        this.schedule(this.repaintWithGID, 2.0);
        this.schedule(this.removeTiles, 1.0);

        this.gid2 = 0;
    }
    onRemoveSprite(sender) {
        var p = sender.parent;
        if (p) {
            p.removeChild(sender, true);
        }
    }
    updateCol(dt) {
        var map = this.getChildByTag(TAG_TILE_MAP);
        var layer = map.getChildByTag(0);

        var s = layer.getLayerSize();

        for (var y = 0; y < s.height; y++) {
            layer.setTileGID(this.gid2, new cc.Point(3, y));
        }

        this.gid2 = (this.gid2 + 1) % 80;
    }
    repaintWithGID(dt) {

        var map = this.getChildByTag(TAG_TILE_MAP);
        var layer = map.getChildByTag(0);

        var s = layer.getLayerSize();
        for (var x = 0; x < s.width; x++) {
            var y = s.height - 1;
            var tmpgid = layer.getTileGIDAt(new cc.Point(x, y));
            layer.setTileGID(tmpgid + 1, new cc.Point(x, y));
        }
    }
    removeTiles(dt) {
        this.unschedule(this.removeTiles);

        var map = this.getChildByTag(TAG_TILE_MAP);

        var layer = map.getChildByTag(0);
        var s = layer.getLayerSize();

        for (var y = 0; y < s.height; y++) {
            layer.removeTileAt(new cc.Point(5.0, y));
        }
    }
    title() {
        return "TMX Read/Write test";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(168, 203, 5, 5);
        var ret2 = this.readPixels(239, 239, 5, 5);
        var ret = {"pixel1":!this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXHexTest
//
//------------------------------------------------------------------
var TMXHexTest = class TMXHexTest extends TileDemo {
    constructor() {
        super();

        this.pixel1 = {"0":250, "1":202, "2":73, "3":255};

        this.pixel2 = {"0":150, "1":219, "2":10, "3":255};
        var color = new cc.LayerColor(new cc.Color(64, 64, 64, 255));
        this.addChild(color, -1);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/hexa-test.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);
    }
    title() {
        return "TMX Hex test";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(438, 226, 10, 10);
        var ret2 = this.readPixels(195, 0, 10, 10);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoTest
//
//------------------------------------------------------------------
var TMXIsoTest = class TMXIsoTest extends TileDemo {
    constructor() {
        super();

        this.pixel = {"0":0, "1":0, "2":0, "3":255};
        var color = new cc.LayerColor(new cc.Color(64, 64, 64, 255));
        this.addChild(color, -1);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        // move map to the center of the screen
        var ms = map.getMapSize();
        var ts = map.getTileSize();
        // map.setPosition(-ms.width * ts.width / 2, -ms.height * ts.height / 2);
        map.runAction(new cc.MoveTo(1.0, new cc.Point(-ms.width * ts.width / 2, -ms.height * ts.height / 2)));
    }
    title() {
        return "TMX Isometric test 0";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = true;
        for (var i = 0; i < 6; i++) {
            var item = this.readPixels(438, 226, 3, 3);
            if (!this.containsPixel(item, this.pixel, false)) {
                ret1 = false;
            }
        }
        var ret = { "pixel":ret1 == true ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoTest1
//
//------------------------------------------------------------------
var TMXIsoTest1 = class TMXIsoTest1 extends TileDemo {
    constructor() {
        super();

        this.pixel = {"0":0, "1":0, "2":0, "3":255};
        var color = new cc.LayerColor(new cc.Color(64, 64, 64, 255));
        this.addChild(color, -1);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test1.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.anchorX = 0.5;
        map.anchorY = 0.5;
    }
    title() {
        return "TMX Isometric test + anchorPoint";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = true;
        for (var i = 0; i < 6; i++) {
            var item = this.readPixels(438, 226, 3, 3);
            if (!this.containsPixel(item, this.pixel, false)) {
                ret1 = false;
            }
        }
        var ret = { "pixel":ret1 == true ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoTest2
//
//------------------------------------------------------------------
var TMXIsoTest2 = class TMXIsoTest2 extends TileDemo {
    constructor() {
        super();

        this.testDuration = 1.2;

        this.pixel = {"0":0, "1":0, "2":0, "3":255};
        var color = new cc.LayerColor(new cc.Color(64, 64, 64, 255));
        this.addChild(color, -1);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test2.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        // move map to the center of the screen
        var ms = map.getMapSize();
        var ts = map.getTileSize();
        map.runAction(new cc.MoveTo(1.0, new cc.Point(-ms.width * ts.width / 2, -ms.height * ts.height / 2)));
    }
    title() {
        return "TMX Isometric test 2";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = true;
        for (var i = 1; i < 6; i++) {
            var item = this.readPixels(62 * i, 191, 5, 5);
            if (!this.containsPixel(item, this.pixel, true, 2)) {
                ret1 = false;
            }
        }
        var ret = { "pixel":ret1 == true ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXUncompressedTest
//
//------------------------------------------------------------------
var TMXUncompressedTest = class TMXUncompressedTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 1.2;

        this.pixel = {"0":0, "1":0, "2":0, "3":255};
        var color = new cc.LayerColor(new cc.Color(64, 64, 64, 255));
        this.addChild(color, -1);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test2-uncompressed.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        // move map to the center of the screen
        var ms = map.getMapSize();
        var ts = map.getTileSize();
        map.runAction(new cc.MoveTo(1.0, new cc.Point(-ms.width * ts.width / 2, -ms.height * ts.height / 2)));

        // testing release map
        var childrenArray = map.children;
        var layer = null;
        for (var i = 0, len = childrenArray.length; i < len; i++) {
            layer = childrenArray[i];
            if (!layer)
                break;

            layer.releaseMap();
        }
    }
    title() {
        return "TMX Uncompressed test";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = true;
        for (var i = 1; i < 6; i++) {
            var item = this.readPixels(62 * i, 191, 5, 5);
            if (!this.containsPixel(item, this.pixel, true, 2)) {
                ret1 = false;
            }
        }
        var ret = { "pixel":ret1 == true ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXTilesetTest
//
//------------------------------------------------------------------
var TMXTilesetTest = class TMXTilesetTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 1;

        this.pixel1 = {"0":255, "1":0, "2":0, "3":255};

        this.pixel2 = {"0":213, "1":202, "2":190, "3":255};

        this.pixel3 = {"0":61, "1":118, "2":71, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test5.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        if ("opengl" in cc.sys.capabilities) {
            var layer;
            layer = map.getLayer("Layer 0");
            layer.texture.setAntiAliasTexParameters();

            layer = map.getLayer("Layer 1");
            layer.texture.setAntiAliasTexParameters();

            layer = map.getLayer("Layer 2");
            layer.texture.setAntiAliasTexParameters();
        }
    }
    title() {
        return "TMX Tileset test";
    }
    // Automation
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(53, 80, 5, 5);
        var ret2 = this.readPixels(38, 151, 5, 5);
        var ret3 = this.readPixels(345, 202, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoObjectsTest
//
//------------------------------------------------------------------
var TMXOrthoObjectsTest = class TMXOrthoObjectsTest extends TileDemo {
    constructor() {
        super();

        this.testObjects = null;
        var drawNode = new cc.DrawNode();
        drawNode.setLineWidth(3);
        drawNode.setDrawColor(new cc.Color(255,255,255,255));

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/ortho-objects.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        var group = map.getObjectGroup("Object Group 1");
        var array = group.getObjects();
        var dict;

        for (var i = 0, len = array.length; i < len; i++) {
            dict = array[i];
            if (!dict)
                break;
            for (var k in dict) {
                this.log(k + ' = ' + dict[k]);
            }

            var x = dict["x"], y = dict["y"];
            var width = dict["width"], height = dict["height"];

            drawNode.drawSegment(new cc.Point(x, y), new cc.Point((x + width), y));
            drawNode.drawSegment(new cc.Point((x + width), y), new cc.Point((x + width), (y + height)));
            drawNode.drawSegment(new cc.Point((x + width), (y + height)), new cc.Point(x, (y + height)));
            drawNode.drawSegment(new cc.Point(x, (y + height)), new cc.Point(x, y));
        }
        map.addChild(drawNode);
        //Automation parameters
        this.testObjects = array;
    }
    onEnter() {
        super.onEnter();
        this.anchorX = 0;
        this.anchorY = 0;
    }
    title() {
        return "TMX Ortho object test";
    }
    subtitle() {
        return "You should see a white box around the 3 platforms";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = [];
        ret.push({"name":"Object", "type":"", "x":0, "y":0, "width":352, "height":32});
        ret.push({"name":"Object", "type":"", "x":224, "y":64, "width":160, "height":32 });
        ret.push({"name":"platform", "type":"platform", "x":2, "y":131, "width":125, "height":60});
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [];
        var obj = null;
        for (var i = 0; i < this.testObjects.length; i++) {
            obj = this.testObjects[i];
            ret.push({"name":obj["name"] || "", "type":obj["type"] || "", "x":parseFloat(obj["x"]), "y":parseFloat(obj["y"]), "width":parseFloat(obj["width"]), "height":parseFloat(obj["height"])});
        }
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoObjectsTest
//
//------------------------------------------------------------------
var TMXIsoObjectsTest = class TMXIsoObjectsTest extends TileDemo {
    constructor() {
        super();

        this.testObjects = null;

        var drawNode = new cc.DrawNode();
        drawNode.setLineWidth(3);
        drawNode.setDrawColor(new cc.Color(255,255,255,255));
        this.addChild(drawNode);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test-objectgroup.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        var group = map.getObjectGroup("Object Group 1");
        var array = group.getObjects();
        var dict;
        for (var i = 0, len = array.length; i < len; i++) {
            dict = array[i];
            if (!dict)
                break;
            for (var k in dict) {
                this.log(k + ' = ' + dict[k]);
            }

            var x = dict["x"], y = dict["y"];
            var width = dict["width"], height = dict["height"];

            drawNode.drawSegment(new cc.Point(x, y), new cc.Point((x + width), y));
            drawNode.drawSegment(new cc.Point((x + width), y), new cc.Point((x + width), (y + height)));
            drawNode.drawSegment(new cc.Point((x + width), (y + height)), new cc.Point(x, (y + height)));
            drawNode.drawSegment(new cc.Point(x, (y + height)), new cc.Point(x, y));
        }

        //Automation parameters
        this.testObjects = array;
    }

    onEnter() {
        super.onEnter();
        this.anchorX = 0;
        this.anchorY = 0;
    }

    title() {
        return "TMX Iso object test";
    }
    subtitle() {
        return "You need to parse them manually. See bug #810";
    }

    //
    // Automation
    //
    getExpectedResult() {
        var ret = [];
        ret.push({"name":"platform 1", "type":"", "x":0, "y":0, "width":32, "height":30});
        ret.push({"name":"", "type":"", "x":0, "y":285, "width":31, "height":32});
        ret.push({"name":"", "type":"", "x":130, "y":129, "width":29, "height":29});
        ret.push({"name":"", "type":"", "x":290, "y":1, "width":28, "height":29});
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [];
        var obj = null;
        for (var i = 0; i < this.testObjects.length; i++) {
            obj = this.testObjects[i];
            ret.push({"name":obj["name"] || "", "type":obj["type"] || "", "x":parseFloat(obj["x"]), "y":parseFloat(obj["y"]), "width":parseFloat(obj["width"]), "height":parseFloat(obj["height"])});
        }
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXResizeTest
//
//------------------------------------------------------------------
var TMXResizeTest = class TMXResizeTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 0.25;

        this.pixel = {"0":169, "1":120, "2":76, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test5.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        var layer;
        layer = map.getLayer("Layer 0");

        var ls = layer.getLayerSize();
        for (var y = 0; y < ls.height; y++) {
            for (var x = 0; x < ls.width; x++) {
                layer.setTileGID(1, new cc.Point(x, y));
            }
        }
    }
    title() {
        return "TMX resize test";
    }
    subtitle() {
        return "Should not crash. Testing issue #740";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(156, 156, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoZorder
//
//------------------------------------------------------------------
var TMXIsoZorder = class TMXIsoZorder extends TileDemo {
    constructor() {
        super();

        this.tamara = null;

        this.testDuration = 5.2;

        this.pixel = {"0":255, "1":255, "2":255, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test-zorder.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.x = -map.width / 2;
        map.y = 0;

        this.tamara = new cc.Sprite(s_pathSister1);
        map.addChild(this.tamara, map.children.length);
        var mapWidth = map.getMapSize().width * map.getTileSize().width;
        this.tamara.x = mapWidth / 2;
        this.tamara.y = 0;
        this.tamara.anchorX = 0.5;
        this.tamara.anchorY = 0;

        var move = new cc.MoveBy(5, new cc.Point(300, 250));
        var back = move.reverse();
        var delay = new cc.DelayTime(0.5);
        var seq = cc.sequence(move, delay, back);
        this.tamara.runAction(seq.repeatForever());

        this.schedule(this.repositionSprite);
    }
    title() {
        return "TMX Iso Zorder";
    }
    subtitle() {
        return "Sprite should hide behind the trees";
    }
    onExit() {
        this.unschedule(this.repositionSprite);
        super.onExit();
    }
    repositionSprite(dt) {
        var map = this.getChildByTag(TAG_TILE_MAP);

        // there are only 4 layers. (grass and 3 trees layers)
        // if tamara < 48, z=4
        // if tamara < 96, z=3
        // if tamara < 144, z=2

        var newZ = 4 - Math.floor((this.tamara.y / 48));
        newZ = parseInt(Math.max(newZ, 0), 10);
        map.reorderChild(this.tamara, newZ);
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(223, 247, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoZorder
//
//------------------------------------------------------------------
var TMXOrthoZorder = class TMXOrthoZorder extends TileDemo {
    constructor() {
        super();

        this.tamara = null;

        this.testDuration = 2;

        this.pixel1 = {"0":117, "1":185, "2":63, "3":255};

        this.pixel2 = {"0":91, "1":55, "2":20, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test-zorder.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        this.tamara = new cc.Sprite(s_pathSister1);
        map.addChild(this.tamara, map.children.length, TAG_TILE_MAP);
        this.tamara.anchorX = 0.5;
        this.tamara.anchorY = 0;

        var move = new cc.MoveBy(5, cc.Point.mult(new cc.Point(400, 450), 0.58));
        var back = move.reverse();
        var seq = cc.sequence(move, back);
        this.tamara.runAction(seq.repeatForever());

        this.schedule(this.repositionSprite);
    }
    title() {
        return "TMX Ortho Zorder";
    }
    subtitle() {
        return "Sprite should hide behind the trees";
    }
    repositionSprite(dt) {
        var map = this.getChildByTag(TAG_TILE_MAP);

        // there are only 4 layers. (grass and 3 trees layers)
        // if tamara < 81, z=4
        // if tamara < 162, z=3
        // if tamara < 243,z=2

        // -10: customization for this particular sample
        var newZ = 4 - ((this.tamara.y - 10) / 81);
        newZ = Math.max(newZ, 0);

        map.reorderChild(this.tamara, newZ);
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(86, 131, 5, 5);
        var ret2 = this.readPixels(84, 200, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, true, 5) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoVertexZ
//
//------------------------------------------------------------------
var TMXIsoVertexZ = class TMXIsoVertexZ extends TMXFixBugLayer {
    constructor() {
        super();

        this.tamara = null;

        this.testDuration = 5.2;

        this.pixel = {"0":255, "1":255, "2":255, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test-vertexz.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.x = -map.width / 2;
        map.y = 0;

        // because I'm lazy, I'm reusing a tile as an sprite, but since this method uses vertexZ, you
        // can use any cc.Sprite and it will work OK.
        var layer = map.getLayer("Trees");
        this.tamara = layer.getTileAt(new cc.Point(29, 29));

        var move = new cc.MoveBy(5, cc.Point.mult(new cc.Point(300, 250), 0.75));
        var back = move.reverse();
        var delay = new cc.DelayTime(0.5);
        var seq = cc.sequence(move, delay, back);
        this.tamara.runAction(seq.repeatForever());

        if (!cc.sys.isNative && !("opengl" in cc.sys.capabilities)) {
            var label = new cc.LabelTTF("Not supported on HTML5-canvas", "Times New Roman", 30);
            this.addChild(label);
            label.x = winSize.width / 2;
            label.y = winSize.height / 2;
        }

        this.schedule(this.repositionSprite);
    }
    title() {
        return "TMX Iso VertexZ";
    }
    subtitle() {
        return "Sprite should hide behind the trees";
    }
    onEnter() {
        super.onEnter();
        director.setProjection(cc.Director.PROJECTION_2D);
        director.setDepthTest(true);
    }
    onExit() {
        director.setProjection(cc.Director.PROJECTION_DEFAULT);
        director.setDepthTest(false);
        super.onExit();
    }
    repositionSprite(dt) {
        if (cc.sys.isNative) {
            this.tamara.vertexZ = -(this.tamara.y + 32) / 16;
        }
        else {
            var layer = this.tamara.parent;
            this.tamara.vertexZ = layer.vertexZ + cc.renderer.assignedZStep * Math.floor(30 - this.tamara.y / 32) / 30;
        }
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(224, 246, 4, 4);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoVertexZ
//
//------------------------------------------------------------------
var TMXOrthoVertexZ = class TMXOrthoVertexZ extends TMXFixBugLayer {
    constructor() {
        super();

        this.tamara = null;

        this.testDuration = 5.2;

        this.pixel = {"0":119, "1":205, "2":73, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test-vertexz.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        // because I'm lazy, I'm reusing a tile as an sprite, but since this method uses vertexZ, you
        // can use any cc.Sprite and it will work OK.
        var layer = map.getLayer("trees");
        this.tamara = layer.getTileAt(new cc.Point(0, 11));
        this.log("vertexZ: " + this.tamara.vertexZ);

        var move = new cc.MoveBy(5, cc.Point.mult(new cc.Point(400, 450), 0.55));
        var back = move.reverse();
        var delay = new cc.DelayTime(0.5);
        var seq = cc.sequence(move, delay, back);
        this.tamara.runAction(seq.repeatForever());

        if (!cc.sys.isNative && !("opengl" in cc.sys.capabilities)) {
            var label = new cc.LabelTTF("Not supported on HTML5-canvas", "Times New Roman", 30);
            this.addChild(label);
            label.x = winSize.width / 2;
            label.y = winSize.height / 2;
        }

        this.schedule(this.repositionSprite);

        this.log("DEPTH BUFFER MUST EXIST IN ORDER");
    }
    title() {
        return "TMX Ortho vertexZ";
    }
    subtitle() {
        return "Sprite should hide behind the trees";
    }
    onEnter() {
        super.onEnter();
        director.setProjection(cc.Director.PROJECTION_2D);
        director.setDepthTest(true);
    }
    onExit() {
        director.setProjection(cc.Director.PROJECTION_DEFAULT);
        director.setDepthTest(false);
        super.onExit();
    }
    repositionSprite(dt) {
        if (cc.sys.isNative) {
            this.tamara.vertexZ = -(this.tamara.y + 81) / 81;
        }
        else {
            // tile height is 101x81
            // map size: 12x12
            var layer = this.tamara.parent;
            this.tamara.vertexZ = layer.vertexZ + cc.renderer.assignedZStep * Math.floor(12 - this.tamara.y / 81) / 12;
        }
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(266, 331, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXIsoMoveLayer
//
//------------------------------------------------------------------
var TMXIsoMoveLayer = class TMXIsoMoveLayer extends TileDemo {
    constructor() {
        super();
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test-movelayer.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);
        map.x = -700;
        map.y = -50;
    }
    title() {
        return "TMX Iso Move Layer";
    }
    subtitle() {
        return "Trees should be horizontally aligned";
    }

};

//------------------------------------------------------------------
//
// TMXOrthoMoveLayer
//
//------------------------------------------------------------------
var TMXOrthoMoveLayer = class TMXOrthoMoveLayer extends TileDemo {
    constructor() {
        super();
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test-movelayer.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);
    }
    title() {
        return "TMX Ortho Move Layer";
    }
    subtitle() {
        return "Trees should be horizontally aligned";
    }

};

//------------------------------------------------------------------
//
// TMXTilePropertyTest
//
//------------------------------------------------------------------
var TMXTilePropertyTest = class TMXTilePropertyTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 0.25;

        this.propertiesList = [];
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/ortho-tile-property.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        for (var i = 1; i <= 6; i++) {
            var properties = map.getPropertiesForGID(i);
            this.log("GID:" + i + ", Properties:" + JSON.stringify(properties));
            this.propertiesList.push(properties)
        }
    }
    title() {
        return "TMX Tile Property Test";
    }
    subtitle() {
        return "In the console you should see tile properties";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = [];
        ret.push({"test":"sss", "type":"object"});
        ret.push({"type":"object"});
        ret.push({"type":"object"});
        ret.push({"type":"platform"});
        ret.push({"type":"platform"});
        ret.push({"type":"platform"});
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        return JSON.stringify(this.propertiesList);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoFlipTest
//
//------------------------------------------------------------------
var TMXOrthoFlipTest = class TMXOrthoFlipTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 2.2;

        this.pixel = {"0":41, "1":42, "2":54, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/ortho-rotation-test.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);
        this.log("ContentSize:" + map.width + "," + map.height);

        var action = new cc.ScaleBy(2, 0.5);
        map.runAction(action);
    }
    title() {
        return "TMX tile flip test";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(93, 153, 5, 5);
        var ret2 = this.readPixels(105, 153, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoFlipRunTimeTest
//
//------------------------------------------------------------------
var TMXOrthoFlipRunTimeTest = class TMXOrthoFlipRunTimeTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 3.2;

        this.pixel = {"0":41, "1":42, "2":54, "3":255};

        this.pixel1 = null;
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/ortho-rotation-test.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        this.log("ContentSize:" + map.width + "," + map.height);

        var action = new cc.ScaleBy(2, 0.5);
        map.runAction(action);

        this.schedule(this.onFlipIt, 1);
    }
    title() {
        return "TMX tile flip run time test";
    }
    subtitle() {
        return "in 2 sec bottom left tiles will flip";
    }
    onFlipIt() {
        var map = this.getChildByTag(TAG_TILE_MAP);
        var layer = map.getLayer("Layer 0");

        //blue diamond
        var tileCoord = new cc.Point(1, 10);
        var flags = layer.getTileFlagsAt(tileCoord);
        var GID = layer.getTileGIDAt(tileCoord);
        // Vertical
        if ((flags & cc.TMX_TILE_VERTICAL_FLAG) >>> 0) {
            flags = (flags & ~cc.TMX_TILE_VERTICAL_FLAG >>> 0) >>> 0;
        } else {
            flags = (flags | cc.TMX_TILE_VERTICAL_FLAG) >>> 0;
        }
        layer.setTileGID(GID, tileCoord, flags);

        tileCoord = new cc.Point(1, 8);
        flags = layer.getTileFlagsAt(tileCoord);
        GID = layer.getTileGIDAt(tileCoord);
        // Vertical
        if ((flags & cc.TMX_TILE_VERTICAL_FLAG) >>> 0)
            flags = (flags & ~cc.TMX_TILE_VERTICAL_FLAG >>> 0) >>> 0;
        else
            flags = (flags | cc.TMX_TILE_VERTICAL_FLAG) >>> 0;
        layer.setTileGID(GID, tileCoord, flags);

        tileCoord = new cc.Point(2, 8);
        flags = layer.getTileFlagsAt(tileCoord);
        GID = layer.getTileGIDAt(tileCoord);
        // Horizontal
        if ((flags & cc.TMX_TILE_HORIZONTAL_FLAG) >>> 0)
            flags = (flags & ~cc.TMX_TILE_HORIZONTAL_FLAG >>> 0) >>> 0;
        else
            flags = (flags | cc.TMX_TILE_HORIZONTAL_FLAG) >>> 0;
        layer.setTileGID(GID, tileCoord, flags);
    }
    //
    // Automation
    //
    setupAutomation() {
        var fun = function () {
            this.pixel1 = this.readPixels(104, 154, 5, 5);
        }
        this.scheduleOnce(fun, 2.2);
    }
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        this.pixel2 = this.readPixels(145, 154, 5, 5);
        var ret = {"pixel1":this.containsPixel(this.pixel1, this.pixel, false) ? "yes" : "no",
            "pixel2":this.containsPixel(this.pixel2, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXOrthoFromXMLTest
//
//------------------------------------------------------------------
var TMXOrthoFromXMLTest = class TMXOrthoFromXMLTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 2.2;

        this.pixel1 = {"0":210, "1":210, "2":200, "3":255};

        this.pixel2 = {"0":243, "1":202, "2":86, "3":255};

        var resources = s_resprefix + "TileMaps";
        var filePath = s_resprefix + "TileMaps/orthogonal-test1.tmx";
        var xmlStr = cc.loader.getRes(filePath);
        var map = new cc.TMXTiledMap(xmlStr, resources);
        this.addChild(map, 0, TAG_TILE_MAP);

        cc.log("ContentSize: " + map.width + ", " + map.height);

        if ("opengl" in cc.sys.capabilities) {
            var mapChildren = map.children;
            for (var i = 0; i < mapChildren.length; i++) {
                var child = mapChildren[i];
                if (child)
                    child.texture.setAntiAliasTexParameters();
            }
        }

        var action = new cc.ScaleBy(2, 0.5);
        map.runAction(action);
    }
    title() {
        return "TMX created from XML test";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(326, 120, 5, 5);
        var ret2 = this.readPixels(124, 246, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXBug987
//
//------------------------------------------------------------------
var TMXBug987 = class TMXBug987 extends TileDemo {
    constructor() {
        super();

        this.testDuration = 0.25;

        this.pixel1 = {"0":162, "1":152, "2":98, "3":255};

        this.pixel2 = {"0":255, "1":208, "2":148, "3":255};

        this.pixel3 = {"0":182, "1":182, "2":146, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/orthogonal-test6.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        this.log("ContentSize:" + map.width + "," + map.height);

        var childs = map.children;
        var node = null;
        for (var i = 0, len = childs.length; i < len; i++) {
            node = childs[i];
            if (!node) break;
            if ("opengl" in cc.sys.capabilities)
                node.texture.setAliasTexParameters();
        }

        map.anchorX = 0;
        map.anchorY = 0;
        var layer = map.getLayer("Tile Layer 1");
        layer.setTileGID(3, new cc.Point(2, 2));
    }
    title() {
        return "TMX Bug 987";
    }
    subtitle() {
        return "You should see an square";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel1":"yes", "pixel2":"yes", "pixel3":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(64, 224, 5, 5);
        var ret2 = this.readPixels(4, 165, 5, 5);
        var ret3 = this.readPixels(144, 140, 5, 5);
        var ret = {"pixel1":this.containsPixel(ret1, this.pixel1, false) ? "yes" : "no",
            "pixel2":this.containsPixel(ret2, this.pixel2, false) ? "yes" : "no",
            "pixel3":this.containsPixel(ret3, this.pixel3, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

//------------------------------------------------------------------
//
// TMXBug787
//
//------------------------------------------------------------------
var TMXBug787 = class TMXBug787 extends TileDemo {
    constructor() {
        super();

        this.testDuration = 0.25;

        this.pixel = {"0":255, "1":255, "2":255, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/iso-test-bug787.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.scale = 0.25;
    }
    title() {
        return "TMX Bug 787";
    }
    subtitle() {
        return "You should see a map";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(364, 243, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

var TMXGIDObjectsTest = class TMXGIDObjectsTest extends TileDemo {
    constructor() {
        super();

        this.testObjects = [];

        var drawNode = new cc.DrawNode();
        drawNode.setLineWidth(3);
        drawNode.setDrawColor(new cc.Color(255,255,255,255));
        this.addChild(drawNode);

        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/test-object-layer.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        this.log("ContentSize:" + map.width + "," + map.height);
        this.log("---. Iterating over all the group objects");

        var group = map.getObjectGroup("Object Layer 1");
        var array = group.getObjects();
        var dict;
        for (var i = 0, len = array.length; i < len; i++) {
            dict = array[i];
            if (!dict)
                break;
            for (var k in dict) {
                this.log(k + ' = ' + dict[k]);
            }

            var x = dict["x"], y = dict["y"];
            var width = dict["width"], height = dict["height"];

            if (width != 0 && height != 0) {
                drawNode.drawSegment(new cc.Point(x, y), new cc.Point((x + width), y));
                drawNode.drawSegment(new cc.Point((x + width), y), new cc.Point((x + width), (y + height)));
                drawNode.drawSegment(new cc.Point((x + width), (y + height)), new cc.Point(x, (y + height)));
                drawNode.drawSegment(new cc.Point(x, (y + height)), new cc.Point(x, y));
            }
        }
        this.testObjects = array;
    }
    title() {
        return "TMX GID objects";
    }
    subtitle() {
        return "Tiles are created from an object group";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = [];
        ret.push({"name":"sandro", "type":"", "x":97, "y":6, "width":0, "height":0});
        ret.push({"name":"", "type":"", "x":119, "y":19, "width":0, "height":0});
        ret.push({"name":"", "type":"", "x":140, "y":38, "width":0, "height":0});
        ret.push({"name":"", "type":"", "x":160, "y":57, "width":0, "height":0});
        ret.push({"name":"", "type":"", "x":180, "y":71, "width":0, "height":0});
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret = [];
        var obj = null;
        for (var i = 0; i < this.testObjects.length; i++) {
            obj = this.testObjects[i];
            ret.push({"name":obj["name"] || "", "type":obj["type"] || "", "x":parseFloat(obj["x"]), "y":parseFloat(obj["y"]), "width":parseFloat(obj["width"] || 0), "height":parseFloat(obj["height"] || 0)});
        }
        return JSON.stringify(ret);
    }

};


var TMXIsoOffsetTest = class TMXIsoOffsetTest extends TileDemo {
    constructor() {
        super();

        this.testDuration = 0.25;

        this.pixel = {"0":168, "1":168, "2":168, "3":255};
        var map = new cc.TMXTiledMap(s_resprefix + "TileMaps/tile_iso_offset.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

    }
    title() {
        return "TMX Tile Offset";
    }
    subtitle() {
        return "Testing offset of tiles";
    }
    //
    // Automation
    //
    getExpectedResult() {
        var ret = {"pixel":"yes"};
        return JSON.stringify(ret);
    }
    getCurrentResult() {
        var ret1 = this.readPixels(150, 260, 5, 5);
        var ret = {"pixel":this.containsPixel(ret1, this.pixel, false) ? "yes" : "no"};
        return JSON.stringify(ret);
    }

};

var TileMapTestScene = class TileMapTestScene extends TestScene {
    runThisTest(num) {
        tileTestSceneIdx = (num || num == 0) ? (num - 1) : -1;
        var layer = nextTileMapTest();
        this.addChild(layer);

        director.runScene(this);
    }

};

//
// Flow control
//
var arrayOfTileMapTest = [
    TMXOrthoTest,
    TMXOrthoTest2,
    TMXOrthoTest3,
    TMXOrthoTest4,
    TMXReadWriteTest,
    TMXHexTest,
    TMXIsoTest,
    TMXIsoTest1,
    TMXIsoTest2,
    TMXUncompressedTest,
    TMXTilesetTest,
    TMXOrthoObjectsTest,
    TMXIsoObjectsTest,
    TMXResizeTest,
    TMXIsoZorder,
    TMXOrthoZorder,
    TMXIsoVertexZ,
    TMXOrthoVertexZ,
    TMXIsoMoveLayer,
    TMXOrthoMoveLayer,
    TMXTilePropertyTest,
    TMXOrthoFlipTest,
    TMXOrthoFlipRunTimeTest,
    TMXOrthoFromXMLTest,
    TMXBug987,
    TMXBug787,
    TMXIsoOffsetTest
];

if ( !cc.sys.isNative ){
    //This test is supported only in HTML5
    arrayOfTileMapTest.push(TMXGIDObjectsTest);
}

var nextTileMapTest = function () {
    tileTestSceneIdx++;
    tileTestSceneIdx = tileTestSceneIdx % arrayOfTileMapTest.length;

    return new arrayOfTileMapTest[tileTestSceneIdx]();
};
var previousTileMapTest = function () {
    tileTestSceneIdx--;
    if (tileTestSceneIdx < 0)
        tileTestSceneIdx += arrayOfTileMapTest.length;

    return new arrayOfTileMapTest[tileTestSceneIdx]();
};
var restartTileMapTest = function () {
    return new arrayOfTileMapTest[tileTestSceneIdx]();
};

