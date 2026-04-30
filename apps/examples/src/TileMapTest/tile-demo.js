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
// TileDemo
//
//------------------------------------------------------------------
export class TileDemo extends BaseTestLayer {
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

}
