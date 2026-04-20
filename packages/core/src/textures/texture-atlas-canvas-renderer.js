export default class TextureAtlasCanvasRenderer {
  constructor(textureAtlas) {
    this._textureAtlas = textureAtlas;
  }

  setupVBO() {
    // Canvas rendering doesn't use VBOs - no-op
  }

  mapBuffers() {
    // Canvas rendering doesn't use buffers - no-op  
  }

  /**
   * Canvas rendering doesn't use quad-based drawing - no-op
   * @param {Number} n
   * @param {Number} start
   */
  drawNumberOfQuads(n, start) {
    // Canvas rendering doesn't use this method - no-op
  }

  releaseBuffer() {
    // Canvas rendering doesn't have GL buffers to release - no-op
  }
}