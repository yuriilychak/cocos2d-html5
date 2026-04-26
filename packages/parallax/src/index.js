import { PointObject } from "./point-object";
import { ParallaxNode } from "./parallax-node";
import { ParallaxNodeCanvasRenderCmd } from "./parallax-node-canvas-render-cmd";
import { ParallaxNodeWebGLRenderCmd } from "./parallax-node-webgl-render-cmd";

// Wire render commands to the main class
ParallaxNode.CanvasRenderCmd = ParallaxNodeCanvasRenderCmd;
ParallaxNode.WebGLRenderCmd = ParallaxNodeWebGLRenderCmd;

// cc globals (backward compatibility)
cc.PointObject = PointObject;
cc.ParallaxNode = ParallaxNode;

// ES module exports
export { 
    PointObject, 
    ParallaxNode, 
    ParallaxNodeCanvasRenderCmd, 
    ParallaxNodeWebGLRenderCmd 
};