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

export class DirectorEventTest extends EventDispatcherTestDemo {
    constructor() {
        super();
        this._count1 = 0;
        this._count2 = 0;
        this._count3 = 0;
        this._count4 = 0;
        this._label1 = null;
        this._label2 = null;
        this._label3 = null;
        this._label4 = null;
        this._event1 = null;
        this._event2 = null;
        this._event3 = null;
        this._event4 = null;
        this._time = 0;
    }


    onEnter(){
        //----start8----onEnter
        super.onEnter();
        var s = director.getWinSize(), selfPointer = this;

        this._label1 = new LabelTTF("Update: 0", "Arial", 20);
        this._label1.setPosition(80,s.height/2 + 60);
        this.addChild(this._label1);

        this._label2 = new LabelTTF("Visit: 0", "Arial", 20);
        this._label2.setPosition(80,s.height/2 + 20);
        this.addChild(this._label2);

        this._label3 = new LabelTTF("Draw: 0", "Arial", 20);
        this._label3.setPosition(80,s.height/2 - 20);
        this.addChild(this._label3);

        this._label4 = new LabelTTF("Projection: 0", "Arial", 20);
        this._label4.setPosition(80,s.height/2 - 60);
        this.addChild(this._label4);

        var dispatcher = eventManager;

        this._event1 = dispatcher.addCustomListener(Director.EVENT_AFTER_UPDATE, this.onEvent1.bind(this));
        this._event2 = dispatcher.addCustomListener(Director.EVENT_AFTER_VISIT, this.onEvent2.bind(this));
        this._event3 = dispatcher.addCustomListener(Director.EVENT_AFTER_DRAW, function(event) {
            selfPointer._label3.setString("Draw: " + selfPointer._count3++);
        });
        this._event4 = dispatcher.addCustomListener(Director.EVENT_PROJECTION_CHANGED, function(event) {
            selfPointer._label4.setString("Projection: " + selfPointer._count4++);
        });

        this.scheduleUpdate();
    }

    onExit(){
        //----start8----onExit
        super.onExit();

        eventManager.removeListener(this._event1);
        eventManager.removeListener(this._event2);
        eventManager.removeListener(this._event3);
        eventManager.removeListener(this._event4);
        //----end8----
    }

    update(dt){
        //----start8----update
        this._time += dt;
        if(this._time > 0.5) {
            director.setProjection(Director.PROJECTION_2D);
            this._time = 0;
        }
        //----end8----
    }

    onEvent1(event){
        //----start8----onExit
        this._label1.setString("Update: " + this._count1++);
        //----end8----
    }

    onEvent2(event){
        //----start8----onExit
        this._label2.setString("Visit: " + this._count2++);
        //----end8----
    }

    title(){
        return "Testing Director Events";
    }

    subtitle(){
        return "after visit, after draw, after update, projection changed";
    }

}
