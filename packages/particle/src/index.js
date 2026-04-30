import {
  Particle,
  ParticleModeA,
  ParticleModeB
} from "./particle-system/particle";
import {
  ParticleSystem,
  ParticleSystemModeA,
  ParticleSystemModeB
} from "./particle-system/particle-system";
import {
  ParticleBatchNode,
  PARTICLE_DEFAULT_CAPACITY
} from "./particle-batch-node";
import { ParticleSystemCanvasRenderCmd } from "./particle-system-canvas-render-cmd";
import { ParticleSystemWebGLRenderCmd } from "./particle-system-webgl-render-cmd";
import { ParticleBatchNodeCanvasRenderCmd } from "./particle-batch-node-canvas-render-cmd";
import { ParticleBatchNodeWebGLRenderCmd } from "./particle-batch-node-webgl-render-cmd";
import { PNGReader } from "./png-reader";
import { tiffReader } from "./tiff-reader";

ParticleSystem.ModeA = ParticleSystemModeA;
ParticleSystem.ModeB = ParticleSystemModeB;
ParticleSystem.CanvasRenderCmd = ParticleSystemCanvasRenderCmd;
ParticleSystem.WebGLRenderCmd = ParticleSystemWebGLRenderCmd;

ParticleBatchNode.CanvasRenderCmd = ParticleBatchNodeCanvasRenderCmd;
ParticleBatchNode.WebGLRenderCmd = ParticleBatchNodeWebGLRenderCmd;

cc.Particle = Particle;
cc.ParticleSystem = ParticleSystem;
cc.ParticleBatchNode = ParticleBatchNode;
cc.PARTICLE_DEFAULT_CAPACITY = PARTICLE_DEFAULT_CAPACITY;
cc.PNGReader = PNGReader;
cc.tiffReader = tiffReader;

export {
  Particle,
  ParticleModeA,
  ParticleModeB,
  ParticleSystem,
  ParticleSystemModeA,
  ParticleSystemModeB,
  ParticleSystemCanvasRenderCmd,
  ParticleSystemWebGLRenderCmd,
  ParticleBatchNode,
  ParticleBatchNodeCanvasRenderCmd,
  ParticleBatchNodeWebGLRenderCmd,
  PARTICLE_DEFAULT_CAPACITY,
  PNGReader,
  tiffReader
};
