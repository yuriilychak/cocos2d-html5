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

export class PageTurn3DInRectTest extends BaseTestLayer {
    title() {
        return "PageTurn3DInRectTest";
    }
    code() {
        return "a = cc.pageTurn3D(duration, gridSize)";
    }
    // callbacks
    onRestartCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(restartEffectsTest());
        director.runScene(s);
    }
    onNextCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(nextEffectsTest());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new EffectsTestScene();
        s.addChild(previousEffectsTest());
        director.runScene(s);
    }
    onEnter(){
        super.onEnter();

        //var node = new cc.Node();
        var visiableSize = director.getVisibleSize();
        var gridRect = new cc.Rect(visiableSize.width*0.1,
            visiableSize.height*0.1,
            visiableSize.width*0.4,
            visiableSize.height*0.4);
        var gridNodeTarget = new cc.NodeGrid(gridRect);

        gridNodeTarget.runAction(this.getEffect(3));
        this.addChild( gridNodeTarget );

        // back gradient
        var background = new cc.LayerGradient( new cc.Color(255,0,0,255), new cc.Color(255,255,0,255));
        gridNodeTarget.addChild( background );

        // back image
        var bg = new cc.Sprite(s_back3);
        bg.x = winSize.width/2;
        bg.y = winSize.height/2;
        gridNodeTarget.addChild( bg );

        var sister1 = new cc.Sprite(s_pathSister1);
        sister1.x = winSize.width/3;
        sister1.y = winSize.height/2;
        gridNodeTarget.addChild( sister1, 1 );

        var sister2 = new cc.Sprite(s_pathSister2);
        sister2.x = winSize.width*2/3;
        sister2.y = winSize.height/2;
        gridNodeTarget.addChild( sister2, 1 );

        var sc = new cc.ScaleBy(2, 5);
        var sc_back = sc.reverse();
        var seq = cc.sequence( sc, sc_back );
        var repeat = seq.repeatForever();

        sister1.runAction( repeat );
        sister2.runAction( repeat.clone() );
    }

    getEffect(duration) {
        var action = cc.pageTurn3D(duration, new cc.Size(15,10));
        return action;
    }

}
