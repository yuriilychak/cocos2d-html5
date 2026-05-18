import RAPIER from "@dimforge/rapier2d-compat";
import { RapierWorld } from "./rapier-world";
import { RapierPhysicsSprite } from "./rapier-physics-sprite";
import { RapierDebugNode } from "./rapier-debug-node";

/**
 * Initialises the Rapier WASM module and exposes the API as window.RAPIER.
 * Assigned to window.RapierReady so callers can await it:
 *
 *   await window.RapierReady;
 *   const world = new RapierWorld({ x: 0, y: -100 });
 */
async function initRapier() {
  await RAPIER.init();
  if (typeof window !== "undefined") {
    window.RAPIER = RAPIER;
  }
  return RAPIER;
}

if (typeof window !== "undefined") {
  window.RapierReady = initRapier();
}

export { RAPIER, RapierWorld, RapierPhysicsSprite, RapierDebugNode, initRapier };
