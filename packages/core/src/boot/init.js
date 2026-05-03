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
_p = null;

/**
 * drawing primitive of game engine
 * @type {DrawingPrimitive}
 */
cc._drawingUtil = null;

/**
 * The element contains the game canvas
 * @deprecated Use Game.getInstance().container instead
 * @type {HTMLDivElement}
 */
cc.container = null;
cc._gameDiv = null;
