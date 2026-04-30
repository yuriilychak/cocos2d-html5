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

class LayerGradientTest extends LayerTest {
    constructor() {
        //----start7----onEnter
        super();

        this._isPressed = false;

        this.pixel1 = {"0": 255, "1": 0, "2": 0, "3": 255};

        this.pixel2 = {"0": 0, "1": 255, "2": 0, "3": 255};
        var layer1 = new cc.LayerGradient(new cc.Color(255, 0, 0, 255), new cc.Color(0, 255, 0, 255), new cc.Point(0.9, 0.9));
        this.addChild(layer1, 0, cc.TAG_LAYER);

        if( 'touches' in cc.sys.capabilities ){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan:function(touches, event){
                    event.getCurrentTarget().updateGradient(touches[0].getLocation());
                },
                onTouchesMoved:function (touches, event) {
                    event.getCurrentTarget().updateGradient(touches[0].getLocation());
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities ){
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    event.getCurrentTarget().updateGradient(event.getLocation());
                },
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().updateGradient(event.getLocation());
                }
            }, this);
        }

        var label1 = new cc.LabelTTF("Compressed Interpolation: Enabled", "Marker Felt", 26);
        var label2 = new cc.LabelTTF("Compressed Interpolation: Disabled", "Marker Felt", 26);
        var item1 = new cc.MenuItemLabel(label1);
        var item2 = new cc.MenuItemLabel(label2);
        var item = new cc.MenuItemToggle(item1, item2, this.onToggleItem, this);

         var menu = new cc.Menu(item);
         this.addChild(menu);
         menu.x = winSize.width / 2;
         menu.y = 100;
        //----end7----
    }

    updateGradient(pos) {
        //----start7----updateGradient
        var diff = cc.Point.sub(new cc.Point(winSize.width / 2, winSize.height / 2), pos);
        diff = cc.Point.normalize(diff);

        var gradient = this.getChildByTag(1);
        gradient.setVector(diff);
        //----end7----
    }

    onToggleItem(sender) {
        //----start7----onToggleItem
        var gradient = this.getChildByTag(cc.TAG_LAYER);
        gradient.setCompressedInterpolation(!gradient.isCompressedInterpolation());
        //----end7----
    }

    title() {
        return "LayerGradient";
    }
    subtitle() {
        return "Touch the screen and move your finger";
    }

    //
    // Automation
    //


    getExpectedResult() {
        
        var s = director.getWinSize();
        var ret = {"bottomleft": "yes", "topright": "yes"};
        return JSON.stringify(ret);
    }

    getCurrentResult() {

        var s = director.getWinSize();
        var ret2 =  this.readPixels(50, 50, 50, 50);
        var ret3 =  this.readPixels(s.width - 50, s.height - 50, 50, 50);
        var ret = {"bottomleft": this.containsPixel(ret2, this.pixel1) ? "yes" : "no",
		   "topright": this.containsPixel(ret3, this.pixel2) ? "yes" : "no"};
	
        return JSON.stringify(ret);
    }

}
