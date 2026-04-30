import { NewClass, log } from "@aspect/core";
import { easeBackIn, easeBackInOut, easeBackOut, easeBounceIn, easeBounceInOut, easeBounceOut, easeCircleActionIn, easeCircleActionInOut, easeCircleActionOut, easeCubicActionIn, easeCubicActionInOut, easeCubicActionOut, easeElasticIn, easeElasticInOut, easeElasticOut, easeExponentialIn, easeExponentialInOut, easeExponentialOut, easeQuadraticActionIn, easeQuadraticActionInOut, easeQuadraticActionOut, easeQuarticActionIn, easeQuarticActionInOut, easeQuarticActionOut, easeQuinticActionIn, easeQuinticActionInOut, easeQuinticActionOut, easeSineIn, easeSineInOut, easeSineOut } from "@aspect/actions";

import { FrameEaseType } from "./constants.js";
/**
 * The action frame of Cocostudio. It's the base class of ActionMoveFrame, ActionScaleFrame etc.
 *
 * @property {Number}               frameType               - frame type of ActionFrame
 * @property {Number}               easingType              - easing type of ActionFrame
 * @property {Number}               frameIndex              - frame index of ActionFrame
 * @property {Number}               time                    - time of ActionFrame
 */
export class ActionFrame extends NewClass {
  /**
   * The constructor of ActionFrame.
   */
  constructor() {
    super();
    this.frameType = 0;
    this.easingType = FrameEaseType.LINEAR;
    this.frameIndex = 0;
    this.time = 0;
  }

  /**
   * Returns the action of ActionFrame. its subClass need override it.
   * @param {number} duration the duration time of ActionFrame
   * @param {ActionFrame} srcFrame source frame.
   * @returns {null}
   */
  getAction(duration, srcFrame) {
    log("Need a definition of <getAction> for ActionFrame");
    return null;
  }

  _getEasingAction(action) {
    if (action === null) {
      console.error("Action cannot be null!");
      return null;
    }

    var resultAction;
    switch (this.easingType) {
      case FrameEaseType.CUSTOM:
        break;
      case FrameEaseType.LINEAR:
        resultAction = action;
        break;
      case FrameEaseType.SINE_EASEIN:
        resultAction = action.easing(easeSineIn());
        break;
      case FrameEaseType.SINE_EASEOUT:
        resultAction = action.easing(easeSineOut());
        break;
      case FrameEaseType.SINE_EASEINOUT:
        resultAction = action.easing(easeSineInOut());
        break;
      case FrameEaseType.QUAD_EASEIN:
        resultAction = action.easing(easeQuadraticActionIn());
        break;
      case FrameEaseType.QUAD_EASEOUT:
        resultAction = action.easing(easeQuadraticActionOut());
        break;
      case FrameEaseType.QUAD_EASEINOUT:
        resultAction = action.easing(easeQuadraticActionInOut());
        break;
      case FrameEaseType.CUBIC_EASEIN:
        resultAction = action.easing(easeCubicActionIn());
        break;
      case FrameEaseType.CUBIC_EASEOUT:
        resultAction = action.easing(easeCubicActionOut());
        break;
      case FrameEaseType.CUBIC_EASEINOUT:
        resultAction = action.easing(easeCubicActionInOut());
        break;
      case FrameEaseType.QUART_EASEIN:
        resultAction = action.easing(easeQuarticActionIn());
        break;
      case FrameEaseType.QUART_EASEOUT:
        resultAction = action.easing(easeQuarticActionOut());
        break;
      case FrameEaseType.QUART_EASEINOUT:
        resultAction = action.easing(easeQuarticActionInOut());
        break;
      case FrameEaseType.QUINT_EASEIN:
        resultAction = action.easing(easeQuinticActionIn());
        break;
      case FrameEaseType.QUINT_EASEOUT:
        resultAction = action.easing(easeQuinticActionOut());
        break;
      case FrameEaseType.QUINT_EASEINOUT:
        resultAction = action.easing(easeQuinticActionInOut());
        break;
      case FrameEaseType.EXPO_EASEIN:
        resultAction = action.easing(easeExponentialIn());
        break;
      case FrameEaseType.EXPO_EASEOUT:
        resultAction = action.easing(easeExponentialOut());
        break;
      case FrameEaseType.EXPO_EASEINOUT:
        resultAction = action.easing(easeExponentialInOut());
        break;
      case FrameEaseType.CIRC_EASEIN:
        resultAction = action.easing(easeCircleActionIn());
        break;
      case FrameEaseType.CIRC_EASEOUT:
        resultAction = action.easing(easeCircleActionOut());
        break;
      case FrameEaseType.CIRC_EASEINOUT:
        resultAction = action.easing(easeCircleActionInOut());
        break;
      case FrameEaseType.ELASTIC_EASEIN:
        resultAction = action.easing(easeElasticIn());
        break;
      case FrameEaseType.ELASTIC_EASEOUT:
        resultAction = action.easing(easeElasticOut());
        break;
      case FrameEaseType.ELASTIC_EASEINOUT:
        resultAction = action.easing(easeElasticInOut());
        break;
      case FrameEaseType.BACK_EASEIN:
        resultAction = action.easing(easeBackIn());
        break;
      case FrameEaseType.BACK_EASEOUT:
        resultAction = action.easing(easeBackOut());
        break;
      case FrameEaseType.BACK_EASEINOUT:
        resultAction = action.easing(easeBackInOut());
        break;
      case FrameEaseType.BOUNCE_EASEIN:
        resultAction = action.easing(easeBounceIn());
        break;
      case FrameEaseType.BOUNCE_EASEOUT:
        resultAction = action.easing(easeBounceOut());
        break;
      case FrameEaseType.BOUNCE_EASEINOUT:
        resultAction = action.easing(easeBounceInOut());
        break;
    }

    return resultAction;
  }

  /**
   * Sets the easing parameter to action frame.
   * @param {Array} parameter
   */
  setEasingParameter(parameter) {
    this._Parameter = [];
    for (var i = 0; i < parameter.length; i++)
      this._Parameter.push(parameter[i]);
  }

  /**
   * Sets the easing type to ActionFrame
   * @param {Number} easingType
   */
  setEasingType(easingType) {
    this.easingType = easingType;
  }
};

