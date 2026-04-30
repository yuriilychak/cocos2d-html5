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
// TMXIsoTest
//
//------------------------------------------------------------------
import { s_resprefix } from "../tests_resources.js";
import { TileDemo } from "./tile-demo.js";
import { TAG_TILE_MAP } from "./tile-map-test-constants.js";

export class TMXIsoTest extends TileDemo {
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

}
