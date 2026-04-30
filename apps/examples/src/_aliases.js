// Auto-generated. Provides script-scope aliases for cc.* engine APIs.
// Variables are var-hoisted so all subsequent files in the concat bundle see them.
// Actual values are wired in cc.game.onStart (see main.js) after engine init.

var
    ActionManager, AffineTransform, Animate, Animation, animationCache, AnimationFrame, Application, assert,
    associateWithNative, ATTRIBUTE_NAME_COLOR, ATTRIBUTE_NAME_POSITION, ATTRIBUTE_NAME_TEX_COORD, audio, base, bezierBy, BezierBy,
    bezierTo, BezierTo, blink, Blink, cadinalSplineBy, cadinalSplineTo, CallFunc, CardinalSplineBy,
    CatmullRomBy, CatmullRomTo, checkGLErrorDebug, ClippingNode, Color, colorToHex, contentScaleFactor, ControlButton,
    ControlColourPicker, CONTROL_EVENT_TOUCH_CANCEL, CONTROL_EVENT_TOUCH_DOWN, CONTROL_EVENT_TOUCH_DRAG_ENTER, CONTROL_EVENT_TOUCH_DRAG_EXIT, CONTROL_EVENT_TOUCH_DRAG_INSIDE, CONTROL_EVENT_TOUCH_DRAG_OUTSIDE, CONTROL_EVENT_TOUCH_UP_INSIDE,
    CONTROL_EVENT_TOUCH_UP_OUTSIDE, CONTROL_EVENT_VALUECHANGED, ControlPotentiometer, ControlSlider, CONTROL_STATE_HIGHLIGHTED, ControlStepper, ControlSwitch, CustomRenderCmdWebGL,
    degreesToRadians, DelayTime, Device, director, Director, _drawingUtil, DrawNode, DST_ALPHA,
    DST_COLOR, easeBackIn, easeBackInOut, easeBackOut, easeBezierAction, easeBounceIn, easeBounceInOut, easeBounceOut,
    easeCircleActionIn, easeCircleActionInOut, easeCircleActionOut, easeCubicActionIn, easeCubicActionInOut, easeCubicActionOut, easeElasticIn, easeElasticInOut,
    easeElasticOut, easeExponentialIn, easeExponentialInOut, easeExponentialOut, easeIn, easeInOut, easeOut, easeQuadraticActionIn,
    easeQuadraticActionInOut, easeQuadraticActionOut, easeQuarticActionIn, easeQuarticActionInOut, easeQuarticActionOut, easeQuinticActionIn, easeQuinticActionInOut, easeQuinticActionOut,
    easeSineIn, easeSineInOut, EaseSineInOutmove, easeSineOut, EditBox, EDITBOX_INPUT_FLAG_PASSWORD, EventCustom, EventKeyboard,
    EventListener, EventListenerTouchOneByOne, eventManager, EventMouse, fadeIn, FadeIn, fadeOut, FadeOut,
    fadeOutBLTiles, fadeOutDownTiles, fadeOutTRTiles, fadeOutUpTiles, FadeTo, FlipX, flipX3D, FlipY,
    flipY3D, Follow, FontDefinition, game, GLProgram, GLProgramState, glUseProgram, Hide,
    IMAGE_FORMAT_JPEG, IMAGE_FORMAT_PNG, inputManager, jumpBy, JumpBy, jumpTiles3D, jumpTo, JumpTo,
    kCCResolutioniPhoneRetinaDisplay, KEY, kmGLLoadMatrix, kmGLMatrixMode, KM_GL_MODELVIEW, kmGLPopMatrix, kmGLPushMatrix, Label,
    LabelAtlas, LabelAutomaticWidth, LabelBMFont, LabelTTF, LANGUAGE_CHINESE, Layer, LayerColor, LayerGradient,
    LayerMultiplex, lens3D, LINEAR, liquid, loader, LoaderScene, log, math,
    Menu, MenuItemFont, MenuItemImage, MenuItemLabel, MenuItemSprite, MenuItemToggle, MotionStreak, moveBy,
    MoveBy, moveTo, MoveTo, MutableArray, NewClass, Node, NodeGrid, ONE,
    ONE_MINUS_DST_ALPHA, ONE_MINUS_DST_COLOR, ONE_MINUS_SRC_ALPHA, ONE_MINUS_SRC_COLOR, ORIENTATION_LANDSCAPE, pageTurn3D, ParallaxNode, ParticleBatchNode,
    ParticleSystem, path, PhysicsDebugNode, PhysicsSprite, Place, Point, pool, progressFromTo,
    ProgressTimer, progressTo, radiansToDegrees, rand, randomMinus1To1, Rect, renderer, rendererConfig,
    RenderTexture, repeat, Repeat, REPEAT, repeatForever, RepeatForever, REPEAT_FOREVER, ResolutionPolicy,
    reuseGrid, ripple3D, rotateBy, RotateBy, rotateTo, RotateTo, Scale9Sprite, scaleBy,
    ScaleBy, scaleTo, ScaleTo, Scene, schedule, Scheduler, SCROLLVIEW_DIRECTION_HORIZONTAL, SCROLLVIEW_DIRECTION_VERTICAL,
    sequence, Sequence, shaderCache, SHADER_POSITION_TEXTURECOLORALPHATEST, shaky3D, shakyTiles3D, shatteredTiles3D, Show,
    shuffleTiles, Size, skewBy, SkewBy, skewTo, SkewTo, SocketIO, spawn,
    Spawn, Speed, splitCols, splitRows, Sprite, SpriteBatchNode, SPRITE_DEBUG_DRAW, SpriteFrame,
    spriteFrameCache, SpriteFrames, Sprites, SRC_ALPHA, SRC_COLOR, stopGrid, String, sys,
    TableView, TableViewCell, TABLEVIEW_FILL_TOPDOWN, TargetedAction, TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_LEFT, TEXT_ALIGNMENT_RIGHT, TextFieldTTF,
    Texture2D, TEXTURE_2D_PIXEL_FORMAT_RGBA4444, textureCache, TileMapAtlas, tintBy, TintBy, tintTo, TintTo,
    TMXTiledMap, TMX_TILE_HORIZONTAL_FLAG, TMX_TILE_VERTICAL_FLAG, ToggleVisibility, Touch, TransitionCrossFade, TransitionFade, TransitionFadeBL,
    TransitionFadeDown, TransitionFadeTR, TransitionFadeUp, TransitionFlipAngular, TransitionFlipX, TransitionFlipY, TransitionJumpZoom, TransitionMoveInB,
    TransitionMoveInL, TransitionMoveInR, TransitionMoveInT, TRANSITION_ORIENTATION_DOWN_OVER, TRANSITION_ORIENTATION_LEFT_OVER, TRANSITION_ORIENTATION_RIGHT_OVER, TRANSITION_ORIENTATION_UP_OVER, TransitionPageTurn,
    TransitionProgressHorizontal, TransitionProgressInOut, TransitionProgressOutIn, TransitionProgressRadialCCW, TransitionProgressRadialCW, TransitionProgressVertical, TransitionRotoZoom, TransitionShrinkGrow,
    TransitionSlideInB, TransitionSlideInL, TransitionSlideInR, TransitionSlideInT, TransitionSplitCols, TransitionSplitRows, TransitionTurnOffTiles, TransitionZoomFlipAngular,
    TransitionZoomFlipX, TransitionZoomFlipY, turnOffTiles, twirl, UNIFORM_ALPHA_TEST_VALUE_S, VERTEX_ATTRIB_COLOR, VERTEX_ATTRIB_POSITION, VERTEX_ATTRIB_TEX_COORDS,
    VERTICAL_TEXT_ALIGNMENT_BOTTOM, VERTICAL_TEXT_ALIGNMENT_CENTER, VERTICAL_TEXT_ALIGNMENT_TOP, view, visibleRect, waves, waves3D, wavesTiles3D,
    winSize, ZERO;

window._initCcAliases = function () {
    ActionManager = cc.ActionManager; AffineTransform = cc.AffineTransform; Animate = cc.Animate; Animation = cc.Animation; animationCache = cc.animationCache; AnimationFrame = cc.AnimationFrame; Application = cc.Application; assert = cc.assert;
    associateWithNative = cc.associateWithNative; ATTRIBUTE_NAME_COLOR = cc.ATTRIBUTE_NAME_COLOR; ATTRIBUTE_NAME_POSITION = cc.ATTRIBUTE_NAME_POSITION; ATTRIBUTE_NAME_TEX_COORD = cc.ATTRIBUTE_NAME_TEX_COORD; audio = cc.audio; base = cc.base; bezierBy = cc.bezierBy; BezierBy = cc.BezierBy;
    bezierTo = cc.bezierTo; BezierTo = cc.BezierTo; blink = cc.blink; Blink = cc.Blink; cadinalSplineBy = cc.cadinalSplineBy; cadinalSplineTo = cc.cadinalSplineTo; CallFunc = cc.CallFunc; CardinalSplineBy = cc.CardinalSplineBy;
    CatmullRomBy = cc.CatmullRomBy; CatmullRomTo = cc.CatmullRomTo; checkGLErrorDebug = cc.checkGLErrorDebug; ClippingNode = cc.ClippingNode; Color = cc.Color; colorToHex = cc.colorToHex; contentScaleFactor = cc.contentScaleFactor; ControlButton = cc.ControlButton;
    ControlColourPicker = cc.ControlColourPicker; CONTROL_EVENT_TOUCH_CANCEL = cc.CONTROL_EVENT_TOUCH_CANCEL; CONTROL_EVENT_TOUCH_DOWN = cc.CONTROL_EVENT_TOUCH_DOWN; CONTROL_EVENT_TOUCH_DRAG_ENTER = cc.CONTROL_EVENT_TOUCH_DRAG_ENTER; CONTROL_EVENT_TOUCH_DRAG_EXIT = cc.CONTROL_EVENT_TOUCH_DRAG_EXIT; CONTROL_EVENT_TOUCH_DRAG_INSIDE = cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE; CONTROL_EVENT_TOUCH_DRAG_OUTSIDE = cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE; CONTROL_EVENT_TOUCH_UP_INSIDE = cc.CONTROL_EVENT_TOUCH_UP_INSIDE;
    CONTROL_EVENT_TOUCH_UP_OUTSIDE = cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE; CONTROL_EVENT_VALUECHANGED = cc.CONTROL_EVENT_VALUECHANGED; ControlPotentiometer = cc.ControlPotentiometer; ControlSlider = cc.ControlSlider; CONTROL_STATE_HIGHLIGHTED = cc.CONTROL_STATE_HIGHLIGHTED; ControlStepper = cc.ControlStepper; ControlSwitch = cc.ControlSwitch; CustomRenderCmdWebGL = cc.CustomRenderCmdWebGL;
    degreesToRadians = cc.degreesToRadians; DelayTime = cc.DelayTime; Device = cc.Device; director = cc.director; Director = cc.Director; _drawingUtil = cc._drawingUtil; DrawNode = cc.DrawNode; DST_ALPHA = cc.DST_ALPHA;
    DST_COLOR = cc.DST_COLOR; easeBackIn = cc.easeBackIn; easeBackInOut = cc.easeBackInOut; easeBackOut = cc.easeBackOut; easeBezierAction = cc.easeBezierAction; easeBounceIn = cc.easeBounceIn; easeBounceInOut = cc.easeBounceInOut; easeBounceOut = cc.easeBounceOut;
    easeCircleActionIn = cc.easeCircleActionIn; easeCircleActionInOut = cc.easeCircleActionInOut; easeCircleActionOut = cc.easeCircleActionOut; easeCubicActionIn = cc.easeCubicActionIn; easeCubicActionInOut = cc.easeCubicActionInOut; easeCubicActionOut = cc.easeCubicActionOut; easeElasticIn = cc.easeElasticIn; easeElasticInOut = cc.easeElasticInOut;
    easeElasticOut = cc.easeElasticOut; easeExponentialIn = cc.easeExponentialIn; easeExponentialInOut = cc.easeExponentialInOut; easeExponentialOut = cc.easeExponentialOut; easeIn = cc.easeIn; easeInOut = cc.easeInOut; easeOut = cc.easeOut; easeQuadraticActionIn = cc.easeQuadraticActionIn;
    easeQuadraticActionInOut = cc.easeQuadraticActionInOut; easeQuadraticActionOut = cc.easeQuadraticActionOut; easeQuarticActionIn = cc.easeQuarticActionIn; easeQuarticActionInOut = cc.easeQuarticActionInOut; easeQuarticActionOut = cc.easeQuarticActionOut; easeQuinticActionIn = cc.easeQuinticActionIn; easeQuinticActionInOut = cc.easeQuinticActionInOut; easeQuinticActionOut = cc.easeQuinticActionOut;
    easeSineIn = cc.easeSineIn; easeSineInOut = cc.easeSineInOut; EaseSineInOutmove = cc.EaseSineInOutmove; easeSineOut = cc.easeSineOut; EditBox = cc.EditBox; EDITBOX_INPUT_FLAG_PASSWORD = cc.EDITBOX_INPUT_FLAG_PASSWORD; EventCustom = cc.EventCustom; EventKeyboard = cc.EventKeyboard;
    EventListener = cc.EventListener; EventListenerTouchOneByOne = cc.EventListenerTouchOneByOne; eventManager = cc.eventManager; EventMouse = cc.EventMouse; fadeIn = cc.fadeIn; FadeIn = cc.FadeIn; fadeOut = cc.fadeOut; FadeOut = cc.FadeOut;
    fadeOutBLTiles = cc.fadeOutBLTiles; fadeOutDownTiles = cc.fadeOutDownTiles; fadeOutTRTiles = cc.fadeOutTRTiles; fadeOutUpTiles = cc.fadeOutUpTiles; FadeTo = cc.FadeTo; FlipX = cc.FlipX; flipX3D = cc.flipX3D; FlipY = cc.FlipY;
    flipY3D = cc.flipY3D; Follow = cc.Follow; FontDefinition = cc.FontDefinition; game = cc.game; GLProgram = cc.GLProgram; GLProgramState = cc.GLProgramState; glUseProgram = cc.glUseProgram; Hide = cc.Hide;
    IMAGE_FORMAT_JPEG = cc.IMAGE_FORMAT_JPEG; IMAGE_FORMAT_PNG = cc.IMAGE_FORMAT_PNG; inputManager = cc.inputManager; jumpBy = cc.jumpBy; JumpBy = cc.JumpBy; jumpTiles3D = cc.jumpTiles3D; jumpTo = cc.jumpTo; JumpTo = cc.JumpTo;
    kCCResolutioniPhoneRetinaDisplay = cc.kCCResolutioniPhoneRetinaDisplay; KEY = cc.KEY; kmGLLoadMatrix = cc.kmGLLoadMatrix; kmGLMatrixMode = cc.kmGLMatrixMode; KM_GL_MODELVIEW = cc.KM_GL_MODELVIEW; kmGLPopMatrix = cc.kmGLPopMatrix; kmGLPushMatrix = cc.kmGLPushMatrix; Label = cc.Label;
    LabelAtlas = cc.LabelAtlas; LabelAutomaticWidth = cc.LabelAutomaticWidth; LabelBMFont = cc.LabelBMFont; LabelTTF = cc.LabelTTF; LANGUAGE_CHINESE = cc.LANGUAGE_CHINESE; Layer = cc.Layer; LayerColor = cc.LayerColor; LayerGradient = cc.LayerGradient;
    LayerMultiplex = cc.LayerMultiplex; lens3D = cc.lens3D; LINEAR = cc.LINEAR; liquid = cc.liquid; loader = cc.loader; LoaderScene = cc.LoaderScene; log = cc.log; math = cc.math;
    Menu = cc.Menu; MenuItemFont = cc.MenuItemFont; MenuItemImage = cc.MenuItemImage; MenuItemLabel = cc.MenuItemLabel; MenuItemSprite = cc.MenuItemSprite; MenuItemToggle = cc.MenuItemToggle; MotionStreak = cc.MotionStreak; moveBy = cc.moveBy;
    MoveBy = cc.MoveBy; moveTo = cc.moveTo; MoveTo = cc.MoveTo; MutableArray = cc.MutableArray; NewClass = cc.NewClass; Node = cc.Node; NodeGrid = cc.NodeGrid; ONE = cc.ONE;
    ONE_MINUS_DST_ALPHA = cc.ONE_MINUS_DST_ALPHA; ONE_MINUS_DST_COLOR = cc.ONE_MINUS_DST_COLOR; ONE_MINUS_SRC_ALPHA = cc.ONE_MINUS_SRC_ALPHA; ONE_MINUS_SRC_COLOR = cc.ONE_MINUS_SRC_COLOR; ORIENTATION_LANDSCAPE = cc.ORIENTATION_LANDSCAPE; pageTurn3D = cc.pageTurn3D; ParallaxNode = cc.ParallaxNode; ParticleBatchNode = cc.ParticleBatchNode;
    ParticleSystem = cc.ParticleSystem; path = cc.path; PhysicsDebugNode = cc.PhysicsDebugNode; PhysicsSprite = cc.PhysicsSprite; Place = cc.Place; Point = cc.Point; pool = cc.pool; progressFromTo = cc.progressFromTo;
    ProgressTimer = cc.ProgressTimer; progressTo = cc.progressTo; radiansToDegrees = cc.radiansToDegrees; rand = cc.rand; randomMinus1To1 = cc.randomMinus1To1; Rect = cc.Rect; renderer = cc.renderer; rendererConfig = cc.rendererConfig;
    RenderTexture = cc.RenderTexture; repeat = cc.repeat; Repeat = cc.Repeat; REPEAT = cc.REPEAT; repeatForever = cc.repeatForever; RepeatForever = cc.RepeatForever; REPEAT_FOREVER = cc.REPEAT_FOREVER; ResolutionPolicy = cc.ResolutionPolicy;
    reuseGrid = cc.reuseGrid; ripple3D = cc.ripple3D; rotateBy = cc.rotateBy; RotateBy = cc.RotateBy; rotateTo = cc.rotateTo; RotateTo = cc.RotateTo; Scale9Sprite = cc.Scale9Sprite; scaleBy = cc.scaleBy;
    ScaleBy = cc.ScaleBy; scaleTo = cc.scaleTo; ScaleTo = cc.ScaleTo; Scene = cc.Scene; schedule = cc.schedule; Scheduler = cc.Scheduler; SCROLLVIEW_DIRECTION_HORIZONTAL = cc.SCROLLVIEW_DIRECTION_HORIZONTAL; SCROLLVIEW_DIRECTION_VERTICAL = cc.SCROLLVIEW_DIRECTION_VERTICAL;
    sequence = cc.sequence; Sequence = cc.Sequence; shaderCache = cc.shaderCache; SHADER_POSITION_TEXTURECOLORALPHATEST = cc.SHADER_POSITION_TEXTURECOLORALPHATEST; shaky3D = cc.shaky3D; shakyTiles3D = cc.shakyTiles3D; shatteredTiles3D = cc.shatteredTiles3D; Show = cc.Show;
    shuffleTiles = cc.shuffleTiles; Size = cc.Size; skewBy = cc.skewBy; SkewBy = cc.SkewBy; skewTo = cc.skewTo; SkewTo = cc.SkewTo; SocketIO = cc.SocketIO; spawn = cc.spawn;
    Spawn = cc.Spawn; Speed = cc.Speed; splitCols = cc.splitCols; splitRows = cc.splitRows; Sprite = cc.Sprite; SpriteBatchNode = cc.SpriteBatchNode; SPRITE_DEBUG_DRAW = cc.SPRITE_DEBUG_DRAW; SpriteFrame = cc.SpriteFrame;
    spriteFrameCache = cc.spriteFrameCache; SpriteFrames = cc.SpriteFrames; Sprites = cc.Sprites; SRC_ALPHA = cc.SRC_ALPHA; SRC_COLOR = cc.SRC_COLOR; stopGrid = cc.stopGrid; String = cc.String; sys = cc.sys;
    TableView = cc.TableView; TableViewCell = cc.TableViewCell; TABLEVIEW_FILL_TOPDOWN = cc.TABLEVIEW_FILL_TOPDOWN; TargetedAction = cc.TargetedAction; TEXT_ALIGNMENT_CENTER = cc.TEXT_ALIGNMENT_CENTER; TEXT_ALIGNMENT_LEFT = cc.TEXT_ALIGNMENT_LEFT; TEXT_ALIGNMENT_RIGHT = cc.TEXT_ALIGNMENT_RIGHT; TextFieldTTF = cc.TextFieldTTF;
    Texture2D = cc.Texture2D; TEXTURE_2D_PIXEL_FORMAT_RGBA4444 = cc.TEXTURE_2D_PIXEL_FORMAT_RGBA4444; textureCache = cc.textureCache; TileMapAtlas = cc.TileMapAtlas; tintBy = cc.tintBy; TintBy = cc.TintBy; tintTo = cc.tintTo; TintTo = cc.TintTo;
    TMXTiledMap = cc.TMXTiledMap; TMX_TILE_HORIZONTAL_FLAG = cc.TMX_TILE_HORIZONTAL_FLAG; TMX_TILE_VERTICAL_FLAG = cc.TMX_TILE_VERTICAL_FLAG; ToggleVisibility = cc.ToggleVisibility; Touch = cc.Touch; TransitionCrossFade = cc.TransitionCrossFade; TransitionFade = cc.TransitionFade; TransitionFadeBL = cc.TransitionFadeBL;
    TransitionFadeDown = cc.TransitionFadeDown; TransitionFadeTR = cc.TransitionFadeTR; TransitionFadeUp = cc.TransitionFadeUp; TransitionFlipAngular = cc.TransitionFlipAngular; TransitionFlipX = cc.TransitionFlipX; TransitionFlipY = cc.TransitionFlipY; TransitionJumpZoom = cc.TransitionJumpZoom; TransitionMoveInB = cc.TransitionMoveInB;
    TransitionMoveInL = cc.TransitionMoveInL; TransitionMoveInR = cc.TransitionMoveInR; TransitionMoveInT = cc.TransitionMoveInT; TRANSITION_ORIENTATION_DOWN_OVER = cc.TRANSITION_ORIENTATION_DOWN_OVER; TRANSITION_ORIENTATION_LEFT_OVER = cc.TRANSITION_ORIENTATION_LEFT_OVER; TRANSITION_ORIENTATION_RIGHT_OVER = cc.TRANSITION_ORIENTATION_RIGHT_OVER; TRANSITION_ORIENTATION_UP_OVER = cc.TRANSITION_ORIENTATION_UP_OVER; TransitionPageTurn = cc.TransitionPageTurn;
    TransitionProgressHorizontal = cc.TransitionProgressHorizontal; TransitionProgressInOut = cc.TransitionProgressInOut; TransitionProgressOutIn = cc.TransitionProgressOutIn; TransitionProgressRadialCCW = cc.TransitionProgressRadialCCW; TransitionProgressRadialCW = cc.TransitionProgressRadialCW; TransitionProgressVertical = cc.TransitionProgressVertical; TransitionRotoZoom = cc.TransitionRotoZoom; TransitionShrinkGrow = cc.TransitionShrinkGrow;
    TransitionSlideInB = cc.TransitionSlideInB; TransitionSlideInL = cc.TransitionSlideInL; TransitionSlideInR = cc.TransitionSlideInR; TransitionSlideInT = cc.TransitionSlideInT; TransitionSplitCols = cc.TransitionSplitCols; TransitionSplitRows = cc.TransitionSplitRows; TransitionTurnOffTiles = cc.TransitionTurnOffTiles; TransitionZoomFlipAngular = cc.TransitionZoomFlipAngular;
    TransitionZoomFlipX = cc.TransitionZoomFlipX; TransitionZoomFlipY = cc.TransitionZoomFlipY; turnOffTiles = cc.turnOffTiles; twirl = cc.twirl; UNIFORM_ALPHA_TEST_VALUE_S = cc.UNIFORM_ALPHA_TEST_VALUE_S; VERTEX_ATTRIB_COLOR = cc.VERTEX_ATTRIB_COLOR; VERTEX_ATTRIB_POSITION = cc.VERTEX_ATTRIB_POSITION; VERTEX_ATTRIB_TEX_COORDS = cc.VERTEX_ATTRIB_TEX_COORDS;
    VERTICAL_TEXT_ALIGNMENT_BOTTOM = cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM; VERTICAL_TEXT_ALIGNMENT_CENTER = cc.VERTICAL_TEXT_ALIGNMENT_CENTER; VERTICAL_TEXT_ALIGNMENT_TOP = cc.VERTICAL_TEXT_ALIGNMENT_TOP; view = cc.view; visibleRect = cc.visibleRect; waves = cc.waves; waves3D = cc.waves3D; wavesTiles3D = cc.wavesTiles3D;
    winSize = cc.winSize; ZERO = cc.ZERO;
};
