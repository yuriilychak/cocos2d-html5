/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
// LoaderTestLayer
//
//------------------------------------------------------------------
export class LoaderTestLayer extends BaseTestLayer {

    constructor() {
        super(new Color(0,0,0,255), new Color(98,99,117,255));
        var self = this;


        this._title = "Loader Test";


        this._subtitle = "";

        loader.load(s_helloWorld, function(err, results){
            if(err){
                log("Failed to load %s.", s_helloWorld);
                return;
            }
            log(s_helloWorld + "--->");
            log(results[0]);
            var bg = new Sprite(s_helloWorld);
            self.addChild(bg);
            bg.x = winSize.width/2;
            bg.y = winSize.height/2;
        });

        loader.load([s_ghostsPlist, s_ghosts], function(err, results){
            if(err){
                log("Failed to load %s, %s .", s_ghostsPlist, s_ghosts);
                return;
            }

            log(s_ghostsPlist + "--->");
            log(results[0]);
            log(s_ghosts + "--->");
            log(results[1]);
            spriteFrameCache.addSpriteFrames(s_ghostsPlist);
            var frame = new Sprite("#sister1.gif");
            self.addChild(frame);
            frame.x = winSize.width/4;
            frame.y = winSize.height/4;
        });


        var str;
        if(sys.isNative)  {
            str = s_lookup_desktop_plist;
        } else if(sys.isMobile) {
            str = s_lookup_mobile_plist;
        } else {
            str = s_lookup_html5_plist;
        }

        loader.loadAliases(str, function(){
            var sprite = new Sprite("grossini.bmp");
            self.addChild( sprite, 100);
            sprite.x = winSize.width/2;
            sprite.y = winSize.height/2;
        });
    }

    onNextCallback(){
        var parent = this.getParent();
        parent.removeChild(this);
        parent.addChild(new LoaderCycleLayer());
    }

}
