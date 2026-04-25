import { ProgressTimer } from "./progress-timer";
import { ProgressTimerCanvasRenderCmd } from "./progress-timer-canvas-render-cmd";
import { ProgressTimerWebGLRenderCmd } from "./progress-timer-webgl-render-cmd";
import { ProgressTo } from "./action-progress-timer/progress-to";
import { ProgressFromTo } from "./action-progress-timer/progress-from-to";
import { TYPE_RADIAL, TYPE_BAR, TEXTURE_COORDS_COUNT, TEXTURE_COORDS } from "./constants";

// Wire render commands
ProgressTimer.CanvasRenderCmd = ProgressTimerCanvasRenderCmd;
ProgressTimer.WebGLRenderCmd = ProgressTimerWebGLRenderCmd;

// Wire static constants
ProgressTimer.TYPE_RADIAL = TYPE_RADIAL;
ProgressTimer.TYPE_BAR = TYPE_BAR;
ProgressTimer.TEXTURE_COORDS_COUNT = TEXTURE_COORDS_COUNT;
ProgressTimer.TEXTURE_COORDS = TEXTURE_COORDS;

// cc globals
cc.ProgressTimer = ProgressTimer;
cc.ProgressTo = ProgressTo;
cc.ProgressFromTo = ProgressFromTo;
cc.progressTo = (duration, percent) => new ProgressTo(duration, percent);
cc.progressFromTo = (duration, fromPercentage, toPercentage) => new ProgressFromTo(duration, fromPercentage, toPercentage);

export {
    ProgressTimer,
    ProgressTimerCanvasRenderCmd,
    ProgressTimerWebGLRenderCmd,
    ProgressTo,
    ProgressFromTo,
    TYPE_RADIAL,
    TYPE_BAR,
    TEXTURE_COORDS_COUNT,
    TEXTURE_COORDS
};
