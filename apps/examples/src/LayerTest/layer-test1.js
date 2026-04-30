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
// LayerTest1
//
//------------------------------------------------------------------
export class LayerTest1 extends LayerTest {
    constructor() {
        super();
        this.pixel = {"0": 190, "1": 0, "2": 0, "3": 128};
    }

    onEnter() {
        //----start0----onEnter
        super.onEnter();

        if( 'touches' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    event.getCurrentTarget().updateSize(touches[0].getLocation());
                }
            }, this);
        else if ('mouse' in cc.sys.capabilities )
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().updateSize(event.getLocation());
                }
            }, this);

        var s = director.getWinSize();
        var layer = new cc.LayerColor(new cc.Color(255, 0, 0, 128));

        layer.ignoreAnchor = false;
        layer.anchorX = 0.5;
        layer.anchorY = 0.5;
        layer.setContentSize(200, 200);
        layer.x = s.width / 2;
        layer.y = s.height / 2;
        this.addChild(layer, 1, cc.TAG_LAYER);
        //----end0----
    }
    title() {
        return "ColorLayer resize (tap & move)";
    }

    updateSize(location) {
        //----start0----updateSize
        var l = this.getChildByTag(cc.TAG_LAYER);

        l.width = Math.abs(location.x - winSize.width / 2) * 2;
	    l.height = Math.abs(location.y - winSize.height / 2) * 2;
        //----end0----
    }

    //
    // Automation
    //

    getExpectedResult() {

        var s = director.getWinSize();
        var ret = {"center": "yes"};
        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret2 =  this.readPixels(s.width/2, s.height/2, 5, 5);
        var ret = {"center": this.containsPixel(ret2, this.pixel, true, 100) ? "yes" : "no"};

        return JSON.stringify(ret);
    }

}
