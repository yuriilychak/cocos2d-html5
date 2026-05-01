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

//
// Base Layer
//
import { BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { effectsTestSceneIdx } from "./effects-test-constants";
import { arrayOfEffectsTest, nextEffectsTest, previousEffectsTest, restartEffectsTest } from "./effects-test-helpers";
import { EffectsTestScene } from "./effects-test-scene";
import { s_back3, s_pathSister1, s_pathSister2 } from "../resources";
import { director, winSize } from "../constants";
import { Point, Color } from "@aspect/core";
import { MoveBy, ScaleBy, sequence } from "@aspect/actions";

export class EffectsBaseLayer extends BaseTestLayer {
    code() {
        return "";
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
    onEnter() {
        super.onEnter();

        var node = new cc.Node();

        //Whether to demonstrate the effects inside a smaller rect
        var nodeGrid = new cc.NodeGrid();
        nodeGrid.addChild(node);
        nodeGrid.runAction(this.getEffect(3));
        this.addChild( nodeGrid );

        // back gradient
        var gradient = new cc.LayerGradient( new Color(255,0,0,255), new Color(255,255,0,255));
        node.addChild( gradient );

        // back image
        var bg = new cc.Sprite(s_back3);
        bg.x = winSize.width/2;
        bg.y = winSize.height/2;
        node.addChild( bg );

        var sister1 = new cc.Sprite(s_pathSister1);
        sister1.x = winSize.width/3;
        sister1.y = winSize.height/2;
        node.addChild( sister1, 1 );

        var sister2 = new cc.Sprite(s_pathSister2);
        sister2.x = winSize.width*2/3;
        sister2.y = winSize.height/2;
        node.addChild( sister2, 1 );

        var sc = new ScaleBy(2, 5);
        var sc_back = sc.reverse();
        var seq = sequence( sc, sc_back );
        var repeat = seq.repeatForever();

        sister1.runAction( repeat );
        sister2.runAction( repeat.clone() );
    }

    getEffect(duration) {
        // override me
        return new MoveBy(2, new Point(10,10) );
    }

    // automation
    numberOfPendingTests() {
        return ( (arrayOfEffectsTest.length-1) - effectsTestSceneIdx );
    }

    getTestNumber() {
        return effectsTestSceneIdx;
    }


}
