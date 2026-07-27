import {
  Node,
  Point,
  BlendFunc,
  isString,
  vertexLineToPolygon,
  log,
  ServiceLocator
} from "@aspect/core";

/**
 * MotionStreak manages a Ribbon based on it's motion in absolute space.
 * @property {Texture2D} texture                         - Texture used for the motion streak.
 * @property {Boolean}   fastMode                        - Indicate whether use fast mode.
 * @property {Boolean}   startingPositionInitialized     - Indicate whether starting position initialized.
 * @example
 * new MotionStreak(2, 3, 32, Color.GREEN, s_streak);
 */
export class MotionStreak extends Node {
  #positionR = new Point();
  #texture = null;
  #fastMode = true;
  #startingPositionInitialized = false;

  #blendFunc = BlendFunc.ALPHA_NON_PREMULTIPLIED;
  #stroke = 0;
  #fadeDelta = 0;
  #minSeg = 0;
  #maxPoints = 0;
  #nuPoints = 0;
  #previousNuPoints = 0;

  /* Pointers */
  #pointVertexes = null;
  #pointState = null;

  // webgl
  #vertices = null;
  #colorPointer = null;
  #texCoords = null;

  #verticesBuffer = null;
  #colorPointerBuffer = null;
  #texCoordsBuffer = null;
  _className = "MotionStreak";

  constructor(fade, minSeg, stroke, color, texture) {
    super();
    if (isString(texture))
      texture = ServiceLocator.textureCache.addImage(texture);

    this.position = new Point();
    this.anchorX = 0;
    this.anchorY = 0;
    this.ignoreAnchor = true;
    this.#minSeg = minSeg === -1.0 ? stroke / 5.0 : minSeg;
    this.#minSeg *= this.#minSeg;

    this.#stroke = stroke;
    this.#fadeDelta = 1.0 / fade;

    var locMaxPoints = (0 | (fade * 60)) + 2;
    this.#maxPoints = locMaxPoints;
    this.#pointState = new Float32Array(locMaxPoints);
    this.#pointVertexes = new Float32Array(locMaxPoints * 2);

    this.#vertices = new Float32Array(locMaxPoints * 4);
    this.#texCoords = new Float32Array(locMaxPoints * 4);
    this.#colorPointer = new Uint8Array(locMaxPoints * 8);

    this.#verticesBuffer = gl.createBuffer();
    this.#texCoordsBuffer = gl.createBuffer();
    this.#colorPointerBuffer = gl.createBuffer();
    this.#texture = texture;
    this.color = color;
    this.scheduleUpdate();

    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.#vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.#texCoords, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#colorPointerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.#colorPointer, gl.DYNAMIC_DRAW);
  }

  get texture() {
    return this.#texture;
  }

  set texture(texture) {
    if (this.#texture !== texture) {
      this.#texture = texture;
    }
  }

  get src() {
    return this.#blendFunc.src;
  }

  set src(value) {
    this.#blendFunc.src = value;
  }

  get dst() {
    return this.#blendFunc.dst;
  }

  set dst(value) {
    this.#blendFunc.dst = value;
  }

  get opacity() {
    log("MotionStreak.opacity has not been supported.");
    return 0;
  }

  set opacity(value) {
    log("MotionStreak.opacity has not been supported.");
  }

  set isOpacityModifyRGB(value) {}

  get isOpacityModifyRGB() {
    return false;
  }

  get fastMode() {
    return this.#fastMode;
  }

  set fastMode(fastMode) {
    this.#fastMode = fastMode;
  }

  get startingPositionInitialized() {
    return this.#startingPositionInitialized;
  }

  set startingPositionInitialized(v) {
    this.#startingPositionInitialized = v;
  }

  get stroke() {
    return this.#stroke;
  }

  set stroke(stroke) {
    this.#stroke = stroke;
  }

  get pointCount() {
    return this.#nuPoints;
  }

  get renderData() {
    return {
      vertices: this.#vertices,
      texCoords: this.#texCoords,
      colorPointer: this.#colorPointer,
      verticesBuffer: this.#verticesBuffer,
      texCoordsBuffer: this.#texCoordsBuffer,
      colorPointerBuffer: this.#colorPointerBuffer
    };
  }

  tintWithColor(color) {
    this.color = color;
    var locColorPointer = this.#colorPointer;
    for (var i = 0, len = this.#nuPoints * 2; i < len; i++) {
      locColorPointer[i * 4] = color.r;
      locColorPointer[i * 4 + 1] = color.g;
      locColorPointer[i * 4 + 2] = color.b;
    }
  }

  reset() {
    this.#nuPoints = 0;
  }

  get position() {
    return this.#positionR.clone();
  }

  set position(position) {
    this.startingPositionInitialized = true;
    this.#positionR.set(position);
  }

  get x() {
    return this.#positionR.x;
  }

  set x(x) {
    this.#positionR.x = x;
    if (!this.#startingPositionInitialized)
      this.#startingPositionInitialized = true;
  }

  get y() {
    return this.#positionR.y;
  }

  set y(y) {
    this.#positionR.y = y;
    if (!this.#startingPositionInitialized)
      this.#startingPositionInitialized = true;
  }

  update(delta) {
    if (!this.#startingPositionInitialized) return;

    this._renderCmd._updateDisplayColor();

    delta *= this.#fadeDelta;

    var i, newIdx, newIdx2, i2;
    var mov = 0;

    var locNuPoints = this.#nuPoints;
    var locPointState = this.#pointState,
      locPointVertexes = this.#pointVertexes,
      locVertices = this.#vertices;
    var locColorPointer = this.#colorPointer;

    for (i = 0; i < locNuPoints; i++) {
      locPointState[i] -= delta;

      if (locPointState[i] <= 0) {
        mov++;
      } else {
        newIdx = i - mov;
        if (mov > 0) {
          locPointState[newIdx] = locPointState[i];
          locPointVertexes[newIdx * 2] = locPointVertexes[i * 2];
          locPointVertexes[newIdx * 2 + 1] = locPointVertexes[i * 2 + 1];

          i2 = i * 2;
          newIdx2 = newIdx * 2;
          locVertices[newIdx2 * 2] = locVertices[i2 * 2];
          locVertices[newIdx2 * 2 + 1] = locVertices[i2 * 2 + 1];
          locVertices[(newIdx2 + 1) * 2] = locVertices[(i2 + 1) * 2];
          locVertices[(newIdx2 + 1) * 2 + 1] = locVertices[(i2 + 1) * 2 + 1];

          i2 *= 4;
          newIdx2 *= 4;
          locColorPointer[newIdx2 + 0] = locColorPointer[i2 + 0];
          locColorPointer[newIdx2 + 1] = locColorPointer[i2 + 1];
          locColorPointer[newIdx2 + 2] = locColorPointer[i2 + 2];
          locColorPointer[newIdx2 + 4] = locColorPointer[i2 + 4];
          locColorPointer[newIdx2 + 5] = locColorPointer[i2 + 5];
          locColorPointer[newIdx2 + 6] = locColorPointer[i2 + 6];
        } else {
          newIdx2 = newIdx * 8;
        }

        var op = locPointState[newIdx] * 255.0;
        locColorPointer[newIdx2 + 3] = op;
        locColorPointer[newIdx2 + 7] = op;
      }
    }
    locNuPoints -= mov;

    var appendNewPoint = true;
    if (locNuPoints >= this.#maxPoints) {
      appendNewPoint = false;
    } else if (locNuPoints > 0) {
      var a1 =
        Point.distanceSQ(
          new Point(
            locPointVertexes[(locNuPoints - 1) * 2],
            locPointVertexes[(locNuPoints - 1) * 2 + 1]
          ),
          this.#positionR
        ) < this.#minSeg;
      var a2 =
        locNuPoints === 1
          ? false
          : Point.distanceSQ(
              new Point(
                locPointVertexes[(locNuPoints - 2) * 2],
                locPointVertexes[(locNuPoints - 2) * 2 + 1]
              ),
              this.#positionR
            ) <
            this.#minSeg * 2.0;
      if (a1 || a2) appendNewPoint = false;
    }

    if (appendNewPoint) {
      locPointVertexes[locNuPoints * 2] = this.#positionR.x;
      locPointVertexes[locNuPoints * 2 + 1] = this.#positionR.y;
      locPointState[locNuPoints] = 1.0;

      var offset = locNuPoints * 8;
      var locDisplayedColor = this.getDisplayedColor();
      locColorPointer[offset] = locDisplayedColor.r;
      locColorPointer[offset + 1] = locDisplayedColor.g;
      locColorPointer[offset + 2] = locDisplayedColor.b;
      locColorPointer[offset + 4] = locDisplayedColor.r;
      locColorPointer[offset + 5] = locDisplayedColor.g;
      locColorPointer[offset + 6] = locDisplayedColor.b;
      locColorPointer[offset + 3] = 255;
      locColorPointer[offset + 7] = 255;

      if (locNuPoints > 0 && this.#fastMode) {
        if (locNuPoints > 1)
          vertexLineToPolygon(
            locPointVertexes,
            this.#stroke,
            this.#vertices,
            locNuPoints,
            1
          );
        else
          vertexLineToPolygon(
            locPointVertexes,
            this.#stroke,
            this.#vertices,
            0,
            2
          );
      }
      locNuPoints++;
    }

    if (!this.#fastMode)
      vertexLineToPolygon(
        locPointVertexes,
        this.#stroke,
        this.#vertices,
        0,
        locNuPoints
      );

    if (locNuPoints && this.#previousNuPoints !== locNuPoints) {
      var texDelta = 1.0 / locNuPoints;
      var locTexCoords = this.#texCoords;
      for (i = 0; i < locNuPoints; i++) {
        locTexCoords[i * 4] = 0;
        locTexCoords[i * 4 + 1] = texDelta * i;
        locTexCoords[(i * 2 + 1) * 2] = 1;
        locTexCoords[(i * 2 + 1) * 2 + 1] = texDelta * i;
      }
      this.#previousNuPoints = locNuPoints;
    }

    this.#nuPoints = locNuPoints;
  }

  _createRenderCmd() {
    return ServiceLocator.sys.rendererConfig.isWebGL
      ? new MotionStreak.WebGLRenderCmd(this)
      : null; // MotionStreak doesn't support Canvas mode
  }
}
