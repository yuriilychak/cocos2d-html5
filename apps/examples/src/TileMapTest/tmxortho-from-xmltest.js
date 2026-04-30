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
// TMXOrthoFromXMLTest
//
//------------------------------------------------------------------
export class TMXOrthoFromXMLTest extends TileDemo {
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

}
