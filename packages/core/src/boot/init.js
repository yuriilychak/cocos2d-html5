var cc = (window.cc = window.cc || {});
cc._tmp = cc._tmp || {};
cc._LogInfos = {};

var _p = window;
/** @expose */
_p.gl;
/** @expose */
_p.WebGLRenderingContext;
/** @expose */
_p.DeviceOrientationEvent;
/** @expose */
_p.DeviceMotionEvent;
/** @expose */
_p.AudioContext;
if (!_p.AudioContext) {
  /** @expose */
  _p.webkitAudioContext;
}
/** @expose */
_p.mozAudioContext;
_p = Object.prototype;
/** @expose */
_p._super;
/** @expose */
_p.ctor;
_p = null;

/**
 * drawing primitive of game engine
 * @type {DrawingPrimitive}
 */
cc._drawingUtil = null;

/**
 * main Canvas 2D/3D Context of game engine
 * @type {CanvasRenderingContext2D|WebGLRenderingContext}
 */
cc._renderContext = null;
cc._supportRender = false;

/**
 * Main canvas of game engine
 * @type {HTMLCanvasElement}
 */
cc._canvas = null;

/**
 * The element contains the game canvas
 * @type {HTMLDivElement}
 */
cc.container = null;
cc._gameDiv = null;

window.ENABLE_IMAEG_POOL = true;

cc._engineLoaded = false;

// Function.prototype.bind polyfill
Function.prototype.bind =
  Function.prototype.bind ||
  function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      FNOP = function () {},
      fBound = function () {
        return fToBind.apply(
          this instanceof FNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };
    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();
    return fBound;
  };
