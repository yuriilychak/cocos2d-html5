//Action frame type
/**
 * The flag move action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
export const FRAME_TYPE_MOVE = 0;
/**
 * The flag scale action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
export const FRAME_TYPE_SCALE = 1;
/**
 * The flag rotate action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
export const FRAME_TYPE_ROTATE = 2;
/**
 * The flag tint action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
export const FRAME_TYPE_TINT = 3;
/**
 * The flag fade action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
export const FRAME_TYPE_FADE = 4;
/**
 * The max flag of Cocostudio frame.
 * @constant
 * @type {number}
 */
export const FRAME_TYPE_MAX = 5;

/**
 * The ease type of Cocostudio frame.
 * @constant
 * @type {Object}
 */
export const FrameEaseType = {
  CUSTOM: -1,

  LINEAR: 0,

  SINE_EASEIN: 1,
  SINE_EASEOUT: 2,
  SINE_EASEINOUT: 3,

  QUAD_EASEIN: 4,
  QUAD_EASEOUT: 5,
  QUAD_EASEINOUT: 6,

  CUBIC_EASEIN: 7,
  CUBIC_EASEOUT: 8,
  CUBIC_EASEINOUT: 9,

  QUART_EASEIN: 10,
  QUART_EASEOUT: 11,
  QUART_EASEINOUT: 12,

  QUINT_EASEIN: 13,
  QUINT_EASEOUT: 14,
  QUINT_EASEINOUT: 15,

  EXPO_EASEIN: 16,
  EXPO_EASEOUT: 17,
  EXPO_EASEINOUT: 18,

  CIRC_EASEIN: 19,
  CIRC_EASEOUT: 20,
  CIRC_EASEINOUT: 21,

  ELASTIC_EASEIN: 22,
  ELASTIC_EASEOUT: 23,
  ELASTIC_EASEINOUT: 24,

  BACK_EASEIN: 25,
  BACK_EASEOUT: 26,
  BACK_EASEINOUT: 27,

  BOUNCE_EASEIN: 28,
  BOUNCE_EASEOUT: 29,
  BOUNCE_EASEINOUT: 30,

  TWEEN_EASING_MAX: 1000
};
