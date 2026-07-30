import { AtlasNode } from "./atlas-node";
import { AtlasNodeCanvasRenderCmd } from "./atlas-node-canvas-render-cmd";
import { AtlasNodeWebGLRenderCmd } from "./atlas-node-webgl-render-cmd";

AtlasNode.CanvasRenderCmd = AtlasNodeCanvasRenderCmd;
AtlasNode.WebGLRenderCmd = AtlasNodeWebGLRenderCmd;

export { AtlasNode, AtlasNodeCanvasRenderCmd, AtlasNodeWebGLRenderCmd };
