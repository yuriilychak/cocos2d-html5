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
// Accelerometer test
//
//------------------------------------------------------------------
import { EventTest } from "./event-test";
import { s_pathR2 } from "../resources";
import { winSize } from "../constants";
import { EventListener, Sprite, inputManager, log, ServiceLocator } from "@aspect/core";
export class AccelerometerTest extends EventTest {
    constructor() {
        super();
        this._logIndex = 0;
    }

    init() {
        super.init();

        if( 'accelerometer' in ServiceLocator.sys.capabilities ) {
            var self = this;
            // call is called 30 times per second
            inputManager.setAccelerometerInterval(1/30);
            inputManager.setAccelerometerEnabled(true);
            ServiceLocator.eventManager.addListener({
                event: EventListener.ACCELERATION,
                callback: function(accelEvent, event){
                    var target = event.getCurrentTarget();
                    self._logIndex++;
                    if (self._logIndex > 20)
                    {
                        log('Accel x: '+ accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp );    
                        self._logIndex = 0;
                    }
                    

                    var w = winSize.width;
                    var h = winSize.height;

                    var x = w * accelEvent.x + w/2;
                    var y = h * accelEvent.y + h/2;

                    // Low pass filter
                    x = x*0.2 + target.prevX*0.8;
                    y = y*0.2 + target.prevY*0.8;

                    target.prevX = x;
                    target.prevY = y;
                    target.sprite.x = x;
                    target.sprite.y = y ;
                }
            }, this);

            var sprite = this.sprite = new Sprite(s_pathR2);
            this.addChild( sprite );
            sprite.x = winSize.width/2;
            sprite.y = winSize.height/2;

            // for low-pass filter
            this.prevX = 0;
            this.prevY = 0;
        } else {
            log("ACCELEROMETER not supported");
        }
    }

    onExit(){
        super.onExit();
        if( 'accelerometer' in ServiceLocator.sys.capabilities )
            inputManager.setAccelerometerEnabled(false);
    }

    subtitle() {
        return "Accelerometer test. Move device and see console";
    }

}
