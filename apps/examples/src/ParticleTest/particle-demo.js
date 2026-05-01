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

import { BASE_TEST_TITLE_TAG, BaseTestLayer } from "../BaseTestLayer/BaseTestLayer";
import { TAG_LABEL_ATLAS, particleSceneIdx } from "./particle-test-constants";
import { backParticleAction, nextParticleAction, particleSceneArr } from "./particle-test-helpers";
import { ParticleTestScene } from "./particle-test-scene";
import { s_MovementMenuItem, s_back3, s_fpsImages, s_shapeModeMenuItem, s_textureModeMenuItem } from "../resources";
import { director } from "../constants";
import { Point, Color, Rect } from "@aspect/core";

export class ParticleDemo extends BaseTestLayer {

    setColor() {
    }

    constructor() {
        super(new Color(0,0,0,255), new Color(98,99,117,255));


        this._emitter = null;


        this._background = null;


        this._shapeModeButton = null;


        this._textureModeButton = null;


        this._isPressed = false;
        this._emitter = null;

        if ('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesBegan:function (touches, event) {
                    event.getCurrentTarget()._moveToTouchPoint(touches[0].getLocation());
                },
                onTouchesMoved:function (touches, event) {
                    event.getCurrentTarget()._moveToTouchPoint(touches[0].getLocation());
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function(event){
                    event.getCurrentTarget()._moveToTouchPoint(event.getLocation());
                },
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget()._moveToTouchPoint(event.getLocation());
                }
            }, this);

        var s = director.getWinSize();

        var freeBtnNormal = new cc.Sprite(s_MovementMenuItem, new Rect(0, 23 * 2, 123, 23));
        var freeBtnSelected = new cc.Sprite(s_MovementMenuItem, new Rect(0, 23, 123, 23));
        var freeBtnDisabled = new cc.Sprite(s_MovementMenuItem, new Rect(0, 0, 123, 23));

        var relativeBtnNormal = new cc.Sprite(s_MovementMenuItem, new Rect(123, 23 * 2, 138, 23));
        var relativeBtnSelected = new cc.Sprite(s_MovementMenuItem, new Rect(123, 23, 138, 23));
        var relativeBtnDisabled = new cc.Sprite(s_MovementMenuItem, new Rect(123, 0, 138, 23));

        var groupBtnNormal = new cc.Sprite(s_MovementMenuItem, new Rect(261, 23 * 2, 136, 23));
        var groupBtnSelected = new cc.Sprite(s_MovementMenuItem, new Rect(261, 23, 136, 23));
        var groupBtnDisabled = new cc.Sprite(s_MovementMenuItem, new Rect(261, 0, 136, 23));

        var selfPoint = this;
        this._freeMovementButton = new cc.MenuItemSprite(freeBtnNormal, freeBtnSelected, freeBtnDisabled,
            function () {
                selfPoint._emitter.setPositionType(cc.ParticleSystem.TYPE_RELATIVE);
                selfPoint._relativeMovementButton.setVisible(true);
                selfPoint._freeMovementButton.setVisible(false);
                selfPoint._groupMovementButton.setVisible(false);
            });
        this._freeMovementButton.x = 10;
        this._freeMovementButton.y = 150;
        this._freeMovementButton.setAnchorPoint(0, 0);

        this._relativeMovementButton = new cc.MenuItemSprite(relativeBtnNormal, relativeBtnSelected, relativeBtnDisabled,
            function () {
                selfPoint._emitter.setPositionType(cc.ParticleSystem.TYPE_GROUPED);
                selfPoint._relativeMovementButton.setVisible(false);
                selfPoint._freeMovementButton.setVisible(false);
                selfPoint._groupMovementButton.setVisible(true);
            });
        this._relativeMovementButton.setVisible(false);
        this._relativeMovementButton.x = 10;
        this._relativeMovementButton.y = 150;
        this._relativeMovementButton.setAnchorPoint(0, 0);

        this._groupMovementButton = new cc.MenuItemSprite(groupBtnNormal, groupBtnSelected, groupBtnDisabled,
            function () {
                selfPoint._emitter.setPositionType(cc.ParticleSystem.TYPE_FREE);
                selfPoint._relativeMovementButton.setVisible(false);
                selfPoint._freeMovementButton.setVisible(true);
                selfPoint._groupMovementButton.setVisible(false);
            });
        this._groupMovementButton.setVisible(false);
        this._groupMovementButton.x = 10;
        this._groupMovementButton.y = 150;
        this._groupMovementButton.setAnchorPoint(0, 0);

        var spriteNormal = new cc.Sprite(s_shapeModeMenuItem, new Rect(0, 23 * 2, 115, 23));
        var spriteSelected = new cc.Sprite(s_shapeModeMenuItem, new Rect(0, 23, 115, 23));
        var spriteDisabled = new cc.Sprite(s_shapeModeMenuItem, new Rect(0, 0, 115, 23));

        this._shapeModeButton = new cc.MenuItemSprite(spriteNormal, spriteSelected, spriteDisabled,
            function () {
                if (selfPoint._emitter.setDrawMode)
                    selfPoint._emitter.setDrawMode(cc.ParticleSystem.TEXTURE_MODE);
                selfPoint._textureModeButton.setVisible(true);
                selfPoint._shapeModeButton.setVisible(false);
            });
        this._shapeModeButton.setVisible(false);
        this._shapeModeButton.x = 10;
        this._shapeModeButton.y = 100;
        this._shapeModeButton.setAnchorPoint(0, 0);

        var spriteNormal_t = new cc.Sprite(s_textureModeMenuItem, new Rect(0, 23 * 2, 115, 23));
        var spriteSelected_t = new cc.Sprite(s_textureModeMenuItem, new Rect(0, 23, 115, 23));
        var spriteDisabled_t = new cc.Sprite(s_textureModeMenuItem, new Rect(0, 0, 115, 23));

        this._textureModeButton = new cc.MenuItemSprite(spriteNormal_t, spriteSelected_t, spriteDisabled_t,
            function () {
                if (selfPoint._emitter.setDrawMode)
                    selfPoint._emitter.setDrawMode(cc.ParticleSystem.SHAPE_MODE);
                selfPoint._textureModeButton.setVisible(false);
                selfPoint._shapeModeButton.setVisible(true);
            });
        this._textureModeButton.x = 10;
        this._textureModeButton.y = 100;
        this._textureModeButton.setAnchorPoint(0, 0);

        if ('opengl' in cc.sys.capabilities ) {
            // Shape type is not compatible with JSB
            this._textureModeButton.enabled = false;
        }

        var menu = new cc.Menu( this._shapeModeButton, this._textureModeButton,
            this._freeMovementButton, this._relativeMovementButton, this._groupMovementButton);
        menu.x = 0;
        menu.y = 0;

        this.addChild(menu, 100);
        //TODO
        var labelAtlas = new cc.LabelAtlas("0123456789", s_fpsImages, 12, 32, '.');
        this.addChild(labelAtlas, 100, TAG_LABEL_ATLAS);
        labelAtlas.x = s.width - 66;
        labelAtlas.y = 50;

        // moving background
        this._background = new cc.Sprite(s_back3);
        this.addChild(this._background, 5);
        this._background.x = s.width / 2;
        this._background.y = s.height - 180;

        var move = new cc.MoveBy(4, new Point(300, 0));
        var move_back = move.reverse();

        var seq = cc.sequence(move, move_back);
        this._background.runAction(seq.repeatForever());
        this.scheduleUpdate();
    }

    onEnter() {
        super.onEnter();

        var pLabel = this.getChildByTag(BASE_TEST_TITLE_TAG);
        pLabel.setString(this.title());
    }
    title() {
        return "No title";
    }

    subtitle() {
        return "(Tap the Screen)";
    }

    onRestartCallback(sender) {
        this._emitter.resetSystem();
    }
    onNextCallback(sender) {
        var s = new ParticleTestScene();
        s.addChild(nextParticleAction());
        director.runScene(s);
    }
    onBackCallback(sender) {
        var s = new ParticleTestScene();
        s.addChild(backParticleAction());
        director.runScene(s);
    }
    toggleCallback(sender) {
        if (this._emitter.getPositionType() == cc.ParticleSystem.TYPE_GROUPED)
            this._emitter.setPositionType(cc.ParticleSystem.TYPE_FREE);
        else if (this._emitter.getPositionType() == cc.ParticleSystem.TYPE_FREE)
            this._emitter.setPositionType(cc.ParticleSystem.TYPE_RELATIVE);
        else if (this._emitter.getPositionType() == cc.ParticleSystem.TYPE_RELATIVE)
            this._emitter.setPositionType(cc.ParticleSystem.TYPE_GROUPED);
    }

    _moveToTouchPoint(location) {
        var pos = new Point(0, 0);
        if (this._background) {
            pos = this._background.convertToWorldSpace(new Point(0, 0));
        }
        this._emitter.x = location.x - pos.x;
        this._emitter.y = location.y - pos.y;
    }

    update(dt) {
        if (this._emitter) {
            var atlas = this.getChildByTag(TAG_LABEL_ATLAS);
            atlas.setString(this._emitter.getParticleCount().toFixed(0));
        }
    }
    setEmitterPosition() {
        var sourcePos = this._emitter.getSourcePosition();
        if (sourcePos.x === 0 && sourcePos.y === 0)
            this._emitter.x = 200;
            this._emitter.y = 70;
    }
    // automation
    numberOfPendingTests() {
        return ( (particleSceneArr.length-1) - particleSceneIdx );
    }

    getTestNumber() {
        return particleSceneIdx;
    }

}
