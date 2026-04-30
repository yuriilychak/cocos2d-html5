/****************************************************************************
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
// ChipmunkBaseLayer
//
//------------------------------------------------------------------
export class ChipmunkBaseLayer extends BaseTestLayer {
    constructor() {
        //
        // VERY IMPORTANT
        //
        // Only subclasses of a native classes MUST call associateWithNative
        // Failure to do so, it will crash.
        //
        super( new Color(0,0,0,255), new Color(98*0.5,99*0.5,117*0.5,255) );

        this._title =  "No title";
        this._subtitle = "No Subtitle";

        // Menu to toggle debug physics on / off
        var item = new MenuItemFont("Physics On/Off", this.onToggleDebug, this);
        item.fontSize = 24;
        var menu = new Menu( item );
        this.addChild( menu );
        menu.x = winSize.width-100;
        menu.y = winSize.height-90;

        // Create the initial space
        this.space = new cp.Space();

        this.setupDebugNode();
    }

    setupDebugNode()
    {
        // debug only
        this._debugNode = new PhysicsDebugNode(this.space );
        this._debugNode.visible = false ;
        this.addChild( this._debugNode );
    }

    onToggleDebug(sender) {
        var state = this._debugNode.visible;
        this._debugNode.visible = !state ;
    }

    onEnter() {
        super.onEnter();
        //base(this, 'onEnter');

        sys.garbageCollect();
    }

    onCleanup() {
        // Not compulsory, but recommended: cleanup the scene
        this.unscheduleUpdate();
    }

    onRestartCallback(sender) {
        this.onCleanup();
        var s = new ChipmunkTestScene();
        s.addChild(restartChipmunkTest());
        director.runScene(s);
    }

    onNextCallback(sender) {
        this.onCleanup();
        var s = new ChipmunkTestScene();
        s.addChild(nextChipmunkTest());
        director.runScene(s);
    }

    onBackCallback(sender) {
        this.onCleanup();
        var s = new ChipmunkTestScene();
        s.addChild(previousChipmunkTest());
        director.runScene(s);
    }

    numberOfPendingTests() {
        return ( (arrayOfChipmunkTest.length-1) - chipmunkTestSceneIdx );
    }

    getTestNumber() {
        return chipmunkTestSceneIdx;
    }

}
