import { BaseClass } from "@aspect/core";
import { TweenType, DOUBLE_PI, HALF_PI, M_PI } from "./constants.js";

export class TweenFunction extends BaseClass {}
TweenFunction.tweenTo = function (time, type, easingParam) {
    var delta = 0;

    switch (type) {
        case TweenType.CUSTOM_EASING:
            delta = this.customEase(time, easingParam);
            break;
        case TweenType.LINEAR:
            delta = this.linear(time);
            break;
        case TweenType.SINE_EASEIN:
            delta = this.sineEaseIn(time);
            break;
        case TweenType.SINE_EASEOUT:
            delta = this.sineEaseOut(time);
            break;
        case TweenType.SINE_EASEINOUT:
            delta = this.sineEaseInOut(time);
            break;

        case TweenType.QUAD_EASEIN:
            delta = this.quadEaseIn(time);
            break;
        case TweenType.QUAD_EASEOUT:
            delta = this.quadEaseOut(time);
            break;
        case TweenType.QUAD_EASEINOUT:
            delta = this.quadEaseInOut(time);
            break;

        case TweenType.CUBIC_EASEIN:
            delta = this.cubicEaseIn(time);
            break;
        case TweenType.CUBIC_EASEOUT:
            delta = this.cubicEaseOut(time);
            break;
        case TweenType.CUBIC_EASEINOUT:
            delta = this.cubicEaseInOut(time);
            break;

        case TweenType.QUART_EASEIN:
            delta = this.quartEaseIn(time);
            break;
        case TweenType.QUART_EASEOUT:
            delta = this.quartEaseOut(time);
            break;
        case TweenType.QUART_EASEINOUT:
            delta = this.quartEaseInOut(time);
            break;

        case TweenType.QUINT_EASEIN:
            delta = this.quintEaseIn(time);
            break;
        case TweenType.QUINT_EASEOUT:
            delta = this.quintEaseOut(time);
            break;
        case TweenType.QUINT_EASEINOUT:
            delta = this.quintEaseInOut(time);
            break;

        case TweenType.EXPO_EASEIN:
            delta = this.expoEaseIn(time);
            break;
        case TweenType.EXPO_EASEOUT:
            delta = this.expoEaseOut(time);
            break;
        case TweenType.EXPO_EASEINOUT:
            delta = this.expoEaseInOut(time);
            break;

        case TweenType.CIRC_EASEIN:
            delta = this.circEaseIn(time);
            break;
        case TweenType.CIRC_EASEOUT:
            delta = this.circEaseOut(time);
            break;
        case TweenType.CIRC_EASEINOUT:
            delta = this.circEaseInOut(time);
            break;

        case TweenType.ELASTIC_EASEIN:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseIn(time, period);
            break;
        case TweenType.ELASTIC_EASEOUT:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseOut(time, period);
            break;
        case TweenType.ELASTIC_EASEINOUT:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseInOut(time, period);
            break;

        case TweenType.BACK_EASEIN:
            delta = this.backEaseIn(time);
            break;
        case TweenType.BACK_EASEOUT:
            delta = this.backEaseOut(time);
            break;
        case TweenType.BACK_EASEINOUT:
            delta = this.backEaseInOut(time);
            break;

        case TweenType.BOUNCE_EASEIN:
            delta = this.bounceEaseIn(time);
            break;
        case TweenType.BOUNCE_EASEOUT:
            delta = this.bounceEaseOut(time);
            break;
        case TweenType.BOUNCE_EASEINOUT:
            delta = this.bounceEaseInOut(time);
            break;

        default:
            delta = this.sineEaseInOut(time);
            break;
    }

    return delta;
};

// Linear
TweenFunction.linear = function (time) {
    return time;
};

// Sine Ease
TweenFunction.sineEaseIn = function (time) {
    return -1 * Math.cos(time * HALF_PI) + 1;
};
TweenFunction.sineEaseOut = function (time) {
    return Math.sin(time * HALF_PI);
};
TweenFunction.sineEaseInOut = function (time) {
    return -0.5 * (Math.cos(M_PI * time) - 1);
};

// Quad Ease
TweenFunction.quadEaseIn = function (time) {
    return time * time;
};
TweenFunction.quadEaseOut = function (time) {
    return -1 * time * (time - 2);
};
TweenFunction.quadEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time;
    --time;
    return -0.5 * (time * (time - 2) - 1);
};

// Cubic Ease
TweenFunction.cubicEaseIn = function (time) {
    return time * time * time;
};
TweenFunction.cubicEaseOut = function (time) {
    time -= 1;
    return (time * time * time + 1);
};
TweenFunction.cubicEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time + 2);
};

// Quart Ease
TweenFunction.quartEaseIn = function (time) {
    return time * time * time * time;
};
TweenFunction.quartEaseOut = function (time) {
    time -= 1;
    return -(time * time * time * time - 1);
};
TweenFunction.quartEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time * time * time;
    time -= 2;
    return -0.5 * (time * time * time * time - 2);
};

// Quint Ease
TweenFunction.quintEaseIn = function (time) {
    return time * time * time * time * time;
};
TweenFunction.quintEaseOut = function (time) {
    time -= 1;
    return (time * time * time * time * time + 1);
};
TweenFunction.quintEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time * time * time + 2);
};

// Expo Ease
TweenFunction.expoEaseIn = function (time) {
    return time === 0 ? 0 : Math.pow(2, 10 * (time - 1)) - 0.001;
};
TweenFunction.expoEaseOut = function (time) {
    return time === 1 ? 1 : (-Math.pow(2, -10 * time) + 1);
};
TweenFunction.expoEaseInOut = function (time) {
    time /= 0.5;
    if (time < 1) {
        time = 0.5 * Math.pow(2, 10 * (time - 1));
    }
    else {
        time = 0.5 * (-Math.pow(2, -10 * (time - 1)) + 2);
    }

    return time;
};

// Circ Ease
TweenFunction.circEaseIn = function (time) {
    return -1 * (Math.sqrt(1 - time * time) - 1);
};
TweenFunction.circEaseOut = function (time) {
    time = time - 1;
    return Math.sqrt(1 - time * time);
};
TweenFunction.circEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return -0.5 * (Math.sqrt(1 - time * time) - 1);
    time -= 2;
    return 0.5 * (Math.sqrt(1 - time * time) + 1);
};

// Elastic Ease
TweenFunction.elasticEaseIn = function (time, easingParam) {
    var period = 0.3;

    if (easingParam.length > 0) {
        period = easingParam[0];
    }

    var newT = 0;
    if (time === 0 || time === 1) {
        newT = time;
    }
    else {
        var s = period / 4;
        time = time - 1;
        newT = -Math.pow(2, 10 * time) * Math.sin((time - s) * DOUBLE_PI / period);
    }

    return newT;
};
TweenFunction.elasticEaseOut = function (time, easingParam) {
    var period = 0.3;

    if (easingParam.length > 0) {
        period = easingParam[0];
    }

    var newT = 0;
    if (time === 0 || time === 1) {
        newT = time;
    }
    else {
        var s = period / 4;
        newT = Math.pow(2, -10 * time) * Math.sin((time - s) * DOUBLE_PI / period) + 1;
    }

    return newT;
};
TweenFunction.elasticEaseInOut = function (time, easingParam) {
    var period = 0.3;

    if (easingParam.length > 0) {
        period = easingParam[0];
    }

    var newT = 0;
    if (time === 0 || time === 1) {
        newT = time;
    }
    else {
        time = time * 2;
        if (!period) {
            period = 0.3 * 1.5;
        }

        var s = period / 4;

        time = time - 1;
        if (time < 0) {
            newT = -0.5 * Math.pow(2, 10 * time) * Math.sin((time - s) * DOUBLE_PI / period);
        } else {
            newT = Math.pow(2, -10 * time) * Math.sin((time - s) * DOUBLE_PI / period) * 0.5 + 1;
        }
    }
    return newT;
};

// Back Ease
TweenFunction.backEaseIn = function (time) {
    var overshoot = 1.70158;
    return time * time * ((overshoot + 1) * time - overshoot);
};
TweenFunction.backEaseOut = function (time) {
    var overshoot = 1.70158;

    time = time - 1;
    return time * time * ((overshoot + 1) * time + overshoot) + 1;
};
TweenFunction.backEaseInOut = function (time) {
    var overshoot = 1.70158 * 1.525;

    time = time * 2;
    if (time < 1) {
        return (time * time * ((overshoot + 1) * time - overshoot)) / 2;
    }
    else {
        time = time - 2;
        return (time * time * ((overshoot + 1) * time + overshoot)) / 2 + 1;
    }
};

// Bounce Ease
function _cssBounceTime (time) {
    if (time < 1 / 2.75) {
        return 7.5625 * time * time;
    } else if (time < 2 / 2.75) {
        time -= 1.5 / 2.75;
        return 7.5625 * time * time + 0.75;
    } else if (time < 2.5 / 2.75) {
        time -= 2.25 / 2.75;
        return 7.5625 * time * time + 0.9375;
    }

    time -= 2.625 / 2.75;
    return 7.5625 * time * time + 0.984375;
};
TweenFunction.bounceEaseIn = function (time) {
    return 1 - _cssBounceTime(1 - time);
};

TweenFunction.bounceEaseOut = function (time) {
    return _cssBounceTime(time);
};

TweenFunction.bounceEaseInOut = function (time) {
    var newT = 0;
    if (time < 0.5) {
        time = time * 2;
        newT = (1 - _cssBounceTime(1 - time)) * 0.5;
    } else {
        newT = _cssBounceTime(time * 2 - 1) * 0.5 + 0.5;
    }

    return newT;
};

// Custom Ease
TweenFunction.customEase = function (time, easingParam) {
    if (easingParam.length > 0) {
        var tt = 1 - time;
        return easingParam[1] * tt * tt * tt + 3 * easingParam[3] * time * tt * tt + 3 * easingParam[5] * time * time * tt + easingParam[7] * time * time * time;
    }
    return time;
};

TweenFunction.easeIn = function(time, rate){
    return Math.pow(time, rate);
};

TweenFunction.easeOut = function(time, rate){
    return Math.pow(time, 1 / rate);
};

TweenFunction.easeInOut = function(time, rate){
    time *= 2;
    if(time < 1){
        return 0.5 * Math.pow(time, rate);
    }else{
        return 1 - 0.5 * Math.pow(2 - time, rate);
    }
};

TweenFunction.quadraticIn = function(time){
    return Math.pow(time, 2);
};

TweenFunction.quadraticOut = function(time){
    return -time * (time - 2);
};

TweenFunction.bezieratFunction = function(a, b, c, d, t){
    return (Math.pow(1-t,3) * a + 3*t*(Math.pow(1-t,2))*b + 3*Math.pow(t,2)*(1-t)*c + Math.pow(t,3)*d );
};
