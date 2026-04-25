import { SCENE_FADE, ADJUST_FACTOR, TRANSITION_ORIENTATION_LEFT_OVER, TRANSITION_ORIENTATION_RIGHT_OVER, TRANSITION_ORIENTATION_UP_OVER, TRANSITION_ORIENTATION_DOWN_OVER } from "./transition/constants";
import { TransitionScene } from "./transition/transition-scene";
import { TransitionSceneOriented } from "./transition/transition-scene-oriented";
import { TransitionRotoZoom } from "./transition/transition-roto-zoom";
import { TransitionJumpZoom } from "./transition/transition-jump-zoom";
import { TransitionMoveInL } from "./transition/transition-move-in-l";
import { TransitionMoveInR } from "./transition/transition-move-in-r";
import { TransitionMoveInT } from "./transition/transition-move-in-t";
import { TransitionMoveInB } from "./transition/transition-move-in-b";
import { TransitionSlideInL } from "./transition/transition-slide-in-l";
import { TransitionSlideInR } from "./transition/transition-slide-in-r";
import { TransitionSlideInB } from "./transition/transition-slide-in-b";
import { TransitionSlideInT } from "./transition/transition-slide-in-t";
import { TransitionShrinkGrow } from "./transition/transition-shrink-grow";
import { TransitionFade } from "./transition/transition-fade";
import { TransitionCrossFade } from "./transition/transition-cross-fade";
import { TransitionTurnOffTiles } from "./transition/transition-turn-off-tiles";
import { TransitionSplitCols } from "./transition/transition-split-cols";
import { TransitionSplitRows } from "./transition/transition-split-rows";
import { TransitionFadeTR } from "./transition/transition-fade-tr";
import { TransitionFadeBL } from "./transition/transition-fade-bl";
import { TransitionFadeUp } from "./transition/transition-fade-up";
import { TransitionFadeDown } from "./transition/transition-fade-down";

import { SCENE_RADIAL } from "./transition-progress/constants";
import { TransitionProgress } from "./transition-progress/transition-progress";
import { TransitionProgressRadialCCW } from "./transition-progress/transition-progress-radial-ccw";
import { TransitionProgressRadialCW } from "./transition-progress/transition-progress-radial-cw";
import { TransitionProgressHorizontal } from "./transition-progress/transition-progress-horizontal";
import { TransitionProgressVertical } from "./transition-progress/transition-progress-vertical";
import { TransitionProgressInOut } from "./transition-progress/transition-progress-in-out";
import { TransitionProgressOutIn } from "./transition-progress/transition-progress-out-in";

import { TransitionPageTurn } from "./transition-page-turn";

// cc globals - constants
cc.SCENE_FADE = SCENE_FADE;
cc.SCENE_RADIAL = SCENE_RADIAL;
cc.ADJUST_FACTOR = ADJUST_FACTOR;
cc.TRANSITION_ORIENTATION_LEFT_OVER = TRANSITION_ORIENTATION_LEFT_OVER;
cc.TRANSITION_ORIENTATION_RIGHT_OVER = TRANSITION_ORIENTATION_RIGHT_OVER;
cc.TRANSITION_ORIENTATION_UP_OVER = TRANSITION_ORIENTATION_UP_OVER;
cc.TRANSITION_ORIENTATION_DOWN_OVER = TRANSITION_ORIENTATION_DOWN_OVER;

// cc globals - classes
cc.TransitionScene = TransitionScene;
cc.TransitionSceneOriented = TransitionSceneOriented;
cc.TransitionRotoZoom = TransitionRotoZoom;
cc.TransitionJumpZoom = TransitionJumpZoom;
cc.TransitionMoveInL = TransitionMoveInL;
cc.TransitionMoveInR = TransitionMoveInR;
cc.TransitionMoveInT = TransitionMoveInT;
cc.TransitionMoveInB = TransitionMoveInB;
cc.TransitionSlideInL = TransitionSlideInL;
cc.TransitionSlideInR = TransitionSlideInR;
cc.TransitionSlideInB = TransitionSlideInB;
cc.TransitionSlideInT = TransitionSlideInT;
cc.TransitionShrinkGrow = TransitionShrinkGrow;
cc.TransitionFade = TransitionFade;
cc.TransitionCrossFade = TransitionCrossFade;
cc.TransitionTurnOffTiles = TransitionTurnOffTiles;
cc.TransitionSplitCols = TransitionSplitCols;
cc.TransitionSplitRows = TransitionSplitRows;
cc.TransitionFadeTR = TransitionFadeTR;
cc.TransitionFadeBL = TransitionFadeBL;
cc.TransitionFadeUp = TransitionFadeUp;
cc.TransitionFadeDown = TransitionFadeDown;
cc.TransitionProgress = TransitionProgress;
cc.TransitionProgressRadialCCW = TransitionProgressRadialCCW;
cc.TransitionProgressRadialCW = TransitionProgressRadialCW;
cc.TransitionProgressHorizontal = TransitionProgressHorizontal;
cc.TransitionProgressVertical = TransitionProgressVertical;
cc.TransitionProgressInOut = TransitionProgressInOut;
cc.TransitionProgressOutIn = TransitionProgressOutIn;
cc.TransitionPageTurn = TransitionPageTurn;

export {
    SCENE_FADE,
    SCENE_RADIAL,
    ADJUST_FACTOR,
    TRANSITION_ORIENTATION_LEFT_OVER,
    TRANSITION_ORIENTATION_RIGHT_OVER,
    TRANSITION_ORIENTATION_UP_OVER,
    TRANSITION_ORIENTATION_DOWN_OVER,
    TransitionScene,
    TransitionSceneOriented,
    TransitionRotoZoom,
    TransitionJumpZoom,
    TransitionMoveInL,
    TransitionMoveInR,
    TransitionMoveInT,
    TransitionMoveInB,
    TransitionSlideInL,
    TransitionSlideInR,
    TransitionSlideInB,
    TransitionSlideInT,
    TransitionShrinkGrow,
    TransitionFade,
    TransitionCrossFade,
    TransitionTurnOffTiles,
    TransitionSplitCols,
    TransitionSplitRows,
    TransitionFadeTR,
    TransitionFadeBL,
    TransitionFadeUp,
    TransitionFadeDown,
    TransitionProgress,
    TransitionProgressRadialCCW,
    TransitionProgressRadialCW,
    TransitionProgressHorizontal,
    TransitionProgressVertical,
    TransitionProgressInOut,
    TransitionProgressOutIn,
    TransitionPageTurn,
};
