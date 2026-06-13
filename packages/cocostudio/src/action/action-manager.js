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

import { ActionObject } from "./action-object.js";

/**
 * Base class for ActionManager.
 */
class StudioActionManager {
  #actionDic = {};

  /**
   * Init properties with json dictionary
   * @param {String} jsonName
   * @param {Object} dic
   * @param {Object} root
   */
  initWithDictionary(jsonName, dic, root) {
    const path = jsonName;
    const pos = path.lastIndexOf("/");
    const fileName = path.substr(pos + 1, path.length);
    const actionList = dic["actionlist"];
    const locActionList = [];

    for (let i = 0; i < actionList.length; i++) {
      const locAction = new ActionObject();
      const locActionDic = actionList[i];
      locAction.initWithDictionary(locActionDic, root);
      locActionList.push(locAction);
    }

    this.#actionDic[fileName] = locActionList;
  }

  /**
   * Gets an actionObject with a name.
   * @param {String} jsonName
   * @param {String} actionName
   * @returns {ActionObject}
   */
  getActionByName(jsonName, actionName) {
    const path = jsonName;
    const pos = path.lastIndexOf("/");
    const fileName = path.substr(pos + 1, path.length);
    const actionList = this.#actionDic[fileName];
    if (!actionList) {
      return null;
    }
    for (let i = 0; i < actionList.length; i++) {
      const locAction = actionList[i];
      if (actionName === locAction.name) {
        return locAction;
      }
    }
    return null;
  }

  /**
   * Play an Action with a name.
   * @param {String} jsonName
   * @param {String} actionName
   * @param {CallFunc} fun
   */
  playActionByName(jsonName, actionName, fun) {
    const action = this.getActionByName(jsonName, actionName);
    if (action) {
      action.play(fun);
    }
  }

  /**
   * Stop an Action with a name.
   * @param {String} jsonName
   * @param {String} actionName
   */
  stopActionByName(jsonName, actionName) {
    const action = this.getActionByName(jsonName, actionName);
    if (action) {
      action.stop();
    }
  }

  /**
   * Release all actions.
   */
  releaseActions() {
    this.#actionDic = {};
  }

  /**
   * Clear data: Release all actions.
   */
  clear() {
    this.#actionDic = {};
  }
}

/**
 * Base singleton object for ActionManager.
 * @name actionManager
 */
export const actionManager = new StudioActionManager();
