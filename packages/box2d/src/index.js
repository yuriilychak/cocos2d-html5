import Box2DFactory from "box2d-wasm";

/**
 * Initialise Box2D (downloads Box2D.wasm) and return the module instance.
 * Also exposes it on `window.Box2D` so code can access types like `Box2D.b2Vec2`.
 *
 * @param {object} [options] - Options forwarded to the Box2DFactory, e.g.
 *   `{ locateFile: (url, dir) => '/static/' + url }` to control where
 *   Box2D.wasm is fetched from.
 * @returns {Promise<typeof Box2D & EmscriptenModule>}
 */
export async function initBox2D(options = {}) {
  const box2D = await Box2DFactory(options);
  if (typeof window !== "undefined") {
    window.Box2D = box2D;
  }
  return box2D;
}

// Auto-start loading Box2D WASM as soon as the bundle is evaluated.
// window.Box2DReady resolves to the box2D module instance.
if (typeof window !== "undefined") {
  window.Box2DReady = initBox2D();
}

export { Box2DFactory };
export default Box2DFactory;
