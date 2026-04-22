/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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
/**
 * A tag constant for identifying fade scenes
 * @constant
 * @type Number
 */
cc.SCENE_FADE = 4208917214;

/**
 * horizontal orientation Type where the Left is nearer
 * @constant
 * @type Number
 */
cc.TRANSITION_ORIENTATION_LEFT_OVER = 0;
/**
 * horizontal orientation type where the Right is nearer
 * @constant
 * @type Number
 */
cc.TRANSITION_ORIENTATION_RIGHT_OVER = 1;
/**
 * vertical orientation type where the Up is nearer
 * @constant
 * @type Number
 */
cc.TRANSITION_ORIENTATION_UP_OVER = 0;
/**
 * vertical orientation type where the Bottom is nearer
 * @constant
 * @type Number
 */
cc.TRANSITION_ORIENTATION_DOWN_OVER = 1;

/**
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene the scene to transit with
 * @example
 * var trans = new TransitionScene(time,scene);
 */
cc.TransitionScene = class TransitionScene extends cc.Scene {
    _inScene = null;
    _outScene = null;
    _duration = null;
    _isInSceneOnTop = false;
    _isSendCleanupToScene = false;
    _className = "TransitionScene";

    /**
     * creates a base transition with duration and incoming scene
     * Constructor of cc.TransitionScene
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene the scene to transit with
     */
    constructor(t, scene) {
        super();
        if (t !== undefined && scene !== undefined)
            this.initWithDuration(t, scene);
    }

    //private
    _setNewScene(dt) {
        this.unschedule(this._setNewScene);
        // Before replacing, save the "send cleanup to scene"
        var director = cc.director;
        this._isSendCleanupToScene = director.isSendCleanupToScene();
        director.runScene(this._inScene);

        // enable events while transitions
        cc.eventManager.setEnabled(true);

        // issue #267
        this._outScene.visible = true;
    }

    //protected
    _sceneOrder() {
        this._isInSceneOnTop = true;
    }

    /**
     * stuff gets drawn here
     */
    visit() {
        if (this._isInSceneOnTop) {
            this._outScene.visit();
            this._inScene.visit();
        } else {
            this._inScene.visit();
            this._outScene.visit();
        }
        cc.Node.prototype.visit.call(this);
    }

    /**
     *  <p>
     *     Event callback that is invoked every time when cc.TransitionScene enters the 'stage'.                                   <br/>
     *     If the TransitionScene enters the 'stage' with a transition, this event is called when the transition starts.        <br/>
     *     During onEnter you can't access a "sister/brother" node.                                                    <br/>
     *     If you override onEnter, you must call its parent's onEnter function with this._super().
     * </p>
     */
    onEnter() {
        cc.Node.prototype.onEnter.call(this);

        // disable events while transitions
        cc.eventManager.setEnabled(false);

        // outScene should not receive the onEnter callback
        // only the onExitTransitionDidStart
        this._outScene._performRecursive(cc.Node._stateCallbackType.onExitTransitionDidStart);

        this._inScene._performRecursive(cc.Node._stateCallbackType.onEnter);
    }

    /**
     *  <p>
     * callback that is called every time the cc.TransitionScene leaves the 'stage'.                                         <br/>
     * If the cc.TransitionScene leaves the 'stage' with a transition, this callback is called when the transition finishes. <br/>
     * During onExit you can't access a sibling node.                                                             <br/>
     * If you override onExit, you shall call its parent's onExit with this._super().
     * </p>
     */
    onExit() {
        cc.Node.prototype.onExit.call(this);

        // enable events while transitions
        cc.eventManager.setEnabled(true);

        this._outScene._performRecursive(cc.Node._stateCallbackType.onExit);

        // _inScene should not receive the onEnter callback
        // only the onEnterTransitionDidFinish
        this._inScene._performRecursive(cc.Node._stateCallbackType.onEnterTransitionDidFinish);
    }

    /**
     * custom cleanup
     */
    cleanup() {
        cc.Node.prototype.cleanup.call(this);

        if (this._isSendCleanupToScene)
            this._outScene._performRecursive(cc.Node._stateCallbackType.cleanup);
    }

    /**
     * initializes a transition with duration and incoming scene
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene a scene to transit to
     * @return {Boolean} return false if error
     */
    initWithDuration(t, scene) {
        if (!scene)
            throw new Error("cc.TransitionScene.initWithDuration(): Argument scene must be non-nil");

        if (this.init()) {
            this._duration = t;
            this.attr({
                x: 0,
                y: 0,
                anchorX: 0,
                anchorY: 0
            });
            // retain
            this._inScene = scene;
            this._outScene = cc.director.getRunningScene();
            if (!this._outScene) {
                this._outScene = new cc.Scene();
                this._outScene.init();
            }

            if (this._inScene === this._outScene)
                throw new Error("cc.TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene");

            this._sceneOrder();
            return true;
        } else {
            return false;
        }
    }

    /**
     * called after the transition finishes
     */
    finish() {
        // clean up
        this._inScene.attr({
            visible: true,
            x: 0,
            y: 0,
            scale: 1.0,
            rotation: 0.0
        });

        this._outScene.attr({
            visible: false,
            x: 0,
            y: 0,
            scale: 1.0,
            rotation: 0.0
        });

        //[self schedule:@selector(setNewScene:) interval:0];
        this.schedule(this._setNewScene, 0);
    }

    /**
     * set hide the out scene and show in scene
     */
    hideOutShowIn() {
        this._inScene.visible = true;
        this._outScene.visible = false;
    }
};

/**
 * A cc.Transition that supports orientation like.<br/>
 * Possible orientation: LeftOver, RightOver, UpOver, DownOver<br/>
 * useful for when you want to make a transition happen between 2 orientations
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @param {cc.TRANSITION_ORIENTATION_LEFT_OVER|cc.TRANSITION_ORIENTATION_RIGHT_OVER|cc.TRANSITION_ORIENTATION_UP_OVER|cc.TRANSITION_ORIENTATION_DOWN_OVER} orientation
 * @example
 * var trans = new cc.TransitionSceneOriented(time,scene,orientation);
 */
cc.TransitionSceneOriented = class TransitionSceneOriented extends cc.TransitionScene {
    _orientation = 0;

    /**
     * Constructor of TransitionSceneOriented
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     * @param {cc.TRANSITION_ORIENTATION_LEFT_OVER|cc.TRANSITION_ORIENTATION_RIGHT_OVER|cc.TRANSITION_ORIENTATION_UP_OVER|cc.TRANSITION_ORIENTATION_DOWN_OVER} orientation
     */
    constructor(t, scene, orientation) {
        super();
        orientation != undefined && this.initWithDuration(t, scene, orientation);
    }
    /**
     * initialize the transition
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     * @param {cc.TRANSITION_ORIENTATION_LEFT_OVER|cc.TRANSITION_ORIENTATION_RIGHT_OVER|cc.TRANSITION_ORIENTATION_UP_OVER|cc.TRANSITION_ORIENTATION_DOWN_OVER} orientation
     * @return {Boolean}
     */
    initWithDuration(t, scene, orientation) {
        if (super.initWithDuration(t, scene)) {
            this._orientation = orientation;
        }
        return true;
    }
};


/**
 *  Rotate and zoom out the outgoing scene, and then rotate and zoom in the incoming
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionRotoZoom(t, scene);
 */
cc.TransitionRotoZoom = class TransitionRotoZoom extends cc.TransitionScene {

    /**
     * Constructor of TransitionRotoZoom
     * @function
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * Custom On Enter callback
     * @override
     */
    onEnter() {
        super.onEnter();

        this._inScene.attr({
            scale: 0.001,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this._outScene.attr({
            scale: 1.0,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var rotoZoom = cc.sequence(
            cc.spawn(cc.scaleBy(this._duration / 2, 0.001),
                cc.rotateBy(this._duration / 2, 360 * 2)),
            cc.delayTime(this._duration / 2));

        this._outScene.runAction(rotoZoom);
        this._inScene.runAction(
            cc.sequence(rotoZoom.reverse(),
                cc.callFunc(this.finish, this)));
    }
};


/**
 * Zoom out and jump the outgoing scene, and then jump and zoom in the incoming
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionJumpZoom(t, scene);
 */
cc.TransitionJumpZoom = class TransitionJumpZoom extends cc.TransitionScene {
    /**
     * Constructor of TransitionJumpZoom
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * Custom on enter
     */
    onEnter() {
        super.onEnter();
        var winSize = cc.director.getWinSize();

        this._inScene.attr({
            scale: 0.5,
            x: winSize.width,
            y: 0,
            anchorX: 0.5,
            anchorY: 0.5
        });
        this._outScene.anchorX = 0.5;
        this._outScene.anchorY = 0.5;

        var jump = cc.jumpBy(this._duration / 4, cc.p(-winSize.width, 0), winSize.width / 4, 2);
        var scaleIn = cc.scaleTo(this._duration / 4, 1.0);
        var scaleOut = cc.scaleTo(this._duration / 4, 0.5);

        var jumpZoomOut = cc.sequence(scaleOut, jump);
        var jumpZoomIn = cc.sequence(jump, scaleIn);

        var delay = cc.delayTime(this._duration / 2);
        this._outScene.runAction(jumpZoomOut);
        this._inScene.runAction(cc.sequence(delay, jumpZoomIn, cc.callFunc(this.finish, this)));
    }
};


/**
 * Move in from to the left the incoming scene.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionMoveInL(time,scene);
 */
cc.TransitionMoveInL = class TransitionMoveInL extends cc.TransitionScene {
    /**
     * Constructor of TransitionMoveInL
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * Custom on enter
     */
    onEnter() {
        super.onEnter();
        this.initScenes();

        var action = this.action();
        this._inScene.runAction(
            cc.sequence(this.easeActionWithAction(action), cc.callFunc(this.finish, this))
        );
    }

    /**
     * initializes the scenes
     */
    initScenes() {
        this._inScene.setPosition(-cc.director.getWinSize().width, 0);
    }

    /**
     * returns the action that will be performed
     */
    action() {
        return cc.moveTo(this._duration, cc.p(0, 0));
    }

    /**
     * creates an ease action from action
     * @param {cc.ActionInterval} action
     * @return {cc.EaseOut}
     */
    easeActionWithAction(action) {
        return new cc.EaseOut(action, 2.0);
    }
};


/**
 * Move in from to the right the incoming scene.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionMoveInR(time,scene);
 */
cc.TransitionMoveInR = class TransitionMoveInR extends cc.TransitionMoveInL {
    /**
     * Constructor of TransitionMoveInR
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * Init function
     */
    initScenes() {
        this._inScene.setPosition(cc.director.getWinSize().width, 0);
    }
};


/**
 * Move in from to the top the incoming scene.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionMoveInT(time,scene);
 */
cc.TransitionMoveInT = class TransitionMoveInT extends cc.TransitionMoveInL {
    /**
     * Constructor of TransitionMoveInT
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * init function
     */
    initScenes() {
        this._inScene.setPosition(0, cc.director.getWinSize().height);
    }
};


/**
 *  Move in from to the bottom the incoming scene.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionMoveInB(time,scene);
 */
cc.TransitionMoveInB = class TransitionMoveInB extends cc.TransitionMoveInL {
    /**
     * Constructor of TransitionMoveInB
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }

    /**
     * init function
     */
    initScenes() {
        this._inScene.setPosition(0, -cc.director.getWinSize().height);
    }
};


/**
 * The adjust factor is needed to prevent issue #442<br/>
 * One solution is to use DONT_RENDER_IN_SUBPIXELS images, but NO<br/>
 * The other issue is that in some transitions (and I don't know why)<br/>
 * the order should be reversed (In in top of Out or vice-versa).
 * @constant
 * @type Number
 */
cc.ADJUST_FACTOR = 0.5;

/**
 * a transition that a new scene is slided from left
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = cc.TransitionSlideInL(time,scene);
 */
cc.TransitionSlideInL = class TransitionSlideInL extends cc.TransitionScene {
    /**
     * Constructor of TransitionSlideInL
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    _sceneOrder() {
        this._isInSceneOnTop = false;
    }

    /**
     * custom on enter
     */
    onEnter() {
        super.onEnter();
        this.initScenes();

        var inA = this.action();
        var outA = this.action();

        var inAction = cc.sequence(this.easeActionWithAction(inA), cc.callFunc(this.finish, this));
        var outAction = this.easeActionWithAction(outA);
        this._inScene.runAction(inAction);
        this._outScene.runAction(outAction);
    }

    /**
     * initializes the scenes
     */
    initScenes() {
        this._inScene.setPosition(-cc.director.getWinSize().width + cc.ADJUST_FACTOR, 0);
    }
    /**
     * returns the action that will be performed by the incoming and outgoing scene
     * @return {cc.MoveBy}
     */
    action() {
        return cc.moveBy(this._duration, cc.p(cc.director.getWinSize().width - cc.ADJUST_FACTOR, 0));
    }

    /**
     * @param {cc.ActionInterval} action
     * @return {*}
     */
    easeActionWithAction(action) {
        return new cc.EaseInOut(action, 2.0);
    }
};


/**
 *  Slide in the incoming scene from the right border.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionSlideInR(time,scene);
 */
cc.TransitionSlideInR = class TransitionSlideInR extends cc.TransitionSlideInL {
    /**
     * Constructor of TransitionSlideInR
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    _sceneOrder() {
        this._isInSceneOnTop = true;
    }
    /**
     * initializes the scenes
     */
    initScenes() {
        this._inScene.setPosition(cc.director.getWinSize().width - cc.ADJUST_FACTOR, 0);
    }
    /**
     *  returns the action that will be performed by the incoming and outgoing scene
     * @return {cc.MoveBy}
     */
    action() {
        return cc.moveBy(this._duration, cc.p(-(cc.director.getWinSize().width - cc.ADJUST_FACTOR), 0));
    }
};


/**
 * Slide in the incoming scene from the bottom border.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionSlideInB(time,scene);
 */
cc.TransitionSlideInB = class TransitionSlideInB extends cc.TransitionSlideInL {
    /**
     * Constructor of TransitionSlideInB
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    _sceneOrder() {
        this._isInSceneOnTop = false;
    }

    /**
     * initializes the scenes
     */
    initScenes() {
        this._inScene.setPosition(0, -(cc.director.getWinSize().height - cc.ADJUST_FACTOR));
    }

    /**
     * returns the action that will be performed by the incoming and outgoing scene
     * @return {cc.MoveBy}
     */
    action() {
        return cc.moveBy(this._duration, cc.p(0, cc.director.getWinSize().height - cc.ADJUST_FACTOR));
    }
};


/**
 *  Slide in the incoming scene from the top border.
 *  @param {Number} t time in seconds
 *  @param {cc.Scene} scene
 *  @example
 *  var trans = new cc.TransitionSlideInT(time,scene);
 */
cc.TransitionSlideInT = class TransitionSlideInT extends cc.TransitionSlideInL {
    /**
     * Constructor of TransitionSlideInT
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    _sceneOrder() {
        this._isInSceneOnTop = true;
    }

    /**
     * initializes the scenes
     */
    initScenes() {
        this._inScene.setPosition(0, cc.director.getWinSize().height - cc.ADJUST_FACTOR);
    }

    /**
     * returns the action that will be performed by the incoming and outgoing scene
     * @return {cc.MoveBy}
     */
    action() {
        return cc.moveBy(this._duration, cc.p(0, -(cc.director.getWinSize().height - cc.ADJUST_FACTOR)));
    }
};


/**
 * Shrink the outgoing scene while grow the incoming scene
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionShrinkGrow(time,scene);
 */
cc.TransitionShrinkGrow = class TransitionShrinkGrow extends cc.TransitionScene {
    /**
     * Constructor of TransitionShrinkGrow
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * Custom on enter
     */
    onEnter() {
        super.onEnter();

        this._inScene.attr({
            scale: 0.001,
            anchorX: 2 / 3.0,
            anchorY: 0.5
        });
        this._outScene.attr({
            scale: 1.0,
            anchorX: 1 / 3.0,
            anchorY: 0.5
        });

        var scaleOut = cc.scaleTo(this._duration, 0.01);
        var scaleIn = cc.scaleTo(this._duration, 1.0);

        this._inScene.runAction(cc.sequence(this.easeActionWithAction(scaleIn), cc.callFunc(this.finish, this)));
        this._outScene.runAction(this.easeActionWithAction(scaleOut));
    }

    /**
     * @param action
     * @return {cc.EaseOut}
     */
    easeActionWithAction(action) {
        return new cc.EaseOut(action, 2.0);
    }
};


/**
 * Fade out the outgoing scene and then fade in the incoming scene.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @param {cc.TRANSITION_ORIENTATION_LEFT_OVER|cc.TRANSITION_ORIENTATION_RIGHT_OVER|cc.TRANSITION_ORIENTATION_UP_OVER|cc.TRANSITION_ORIENTATION_DOWN_OVER} o
 * @example
 * var trans = new cc.TransitionFade(time,scene,color)
 */
cc.TransitionFade = class TransitionFade extends cc.TransitionScene {
    _color = null;

    /**
     * Constructor of TransitionFade
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     * @param {cc.TRANSITION_ORIENTATION_LEFT_OVER|cc.TRANSITION_ORIENTATION_RIGHT_OVER|cc.TRANSITION_ORIENTATION_UP_OVER|cc.TRANSITION_ORIENTATION_DOWN_OVER} o
     */
    constructor(t, scene, color) {
        super();
        this._color = cc.color();
        scene && this.initWithDuration(t, scene, color);
    }

    /**
     * custom on enter
     */
    onEnter() {
        super.onEnter();

        var l = new cc.LayerColor(this._color);
        this._inScene.visible = false;

        this.addChild(l, 2, cc.SCENE_FADE);
        var f = this.getChildByTag(cc.SCENE_FADE);

        var a = cc.sequence(
            cc.fadeIn(this._duration / 2),
            cc.callFunc(this.hideOutShowIn, this),
            cc.fadeOut(this._duration / 2),
            cc.callFunc(this.finish, this)
        );
        f.runAction(a);
    }

    /**
     * custom on exit
     */
    onExit() {
        super.onExit();
        this.removeChildByTag(cc.SCENE_FADE, false);
    }

    /**
     * initializes the transition with a duration and with an RGB color
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     * @param {cc.Color} color
     * @return {Boolean}
     */
    initWithDuration(t, scene, color) {
        color = color || cc.color.BLACK;
        if (super.initWithDuration(t, scene)) {
            this._color.r = color.r;
            this._color.g = color.g;
            this._color.b = color.b;
            this._color.a = 0;
        }
        return true;
    }
};



/**
 * Cross fades two scenes using the cc.RenderTexture object.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionCrossFade(time,scene);
 */
cc.TransitionCrossFade = class TransitionCrossFade extends cc.TransitionScene {
    /**
     * Constructor of TransitionCrossFade
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * custom on enter
     */
    onEnter() {
        super.onEnter();

        // create a transparent color layer
        // in which we are going to add our rendertextures
        var color = cc.color(0, 0, 0, 0);
        var winSize = cc.director.getWinSize();
        var layer = new cc.LayerColor(color);

        // create the first render texture for inScene
        var inTexture = new cc.RenderTexture(winSize.width, winSize.height);

        inTexture.sprite.anchorX = 0.5;
        inTexture.sprite.anchorY = 0.5;
        inTexture.attr({
            x: winSize.width / 2,
            y: winSize.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });

        // render inScene to its texturebuffer
        inTexture.begin();
        this._inScene.visit();
        inTexture.end();

        // create the second render texture for outScene
        var outTexture = new cc.RenderTexture(winSize.width, winSize.height);
        outTexture.setPosition(winSize.width / 2, winSize.height / 2);
        outTexture.sprite.anchorX = outTexture.anchorX = 0.5;
        outTexture.sprite.anchorY = outTexture.anchorY = 0.5;

        // render outScene to its texturebuffer
        outTexture.begin();
        this._outScene.visit();
        outTexture.end();

        inTexture.sprite.setBlendFunc(cc.ONE, cc.ONE);                                             // inScene will lay on background and will not be used with alpha
        outTexture.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);                      // we are going to blend outScene via alpha

        // add render textures to the layer
        layer.addChild(inTexture);
        layer.addChild(outTexture);

        // initial opacity:
        inTexture.sprite.opacity = 255;
        outTexture.sprite.opacity = 255;

        // create the blend action
        var layerAction = cc.sequence(
            cc.fadeTo(this._duration, 0), cc.callFunc(this.hideOutShowIn, this),
            cc.callFunc(this.finish, this)
        );

        // run the blend action
        outTexture.sprite.runAction(layerAction);

        // add the layer (which contains our two rendertextures) to the scene
        this.addChild(layer, 2, cc.SCENE_FADE);
    }

    /**
     * custom on exit
     */
    onExit() {
        this.removeChildByTag(cc.SCENE_FADE, false);
        super.onExit();
    }
};


/**
 *  Turn off the tiles of the outgoing scene in random order
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionTurnOffTiles(time,scene);
 */
cc.TransitionTurnOffTiles = class TransitionTurnOffTiles extends cc.TransitionScene {
    _gridProxy = null;
    /**
     * Constructor of TransitionCrossFade
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        this._gridProxy = new cc.NodeGrid();
        scene && this.initWithDuration(t, scene);
    }

    _sceneOrder() {
        this._isInSceneOnTop = false;
    }

    /**
     * custom on enter
     */
    onEnter() {
        super.onEnter();
        this._gridProxy.setTarget(this._outScene);
        this._gridProxy._performRecursive(cc.Node._stateCallbackType.onEnter);

        var winSize = cc.director.getWinSize();
        var aspect = winSize.width / winSize.height;
        var x = 0 | (12 * aspect);
        var y = 12;
        var toff = cc.turnOffTiles(this._duration, cc.size(x, y));
        var action = this.easeActionWithAction(toff);
        this._gridProxy.runAction(cc.sequence(action, cc.callFunc(this.finish, this), cc.stopGrid()));
    }

    visit() {
        this._inScene.visit();
        this._gridProxy.visit();
    }

    /**
     * @param {cc.ActionInterval} action
     * @return {cc.ActionInterval}
     */
    easeActionWithAction(action) {
        return action;
    }
};


/**
 *  The odd columns goes upwards while the even columns goes downwards.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionSplitCols(time,scene);
 */
cc.TransitionSplitCols = class TransitionSplitCols extends cc.TransitionScene {
    _gridProxy = null;

    _switchTargetToInscene() {
        this._gridProxy.setTarget(this._inScene);
    }

    /**
     * Constructor of TransitionSplitCols
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        this._gridProxy = new cc.NodeGrid();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * custom on enter
     */
    onEnter() {
        super.onEnter();
        //this._inScene.visible = false;
        this._gridProxy.setTarget(this._outScene);
        this._gridProxy._performRecursive(cc.Node._stateCallbackType.onEnter);

        var split = this.action();
        var seq = cc.sequence(
            split, cc.callFunc(this._switchTargetToInscene, this), split.reverse());

        this._gridProxy.runAction(
            cc.sequence(this.easeActionWithAction(seq), cc.callFunc(this.finish, this), cc.stopGrid())
        );
    }

    onExit() {
        this._gridProxy.setTarget(null);
        this._gridProxy._performRecursive(cc.Node._stateCallbackType.onExit);
        super.onExit();
    }

    visit() {
        this._gridProxy.visit();
    }

    /**
     * @param {cc.ActionInterval} action
     * @return {cc.EaseInOut}
     */
    easeActionWithAction(action) {
        return new cc.EaseInOut(action, 3.0);
    }

    /**
     * @return {*}
     */
    action() {
        return cc.splitCols(this._duration / 2.0, 3);
    }
};


/**
 *  The odd rows goes to the left while the even rows goes to the right.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionSplitRows(time,scene);
 */
cc.TransitionSplitRows = class TransitionSplitRows extends cc.TransitionSplitCols {

    /**
     * Constructor of TransitionSplitRows
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }
    /**
     * @return {*}
     */
    action() {
        return cc.splitRows(this._duration / 2.0, 3);
    }
};


/**
 *  Fade the tiles of the outgoing scene from the left-bottom corner the to top-right corner.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionFadeTR(time,scene);
 */
cc.TransitionFadeTR = class TransitionFadeTR extends cc.TransitionScene {
    _gridProxy = null;
    /**
     * Constructor of TransitionFadeTR
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        this._gridProxy = new cc.NodeGrid();
        scene && this.initWithDuration(t, scene);
    }
    _sceneOrder() {
        this._isInSceneOnTop = false;
    }

    /**
     * Custom on enter
     */
    onEnter() {
        super.onEnter();

        this._gridProxy.setTarget(this._outScene);
        this._gridProxy._performRecursive(cc.Node._stateCallbackType.onEnter);

        var winSize = cc.director.getWinSize();
        var aspect = winSize.width / winSize.height;
        var x = 0 | (12 * aspect);
        var y = 12;

        var action = this.actionWithSize(cc.size(x, y));
        this._gridProxy.runAction(
            cc.sequence(this.easeActionWithAction(action), cc.callFunc(this.finish, this), cc.stopGrid())
        );
    }

    visit() {
        this._inScene.visit();
        this._gridProxy.visit();
    }

    /**
     * @param {cc.ActionInterval} action
     * @return {cc.ActionInterval}
     */
    easeActionWithAction(action) {
        return action;
    }

    /**
     * @param {cc.Size} size
     * @return {*}
     */
    actionWithSize(size) {
        return cc.fadeOutTRTiles(this._duration, size);
    }
};


/**
 *  Fade the tiles of the outgoing scene from the top-right corner to the bottom-left corner.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionFadeBL(time,scene)
 */
cc.TransitionFadeBL = class TransitionFadeBL extends cc.TransitionFadeTR {
    /**
     * Constructor of TransitionFadeBL
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }

    /**
     * @param {cc.Size} size
     * @return {*}
     */
    actionWithSize(size) {
        return cc.fadeOutBLTiles(this._duration, size);
    }
};


/**
 * Fade the tiles of the outgoing scene from the top-right corner to the bottom-left corner.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionFadeUp(time,scene);
 */
cc.TransitionFadeUp = class TransitionFadeUp extends cc.TransitionFadeTR {

    /**
     * Constructor of TransitionFadeUp
     * @function
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }

    /**
     * @param {cc.Size} size
     * @return {cc.FadeOutUpTiles}
     */
    actionWithSize(size) {
        return new cc.FadeOutUpTiles(this._duration, size);
    }
};


/**
 * Fade the tiles of the outgoing scene from the top to the bottom.
 * @param {Number} t time in seconds
 * @param {cc.Scene} scene
 * @example
 * var trans = new cc.TransitionFadeDown(time,scene);
 */
cc.TransitionFadeDown = class TransitionFadeDown extends cc.TransitionFadeTR {

    /**
     * Constructor of TransitionFadeDown
     * @param {Number} t time in seconds
     * @param {cc.Scene} scene
     */
    constructor(t, scene) {
        super();
        scene && this.initWithDuration(t, scene);
    }

    /**
     * @param {cc.Size} size
     * @return {*}
     */
    actionWithSize(size) {
        return cc.fadeOutDownTiles(this._duration, size);
    }
};

