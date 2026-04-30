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
// TMXIsoVertexZ
//
//------------------------------------------------------------------
export class TMXIsoVertexZ extends TMXFixBugLayer {
    constructor() {
        super();

        this.tamara = null;

        this.testDuration = 5.2;

        this.pixel = {"0":255, "1":255, "2":255, "3":255};
        var map = new TMXTiledMap(s_resprefix + "TileMaps/iso-test-vertexz.tmx");
        this.addChild(map, 0, TAG_TILE_MAP);

        map.x = -map.width / 2;
        map.y = 0;

        // because I'm lazy, I'm reusing a tile as an sprite, but since this method uses vertexZ, you
        // can use any Sprite and it will work OK.
        var layer = map.getLayer("Trees");
        this.tamara = layer.getTileAt(new Point(29, 29));

        var move = new MoveBy(5, Point.mult(new Point(300, 250), 0.75));
        var back = move.reverse();
        var delay = new DelayTime(0.5);
        var seq = sequence(move, delay, back);
        this.tamara.runAction(seq.repeatForever());

        if (!sys.isNative && !("opengl" in sys.capabilities)) {
            var label = new LabelTTF("Not supported on HTML5-canvas", "Times New Roman", 30);
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
        director.setProjection(Director.PROJECTION_2D);
        director.setDepthTest(true);
    }
    onExit() {
        director.setProjection(Director.PROJECTION_DEFAULT);
        director.setDepthTest(false);
        super.onExit();
    }
    repositionSprite(dt) {
        if (sys.isNative) {
            this.tamara.vertexZ = -(this.tamara.y + 32) / 16;
        }
        else {
            var layer = this.tamara.parent;
            this.tamara.vertexZ = layer.vertexZ + renderer.assignedZStep * Math.floor(30 - this.tamara.y / 32) / 30;
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

}
