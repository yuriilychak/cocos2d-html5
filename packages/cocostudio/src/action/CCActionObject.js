/****************************************************************************
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
 * The Cocostudio's action object.
 * @class
 * @extends ccs.Class
 */
ccs.ActionObject = class ActionObject extends cc.NewClass {

    /**
     * Construction of ccs.ActionObject.
     */
    constructor() {
        super();
        this._actionNodeList = [];
        this._name = "";
        this._loop = false;
        this._pause = false;
        this._playing = false;
        this._unitTime = 0.1;
        this._currentTime = 0;
        this._fTotalTime = 0;
        this._scheduler = cc.director.getScheduler();
    }

    /**
     * Sets name to ccs.ActionObject
     * @param {string} name
     */
    setName(name) {
        this._name = name;
    }

    /**
     * Returns name fo ccs.ActionObject
     * @returns {string}
     */
    getName() {
        return this._name;
    }

    /**
     * Sets if the action will loop play.
     * @param {boolean} loop
     */
    setLoop(loop) {
        this._loop = loop;
    }

    /**
     * Returns if the action will loop play.
     * @returns {boolean}
     */
    getLoop() {
        return this._loop;
    }

    /**
     * Sets the time interval of frame.
     * @param {number} time
     */
    setUnitTime(time) {
        this._unitTime = time;
        var frameNum = this._actionNodeList.length;
        for (var i = 0; i < frameNum; i++) {
            var locActionNode = this._actionNodeList[i];
            locActionNode.setUnitTime(this._unitTime);
        }
    }

    /**
     * Returns the time interval of frame.
     * @returns {number} the time interval of frame
     */
    getUnitTime() {
        return this._unitTime;
    }

    /**
     * Returns the current time of frame.
     * @returns {number}
     */
    getCurrentTime() {
        return this._currentTime;
    }

    /**
     * Sets the current time of frame.
     * @param {Number} time the current time of frame
     */
    setCurrentTime(time) {
        this._currentTime = time;
    }

    /**
     * Returns the total time of frame.
     * @returns {number} the total time of frame
     */
    getTotalTime(){
        return this._fTotalTime;
    }

    /**
     * Returns if the action is playing.
     * @returns {boolean}  true if the action is playing, false the otherwise
     */
    isPlaying() {
        return this._playing;
    }

    /**
     * Init properties with a json dictionary
     * @param {Object} dic
     * @param {Object} root
     */
    initWithDictionary(dic, root) {
        this.setName(dic["name"]);
        this.setLoop(dic["loop"]);
        this.setUnitTime(dic["unittime"]);
        var actionNodeList = dic["actionnodelist"];
        var maxLength = 0;
        for (var i = 0; i < actionNodeList.length; i++) {
            var actionNode = new ccs.ActionNode();

            var actionNodeDic = actionNodeList[i];
            actionNode.initWithDictionary(actionNodeDic, root);
            actionNode.setUnitTime(this.getUnitTime());
            this._actionNodeList.push(actionNode);
            var length = actionNode.getLastFrameIndex() - actionNode.getFirstFrameIndex();
            if(length > maxLength){
                maxLength = length;
            }
        }
        this._fTotalTime = maxLength * this._unitTime;
    }

    /**
     * Adds a ActionNode to play the action.
     * @param {ccs.ActionNode} node
     */
    addActionNode(node) {
        if (!node)
            return;
        this._actionNodeList.push(node);
        node.setUnitTime(this._unitTime);
    }

    /**
     * Removes a ActionNode which play the action.
     * @param {ccs.ActionNode} node
     */
    removeActionNode(node) {
        if (node == null)
            return;
        cc.arrayRemoveObject(this._actionNodeList, node);
    }

    /**
     * Plays the action.
     * @param {cc.CallFunc} [fun]  Action Call Back
     */
    play(fun) {
        this.stop();
        this.updateToFrameByTime(0);
        var locActionNodeList = this._actionNodeList;
        var frameNum = locActionNodeList.length;
        for (var i = 0; i < frameNum; i++) {
            locActionNodeList[i].playAction(fun);
        }
        if (this._loop)
            this._scheduler.schedule(this.simulationActionUpdate, this, 0, cc.REPEAT_FOREVER, 0, false, this.__instanceId + "");
        if(fun !== undefined)
            this._callback = fun;
    }

    /**
     * Pauses the action.
     */
    pause() {
        this._pause = true;
        this._playing = false;
    }

    /**
     * Stop the action.
     */
    stop() {
        var locActionNodeList = this._actionNodeList;
        for (var i = 0; i < locActionNodeList.length; i++)
            locActionNodeList[i].stopAction();
        this._scheduler.unschedule(this.simulationActionUpdate, this);
        this._pause = false;
        this._playing = false;
    }

    /**
     * Updates frame by time.
     */
    updateToFrameByTime(time) {
        this._currentTime = time;
        for (var i = 0; i < this._actionNodeList.length; i++) {
            var locActionNode = this._actionNodeList[i];
            locActionNode.updateActionToTimeLine(time);
        }
    }

    /**
     * scheduler update function
     * @param {Number} dt delta time
     */
    simulationActionUpdate(dt) {
        var isEnd = true, locNodeList = this._actionNodeList;
        for(var i = 0, len = locNodeList.length; i < len; i++) {
            if (!locNodeList[i].isActionDoneOnce()){
                isEnd = false;
                break;
            }
        }

        if (isEnd){
            if (this._callback !== null)
                this._callback.execute();
            if (this._loop)
                this.play();
            else{
                this._playing = false;
                this._scheduler.unschedule(this.simulationActionUpdate, this);
            }
        }
    }

};