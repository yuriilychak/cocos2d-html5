/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import {
  CCTransitionCrossFade,
  CCTransitionRadialCCW,
  CCTransitionRadialCW,
  FadeBLTransition,
  FadeDownTransition,
  FadeTRTransition,
  FadeTransition,
  FadeUpTransition,
  FadeWhiteTransition,
  JumpZoomTransition,
  MoveInBTransition,
  MoveInLTransition,
  MoveInRTransition,
  MoveInTTransition,
  PageTransitionBackward,
  PageTransitionForward,
  RotoZoomTransition,
  ShrinkGrowTransition,
  SlideInBTransition,
  SlideInLTransition,
  SlideInRTransition,
  SlideInTTransition,
  SplitColsTransition,
  SplitRowsTransition,
  TurnOffTilesTransition
} from "./transitions-test-helpers";
import { TransitionProgressHorizontal, TransitionProgressInOut, TransitionProgressOutIn, TransitionProgressRadialCCW, TransitionProgressRadialCW, TransitionProgressVertical } from "@aspect/transitions";

export var TRANSITION_DURATION = 1.2;

export var arrayOfTransitionsTest = [
  {
    title: "JumpZoomTransition",
    transitionFunc: function (t, s) {
      return new JumpZoomTransition(t, s);
    }
  },

  {
    title: "TransitionProgressRadialCCW",
    transitionFunc: function (t, s) {
      return new TransitionProgressRadialCCW(t, s);
    }
  },

  {
    title: "TransitionProgressRadialCW",
    transitionFunc: function (t, s) {
      return new TransitionProgressRadialCW(t, s);
    }
  },

  {
    title: "TransitionProgressHorizontal",
    transitionFunc: function (t, s) {
      return new TransitionProgressHorizontal(t, s);
    }
  },

  {
    title: "TransitionProgressVertical",
    transitionFunc: function (t, s) {
      return new TransitionProgressVertical(t, s);
    }
  },

  {
    title: "TransitionProgressInOut",
    transitionFunc: function (t, s) {
      return new TransitionProgressInOut(t, s);
    }
  },

  {
    title: "TransitionProgressOutIn",
    transitionFunc: function (t, s) {
      return new TransitionProgressOutIn(t, s);
    }
  },

  //ok
  {
    title: "FadeTransition",
    transitionFunc: function (t, s) {
      return FadeTransition(t, s);
    }
  },
  {
    title: "FadeWhiteTransition",
    transitionFunc: function (t, s) {
      return FadeWhiteTransition(t, s);
    }
  },

  {
    title: "ShrinkGrowTransition",
    transitionFunc: function (t, s) {
      return ShrinkGrowTransition(t, s);
    }
  },
  {
    title: "RotoZoomTransition",
    transitionFunc: function (t, s) {
      return RotoZoomTransition(t, s);
    }
  },
  {
    title: "MoveInLTransition",
    transitionFunc: function (t, s) {
      return MoveInLTransition(t, s);
    }
  },
  {
    title: "MoveInRTransition",
    transitionFunc: function (t, s) {
      return MoveInRTransition(t, s);
    }
  },
  {
    title: "MoveInTTransition",
    transitionFunc: function (t, s) {
      return MoveInTTransition(t, s);
    }
  },
  {
    title: "MoveInBTransition",
    transitionFunc: function (t, s) {
      return MoveInBTransition(t, s);
    }
  },
  {
    title: "SlideInLTransition",
    transitionFunc: function (t, s) {
      return SlideInLTransition(t, s);
    }
  },
  {
    title: "SlideInRTransition",
    transitionFunc: function (t, s) {
      return SlideInRTransition(t, s);
    }
  },
  {
    title: "SlideInTTransition",
    transitionFunc: function (t, s) {
      return SlideInTTransition(t, s);
    }
  },
  {
    title: "SlideInBTransition",
    transitionFunc: function (t, s) {
      return SlideInBTransition(t, s);
    }
  },
  {
    title: "CCTransitionRadialCCW",
    transitionFunc: function (t, s) {
      return CCTransitionRadialCCW(t, s);
    }
  },
  {
    title: "CCTransitionRadialCW",
    transitionFunc: function (t, s) {
      return CCTransitionRadialCW(t, s);
    }
  }
];

if (!cc.rendererConfig.isCanvas) {
  arrayOfTransitionsTest = arrayOfTransitionsTest.concat([
    {
      title: "PageTransitionForward",
      transitionFunc: function (t, s) {
        return PageTransitionForward(t, s);
      }
    },
    {
      title: "PageTransitionBackward",
      transitionFunc: function (t, s) {
        return PageTransitionBackward(t, s);
      }
    },
    {
      title: "FadeTRTransition",
      transitionFunc: function (t, s) {
        return FadeTRTransition(t, s);
      }
    },
    {
      title: "FadeBLTransition",
      transitionFunc: function (t, s) {
        return FadeBLTransition(t, s);
      }
    },
    {
      title: "FadeUpTransition",
      transitionFunc: function (t, s) {
        return FadeUpTransition(t, s);
      }
    },
    {
      title: "FadeDownTransition",
      transitionFunc: function (t, s) {
        return FadeDownTransition(t, s);
      }
    },
    {
      title: "TurnOffTilesTransition",
      transitionFunc: function (t, s) {
        return TurnOffTilesTransition(t, s);
      }
    },
    {
      title: "SplitRowsTransition",
      transitionFunc: function (t, s) {
        return SplitRowsTransition(t, s);
      }
    },
    {
      title: "CCTransitionCrossFade",
      transitionFunc: function (t, s) {
        return CCTransitionCrossFade(t, s);
      }
    },
    {
      title: "SplitColsTransition",
      transitionFunc: function (t, s) {
        return SplitColsTransition(t, s);
      }
    }
  ]);
}

export let transitionsIdx = 0;

export function _settransitionsIdx(v) {
  transitionsIdx = v;
}
