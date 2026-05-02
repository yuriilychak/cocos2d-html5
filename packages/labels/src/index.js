import { LabelBMFont, Label } from "./label-bmfont";
import { LabelBMFontCanvasRenderCmd } from "./label-bmfont-canvas-render-cmd";
import { LabelBMFontWebGLRenderCmd } from "./label-bmfont-webgl-render-cmd";
import { LabelAtlas } from "./label-atlas";
import { LabelAtlasCanvasRenderCmd } from "./label-atlas-canvas-render-cmd";
import { LabelAtlasWebGLRenderCmd } from "./label-atlas-webgl-render-cmd";

export const LabelAutomaticWidth = -1;

LabelBMFont.CanvasRenderCmd = LabelBMFontCanvasRenderCmd;
LabelBMFont.WebGLRenderCmd = LabelBMFontWebGLRenderCmd;

LabelAtlas.CanvasRenderCmd = LabelAtlasCanvasRenderCmd;
LabelAtlas.WebGLRenderCmd = LabelAtlasWebGLRenderCmd;

export { LabelBMFont, LabelAtlas, Label };
