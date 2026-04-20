export default class TextureAtlasWebGLRenderer {
  constructor(textureAtlas) {
    this._textureAtlas = textureAtlas;
  }

  setupVBO() {
    var textureAtlas = this._textureAtlas;
    var gl = cc._renderContext;
    //create WebGLBuffer
    textureAtlas._buffersVBO[0] = gl.createBuffer();
    textureAtlas._buffersVBO[1] = gl.createBuffer();

    textureAtlas._quadsWebBuffer = gl.createBuffer();
    this.mapBuffers();
  }

  mapBuffers() {
    var textureAtlas = this._textureAtlas;
    var gl = cc._renderContext;

    gl.bindBuffer(gl.ARRAY_BUFFER, textureAtlas._quadsWebBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureAtlas._quadsArrayBuffer, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureAtlas._buffersVBO[1]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, textureAtlas._indices, gl.STATIC_DRAW);

    //cc.checkGLErrorDebug();
  }

  /**
   * <p>Draws n quads from an index (offset). <br />
   * n + start can't be greater than the capacity of the atlas</p>
   * @param {Number} n
   * @param {Number} start
   */
  drawNumberOfQuads(n, start) {
    var textureAtlas = this._textureAtlas;
    start = start || 0;
    if (0 === n || !textureAtlas.texture || !textureAtlas.texture.isLoaded()) return;

    var gl = cc._renderContext;
    cc.glBindTexture2D(textureAtlas.texture);

    //
    // Using VBO without VAO
    //
    //vertices
    //gl.bindBuffer(gl.ARRAY_BUFFER, textureAtlas._buffersVBO[0]);
    // XXX: update is done in draw... perhaps it should be done in a timer

    gl.bindBuffer(gl.ARRAY_BUFFER, textureAtlas._quadsWebBuffer);
    if (textureAtlas.dirty) {
      gl.bufferData(gl.ARRAY_BUFFER, textureAtlas._quadsArrayBuffer, gl.DYNAMIC_DRAW);
      textureAtlas.dirty = false;
    }

    gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
    gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
    gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS);

    gl.vertexAttribPointer(
      cc.VERTEX_ATTRIB_POSITION,
      3,
      gl.FLOAT,
      false,
      24,
      0
    ); // vertices
    gl.vertexAttribPointer(
      cc.VERTEX_ATTRIB_COLOR,
      4,
      gl.UNSIGNED_BYTE,
      true,
      24,
      12
    ); // colors
    gl.vertexAttribPointer(
      cc.VERTEX_ATTRIB_TEX_COORDS,
      2,
      gl.FLOAT,
      false,
      24,
      16
    ); // tex coords

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, textureAtlas._buffersVBO[1]);

    if (cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP)
      gl.drawElements(
        gl.TRIANGLE_STRIP,
        n * 6,
        gl.UNSIGNED_SHORT,
        start * 6 * textureAtlas._indices.BYTES_PER_ELEMENT
      );
    else
      gl.drawElements(
        gl.TRIANGLES,
        n * 6,
        gl.UNSIGNED_SHORT,
        start * 6 * textureAtlas._indices.BYTES_PER_ELEMENT
      );

    cc.g_NumberOfDraws++;
    //cc.checkGLErrorDebug();
  }

  releaseBuffer() {
    var textureAtlas = this._textureAtlas;
    var gl = cc._renderContext;
    if (textureAtlas._buffersVBO) {
      if (textureAtlas._buffersVBO[0]) gl.deleteBuffer(textureAtlas._buffersVBO[0]);
      if (textureAtlas._buffersVBO[1]) gl.deleteBuffer(textureAtlas._buffersVBO[1]);
    }
    if (textureAtlas._quadsWebBuffer) gl.deleteBuffer(textureAtlas._quadsWebBuffer);
  }
}