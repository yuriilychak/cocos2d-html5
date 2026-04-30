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

//------------------------------------------------------------------
//
// TMXIsoZorder
//
//------------------------------------------------------------------
import { s_pathSister1, s_resprefix } from "../tests_resources.js";
import { TileDemo } from "./tile-demo.js";
import { TAG_TILE_MAP } from "./tile-map-test-constants.js";

export class TMXIsoZorder extends TileDemo {
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

}
