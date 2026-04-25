import { PhysicsSprite } from "./physics-sprite";
import { PhysicsDebugNode, drawShape, drawConstraint, colorForBody, convertVerts, CONSTRAINT_COLOR } from "./physics-debug-node";
import { PhysicsDebugNodeCanvasRenderCmd } from "./physics-debug-node-canvas-render-cmd";
import { PhysicsDebugNodeWebGLRenderCmd } from "./physics-debug-node-webgl-render-cmd";
import { PhysicsSpriteCanvasRenderCmd } from "./physics-sprite-canvas-render-cmd";
import { PhysicsSpriteWebGLRenderCmd } from "./physics-sprite-webgl-render-cmd";

// Wire up render cmds as static properties
PhysicsSprite.CanvasRenderCmd = PhysicsSpriteCanvasRenderCmd;
PhysicsSprite.WebGLRenderCmd = PhysicsSpriteWebGLRenderCmd;

PhysicsDebugNode.CanvasRenderCmd = PhysicsDebugNodeCanvasRenderCmd;
PhysicsDebugNode.WebGLRenderCmd = PhysicsDebugNodeWebGLRenderCmd;

// cc globals
cc.PhysicsSprite = PhysicsSprite;
cc.PhysicsDebugNode = PhysicsDebugNode;
cc.__convertVerts = convertVerts;
cc.ColorForBody = colorForBody;
cc.DrawShape = drawShape;
cc.DrawConstraint = drawConstraint;
cc.CONSTRAINT_COLOR = CONSTRAINT_COLOR;

export { PhysicsSprite, PhysicsDebugNode };
