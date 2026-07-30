import { LabelTTF } from "./label-ttf";
import {
  _textAlign,
  _textBaseline,
  wrapInspection,
  _wordRex,
  _symbolRex,
  _lastWordRex,
  _lastEnglish,
  _firsrEnglish,
  LabelRenderMixin,
  CacheLabelRenderMixin,
  CacheCanvasRenderCmd,
  CanvasRenderCmd,
} from "./label-ttf-canvas-render-cmd";
import { WebGLRenderCmd } from "./label-ttf-webgl-render-cmd";

LabelTTF.wrapInspection = wrapInspection;
LabelTTF._wordRex = _wordRex;
LabelTTF._symbolRex = _symbolRex;
LabelTTF._lastWordRex = _lastWordRex;
LabelTTF._lastEnglish = _lastEnglish;
LabelTTF._firsrEnglish = _firsrEnglish;
LabelTTF.CacheCanvasRenderCmd = CacheCanvasRenderCmd;
LabelTTF.CanvasRenderCmd = CanvasRenderCmd;
LabelTTF.WebGLRenderCmd = WebGLRenderCmd;

export {
  _textAlign,
  _textBaseline,
  wrapInspection,
  _wordRex,
  _symbolRex,
  _lastWordRex,
  _lastEnglish,
  _firsrEnglish,
  LabelTTF,
  LabelRenderMixin,
  CacheLabelRenderMixin,
  CacheCanvasRenderCmd,
  CanvasRenderCmd,
  WebGLRenderCmd,
};
