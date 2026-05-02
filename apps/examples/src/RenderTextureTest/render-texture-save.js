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
// Tests
//
//------------------------------------------------------------------
import { RenderTextureBaseLayer } from "./render-texture-base-layer";
import { s_fire } from "../resources";
import { winSize } from "../constants";
import { Color, EventListener, EventManager, EventMouse, Point, Sprite, Sys, log } from "@aspect/core";
import { Menu, MenuItemFont } from "@aspect/menus";

import { RenderTexture, IMAGE_FORMAT_JPEG } from "@aspect/render-texture";
export class RenderTextureSave extends RenderTextureBaseLayer {
    constructor() {
        super();
        this._brushs = null;
        this._target = null;
        this._lastLocation = null;
        this._counter = 0;
    }


    onEnter() {
        super.onEnter();

        if ('touches' in Sys.getInstance().capabilities){
            EventManager.getInstance().addListener({
                event: EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    event.getCurrentTarget().drawInLocation(touches[0].getLocation());
                }
            }, this);
        } else if ('mouse' in Sys.getInstance().capabilities)
            EventManager.getInstance().addListener({
                event: EventListener.MOUSE,
                onMouseDown: function(event){
                    event.getCurrentTarget()._lastLocation = event.getLocation();
                },
                onMouseMove: function(event){
                    if(event.getButton() == EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().drawInLocation(event.getLocation());
                }
            }, this);

        this._brushs = [];

        var save = new MenuItemFont("Save", this.saveCB, this);
        var clear = new MenuItemFont("Clear", this.clearCB.bind(this)); // another way to pass 'this'
        var menu = new Menu(save, clear);
        menu.alignItemsVertically();
        menu.x = winSize.width - 70;
        menu.y = winSize.height - 80;
        this.addChild(menu, 10);

        // create a render texture
        var target = new RenderTexture(winSize.width, winSize.height, 2);
        target.x = winSize.width / 2;
        target.y = winSize.height / 2;
        this.addChild(target, 1);

        this._target = target;

        this._lastLocation = new Point(winSize.width / 2, winSize.height / 2);
    }

    onExit() {
        super.onExit();
    }

    saveCB(sender) {
        if(!Sys.getInstance().isNative){
            log("RenderTexture's saveToFile doesn't support on HTML5");
            return;
        }
        var namePNG = "image-" + this._counter + ".png";
        var nameJPG = "image-" + this._counter + ".jpg";

        // You can only save one file at a time (in one frame)
        this._target.saveToFile(nameJPG, IMAGE_FORMAT_JPEG, false);
        //this._target.saveToFile(namePNG, IMAGE_FORMAT_PNG);

        log("images saved!");
        this._counter++;
    }

    clearCB(sender) {
        this._target.clear(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
    }

    drawInLocation(location) {
        var distance = Point.distance(location, this._lastLocation);

        if (distance > 1) {
            var locLastLocation = this._lastLocation, i;
            this._target.begin();
            this._brushs = [];
            for(i = 0; i < distance; ++i) {
                var diffX = locLastLocation.x - location.x;
                var diffY = locLastLocation.y - location.y;
                var delta = i / distance;
                var sprite = new Sprite(s_fire);
                sprite.attr({
                    x: location.x + diffX * delta,
                    y: location.y + diffY * delta,
                    rotation: Math.random() * 360,
                    color: new Color(Math.random() * 255, 255, 255),
                    scale: Math.random() + 0.25,
                    opacity: 20
                });
                sprite.parent = this;
                this._brushs.push(sprite);
            }
            for (i = 0; i < distance; i++) {
                this._brushs[i].visit();
            }
            this._target.end();
        }
        this._lastLocation = location;
    }

    subtitle() {
        return "Testing 'save'";
    }

}
