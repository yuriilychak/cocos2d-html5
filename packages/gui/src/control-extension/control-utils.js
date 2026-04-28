import { Rect } from "@aspect/core";

export class RGBA {
    r = 0;
    g = 0;
    b = 0;
    a = 0;
}

export class HSV {
    h = 0;
    s = 0;
    v = 0;
}

export const ControlUtils = {
    addSpriteToTargetWithPosAndAnchor(sprite, target, pos, anchor) {
        sprite.setPosition(pos.x, pos.y);
        sprite.setAnchorPoint(anchor.x, anchor.y);
        target.addChild(sprite);
    },

    HSVfromRGB(rgbValue) {
        var out = new HSV();
        var min, max, delta;

        min = rgbValue.r < rgbValue.g ? rgbValue.r : rgbValue.g;
        min = min < rgbValue.b ? min : rgbValue.b;

        max = rgbValue.r > rgbValue.g ? rgbValue.r : rgbValue.g;
        max = max > rgbValue.b ? max : rgbValue.b;

        out.v = max;
        delta = max - min;
        if (delta < 0.00001) {
            out.s = 0;
            out.h = 0;
            return out;
        }
        if (max > 0.0) {
            out.s = (delta / max);
        } else {
            out.s = 0.0;
            out.h = 0;
            return out;
        }
        if (rgbValue.r >= max) {
            out.h = (rgbValue.g - rgbValue.b) / delta;
        } else if (rgbValue.g >= max) {
            out.h = 2.0 + (rgbValue.b - rgbValue.r) / delta;
        } else {
            out.h = 4.0 + (rgbValue.r - rgbValue.g) / delta;
        }
        out.h *= 60.0;
        if (out.h < 0.0) {
            out.h += 360.0;
        }
        return out;
    },

    RGBfromHSV(hsvValue) {
        var hh, p, q, t, ff;
        var i;
        var out = new RGBA();
        out.a = 1;

        if (hsvValue.s <= 0.0) {
            if (!hsvValue.h) {
                out.r = hsvValue.v;
                out.g = hsvValue.v;
                out.b = hsvValue.v;
                return out;
            }
            out.r = 0.0;
            out.g = 0.0;
            out.b = 0.0;
            return out;
        }
        hh = hsvValue.h;
        if (hh >= 360.0) {
            hh = 0.0;
        }
        hh /= 60.0;
        i = 0 | (hh);
        ff = hh - i;
        p = hsvValue.v * (1.0 - hsvValue.s);
        q = hsvValue.v * (1.0 - (hsvValue.s * ff));
        t = hsvValue.v * (1.0 - (hsvValue.s * (1.0 - ff)));

        switch (i) {
            case 0:
                out.r = hsvValue.v; out.g = t; out.b = p; break;
            case 1:
                out.r = q; out.g = hsvValue.v; out.b = p; break;
            case 2:
                out.r = p; out.g = hsvValue.v; out.b = t; break;
            case 3:
                out.r = p; out.g = q; out.b = hsvValue.v; break;
            case 4:
                out.r = t; out.g = p; out.b = hsvValue.v; break;
            case 5:
            default:
                out.r = hsvValue.v; out.g = p; out.b = q; break;
        }
        return out;
    },

    CCRectUnion(rect1, rect2) {
        return Rect.union(rect1, rect2);
    }
};
