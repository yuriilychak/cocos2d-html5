import { LabelBMFont, Label } from "./label-bmfont";
import { LabelBMFontCanvasRenderCmd } from "./label-bmfont-canvas-render-cmd";
import { LabelBMFontWebGLRenderCmd } from "./label-bmfont-webgl-render-cmd";
import { LabelAtlas } from "./label-atlas";
import { LabelAtlasCanvasRenderCmd } from "./label-atlas-canvas-render-cmd";
import { LabelAtlasWebGLRenderCmd } from "./label-atlas-webgl-render-cmd";

export const LabelAutomaticWidth = -1;

cc.LabelBMFont = LabelBMFont;
cc.LabelBMFont.CanvasRenderCmd = LabelBMFontCanvasRenderCmd;
cc.LabelBMFont.WebGLRenderCmd = LabelBMFontWebGLRenderCmd;

cc.LabelAtlas = LabelAtlas;
cc.LabelAtlas.CanvasRenderCmd = LabelAtlasCanvasRenderCmd;
cc.LabelAtlas.WebGLRenderCmd = LabelAtlasWebGLRenderCmd;

cc.Label = Label;
cc.LabelAutomaticWidth = LabelAutomaticWidth;

export { LabelBMFont, LabelAtlas, Label };
