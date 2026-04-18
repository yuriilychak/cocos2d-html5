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

var cc = cc || {};

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config<br/>
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 * @param {String}   getterName Name of getter function for the property
 * @param {String}   setterName Name of setter function for the property
 */
cc.defineGetterSetter = function (
  proto,
  prop,
  getter,
  setter,
  getterName,
  setterName
) {
  if (!getterName && !setterName) {
    // Lookup getter/setter function names on the prototype
    var hasGetter = getter != null,
      hasSetter = setter != undefined,
      props = Object.getOwnPropertyNames(proto);
    for (var i = 0; i < props.length; i++) {
      var name = props[i];

      if (
        (proto.__lookupGetter__
          ? proto.__lookupGetter__(name)
          : Object.getOwnPropertyDescriptor(proto, name)) ||
        typeof proto[name] !== "function"
      )
        continue;

      var func = proto[name];
      if (hasGetter && func === getter) {
        getterName = name;
        if (!hasSetter || setterName) break;
      }
      if (hasSetter && func === setter) {
        setterName = name;
        if (!hasGetter || getterName) break;
      }
    }
  }

  // Use polymorphic dispatch via method names so that subclass overrides
  // of getter/setter methods are called correctly (ES6 classes don't
  // automatically re-bind property descriptors like cc.Class.extend did).
  var desc = { enumerable: false, configurable: true };
  if (getterName) {
    var gn = getterName;
    desc.get = function() { return this[gn](); };
  } else if (getter) {
    desc.get = getter;
  }
  if (setterName) {
    var sn = setterName;
    desc.set = function(v) { this[sn](v); };
  } else if (setter) {
    desc.set = setter;
  }
  Object.defineProperty(proto, prop, desc);

  // Register getter/setter names for cc.Class.extend compatibility
  var ctor = proto.constructor;
  if (getterName) {
    if (!ctor.__getters__) {
      ctor.__getters__ = {};
    }
    ctor.__getters__[getterName] = prop;
  }
  if (setterName) {
    if (!ctor.__setters__) {
      ctor.__setters__ = {};
    }
    ctor.__setters__[setterName] = prop;
  }
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @return {Array|object} The created object
 */
cc.clone = function (obj) {
  // Cloning is better if the new object is having the same prototype chain
  // as the copied obj (or otherwise, the cloned object is certainly going to
  // have a different hidden class). Play with C1/C2 of the
  // PerformanceVirtualMachineTests suite to see how this makes an impact
  // under extreme conditions.
  //
  // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
  // prototype lacks a link to the constructor (Carakan, V8) so the new
  // object wouldn't have the hidden class that's associated with the
  // constructor (also, for whatever reasons, utilizing
  // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
  // slower than the original in V8). Therefore, we call the constructor, but
  // there is a big caveat - it is possible that the this.init() in the
  // constructor would throw with no argument. It is also possible that a
  // derived class forgets to set "constructor" on the prototype. We ignore
  // these possibities for and the ultimate solution is a standardized
  // Object.clone(<object>).
  var newObj = obj.constructor ? new obj.constructor() : {};

  // Assuming that the constuctor above initialized all properies on obj, the
  // following keyed assignments won't turn newObj into dictionary mode
  // because they're not *appending new properties* but *assigning existing
  // ones* (note that appending indexed properties is another story). See
  // CCClass.js for a link to the devils when the assumption fails.
  for (var key in obj) {
    var copy = obj[key];
    // Beware that typeof null == "object" !
    if (
      typeof copy === "object" &&
      copy &&
      !(copy instanceof cc.Node) &&
      !(copy instanceof HTMLElement)
    ) {
      newObj[key] = cc.clone(copy);
    } else {
      newObj[key] = copy;
    }
  }
  return newObj;
};

cc.inject = function (srcPrototype, destPrototype) {
  for (var key in srcPrototype) destPrototype[key] = srcPrototype[key];
};

/**
 * @class
 * @name ClassManager
 */
class ClassManager {
    #id = 0 | (Math.random() * 998);
    #instanceId = 0 | (Math.random() * 998);

    getNewID() {
        return this.#id++;
    };

    getNewInstanceId() {
        return this.#instanceId++;
    };
};
var classManager = new ClassManager();
cc.classManager = classManager;

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
(function () {
  /**
   * The base Class implementation. 
   * All classes created with cc.Class.extend inherit from this.
   * This implementation does nothing and is used for inheritance only.
   * @class
   */
  cc.NewClass = class NewClass {
    __instanceId;

    constructor() {
      this.__instanceId = classManager.getNewInstanceId();
    }

    get instanceId() {
      return this.__instanceId;
    }

    static get __pid() {
      if (!Object.prototype.hasOwnProperty.call(this, "pid")) {
        this._pid = classManager.getNewID();
      }

      return this._pid;
    }
  };

})();
