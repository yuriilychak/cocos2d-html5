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

import { EffectAdvanceScene } from "./effect-advance-scene";
import { EffectsAdvancedTest } from "./effects-advanced-test-constants";
import { backEffectAdvanceAction, nextEffectAdvanceAction, restartEffectAdvanceAction } from "./effects-advanced-test-helpers";
import { s_back3, s_pathB1, s_pathB2, s_pathF1, s_pathF2, s_pathR1, s_pathR2, s_pathSister1, s_pathSister2 } from "../resources";
import { winSize } from "../constants";
import { Color, LabelTTF, Layer } from "@aspect/core";

export class EffectAdvanceTextLayer extends Layer {

    constructor() {
        super();


        this._atlas = null;


        this._title = null;


        this.rootNode = null;
        this.init();
    }

    onEnter() {
        super.onEnter();

        // back gradient
        this.rootNode = new cc.LayerGradient(new Color(0, 0, 0, 255), new Color(98, 99, 117, 255));
	    var nodeGrid = new cc.NodeGrid();
	    nodeGrid.addChild(this.rootNode);
        this.addChild(nodeGrid, 0, EffectsAdvancedTest.TAG_BACKGROUND);

        var bg = new cc.Sprite(s_back3);
        //this.addChild(bg, 0, EffectsAdvancedTest.TAG_BACKGROUND);
	    this.rootNode.addChild(bg);
        bg.x = winSize.width / 2;
        bg.y = winSize.height / 2;

        var grossini = new cc.Sprite(s_pathSister2);
	    var grossiniGrid = new cc.NodeGrid();
	    grossiniGrid.addChild(grossini);
	    this.rootNode.addChild(grossiniGrid, 1, EffectsAdvancedTest.TAG_SPRITE1);
        grossini.x = winSize.width / 3;
        grossini.y = winSize.height / 2;
        var sc = new cc.ScaleBy(2, 5);
        var sc_back = sc.reverse();
        grossini.runAction(cc.sequence(sc, sc_back).repeatForever());

        var tamara = new cc.Sprite(s_pathSister1);
	    var tamaraGrid = new cc.NodeGrid();
	    tamaraGrid.addChild(tamara);
	    this.rootNode.addChild(tamaraGrid, 1, EffectsAdvancedTest.TAG_SPRITE2);
        tamara.x = winSize.width * 2 / 3;
        tamara.y = winSize.height / 2;
        var sc2 = new cc.ScaleBy(2, 5);
        var sc2_back = sc2.reverse();
        tamara.runAction(cc.sequence(sc2, sc2_back).repeatForever());

        var label = new LabelTTF(this.title(), "Arial", 28);
        label.x = cc.visibleRect.center.x;
        label.y = cc.visibleRect.top.y - 80;
        this.addChild(label);
        label.tag = EffectsAdvancedTest.TAG_LABEL;

        var strSubtitle = this.subtitle();
        if (strSubtitle != "") {
            var subtitleLabel = new LabelTTF(strSubtitle, "Arial", 16);
            this.addChild(subtitleLabel, 101);
            subtitleLabel.x = cc.visibleRect.center.x;
            subtitleLabel.y = cc.visibleRect.top.y - 80;
        }

        var item1 = new cc.MenuItemImage(s_pathB1, s_pathB2, this.backCallback, this);
        var item2 = new cc.MenuItemImage(s_pathR1, s_pathR2, this.restartCallback, this);
        var item3 = new cc.MenuItemImage(s_pathF1, s_pathF2, this.nextCallback, this);

        var menu = new cc.Menu(item1, item2, item3);

        menu.x = 0;
        menu.y = 0;
	    var centerx = cc.visibleRect.center.x, bottomy = cc.visibleRect.bottom.y;
        item1.x = centerx - item2.width * 2;
        item1.y = bottomy + item2.height / 2;
        item2.x = centerx;
        item2.y = bottomy + item2.height / 2;
        item3.x = centerx + item2.width * 2;
        item3.y = bottomy + item2.height / 2;

        this.addChild(menu, 1);
    }

    title() {
        return "No title";
    }

    subtitle() {
        return "";
    }

    restartCallback(sender) {
        var scene = new EffectAdvanceScene();
        scene.addChild(restartEffectAdvanceAction());
        cc.director.runScene(scene);
    }

    nextCallback(sender) {
        var scene = new EffectAdvanceScene();
        scene.addChild(nextEffectAdvanceAction());
        cc.director.runScene(scene);
    }

    backCallback(sender) {
        var scene = new EffectAdvanceScene();
        scene.addChild(backEffectAdvanceAction());
        cc.director.runScene(scene);
    }

}
