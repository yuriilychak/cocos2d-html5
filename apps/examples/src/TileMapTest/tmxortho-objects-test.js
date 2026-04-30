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
// TMXOrthoObjectsTest
//
//------------------------------------------------------------------
export class TMXOrthoObjectsTest extends TileDemo {
    constructor() {
        super();

        this.testObjects = null;
        var drawNode = new DrawNode();
        drawNode.setLineWidth(3);
        drawNode.setDrawColor(new Color(255,255,255,255));

        var map = new TMXTiledMap(s_resprefix + "TileMaps/ortho-objects.tmx");
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

            drawNode.drawSegment(new Point(x, y), new Point((x + width), y));
            drawNode.drawSegment(new Point((x + width), y), new Point((x + width), (y + height)));
            drawNode.drawSegment(new Point((x + width), (y + height)), new Point(x, (y + height)));
            drawNode.drawSegment(new Point(x, (y + height)), new Point(x, y));
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

}
