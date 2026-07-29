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

  set opacityModifyRGB(value) {}

  get opacityModifyRGB() {
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
    const len = this.#nuPoints * 2;
    for (var i = 0; i < len; ++i) {
      this.#colorPointer[i * 4] = color.r;
      this.#colorPointer[i * 4 + 1] = color.g;
      this.#colorPointer[i * 4 + 2] = color.b;
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
    if (!this.#startingPositionInitialized) {
      return;
    }

    this._renderCmd._updateDisplayColor();

    delta *= this.#fadeDelta;

    var i, newIdx, newIdx2, i2;
    var mov = 0;

    for (i = 0; i < this.#nuPoints; i++) {
      this.#pointState[i] -= delta;

      if (this.#pointState[i] <= 0) {
        mov++;
      } else {
        newIdx = i - mov;
        if (mov > 0) {
          this.#pointState[newIdx] = this.#pointState[i];
          this.#pointVertexes[newIdx * 2] = this.#pointVertexes[i * 2];
          this.#pointVertexes[newIdx * 2 + 1] = this.#pointVertexes[i * 2 + 1];

          i2 = i * 2;
          newIdx2 = newIdx * 2;
          this.#vertices[newIdx2 * 2] = this.#vertices[i2 * 2];
          this.#vertices[newIdx2 * 2 + 1] = this.#vertices[i2 * 2 + 1];
          this.#vertices[(newIdx2 + 1) * 2] = this.#vertices[(i2 + 1) * 2];
          this.#vertices[(newIdx2 + 1) * 2 + 1] = this.#vertices[(i2 + 1) * 2 + 1];

          i2 *= 4;
          newIdx2 *= 4;
          this.#colorPointer[newIdx2 + 0] = this.#colorPointer[i2 + 0];
          this.#colorPointer[newIdx2 + 1] = this.#colorPointer[i2 + 1];
          this.#colorPointer[newIdx2 + 2] = this.#colorPointer[i2 + 2];
          this.#colorPointer[newIdx2 + 4] = this.#colorPointer[i2 + 4];
          this.#colorPointer[newIdx2 + 5] = this.#colorPointer[i2 + 5];
          this.#colorPointer[newIdx2 + 6] = this.#colorPointer[i2 + 6];
        } else {
          newIdx2 = newIdx * 8;
        }

        var op = this.#pointState[newIdx] * 255.0;
        this.#colorPointer[newIdx2 + 3] = op;
        this.#colorPointer[newIdx2 + 7] = op;
      }
    }
    this.#nuPoints -= mov;

    var appendNewPoint = true;
    if (this.#nuPoints >= this.#maxPoints) {
      appendNewPoint = false;
    } else if (this.#nuPoints > 0) {
      var a1 =
        Point.distanceSQ(
          new Point(
            this.#pointVertexes[(this.#nuPoints - 1) * 2],
            this.#pointVertexes[(this.#nuPoints - 1) * 2 + 1]
          ),
          this.#positionR
        ) < this.#minSeg;
      var a2 =
        this.#nuPoints === 1
          ? false
          : Point.distanceSQ(
              new Point(
                this.#pointVertexes[(this.#nuPoints - 2) * 2],
                this.#pointVertexes[(this.#nuPoints - 2) * 2 + 1]
              ),
              this.#positionR
            ) <
            this.#minSeg * 2.0;
      if (a1 || a2) appendNewPoint = false;
    }

    if (appendNewPoint) {
      this.#pointVertexes[this.#nuPoints * 2] = this.#positionR.x;
      this.#pointVertexes[this.#nuPoints * 2 + 1] = this.#positionR.y;
      this.#pointState[this.#nuPoints] = 1.0;

      var offset = this.#nuPoints * 8;
      var locDisplayedColor = this.displayedColor;
      this.#colorPointer[offset] = locDisplayedColor.r;
      this.#colorPointer[offset + 1] = locDisplayedColor.g;
      this.#colorPointer[offset + 2] = locDisplayedColor.b;
      this.#colorPointer[offset + 4] = locDisplayedColor.r;
      this.#colorPointer[offset + 5] = locDisplayedColor.g;
      this.#colorPointer[offset + 6] = locDisplayedColor.b;
      this.#colorPointer[offset + 3] = 255;
      this.#colorPointer[offset + 7] = 255;

      if (this.#nuPoints > 0 && this.#fastMode) {
        if (this.#nuPoints > 1)
          vertexLineToPolygon(
            this.#pointVertexes,
            this.#stroke,
            this.#vertices,
            this.#nuPoints,
            1
          );
        else
          vertexLineToPolygon(
            this.#pointVertexes,
            this.#stroke,
            this.#vertices,
            0,
            2
          );
      }
      this.#nuPoints++;
    }

    if (!this.#fastMode)
      vertexLineToPolygon(
        this.#pointVertexes,
        this.#stroke,
        this.#vertices,
        0,
        this.#nuPoints
      );

    if (this.#nuPoints && this.#previousNuPoints !== this.#nuPoints) {
      var texDelta = 1.0 / this.#nuPoints;
      var locTexCoords = this.#texCoords;
      for (i = 0; i < this.#nuPoints; i++) {
        locTexCoords[i * 4] = 0;
        locTexCoords[i * 4 + 1] = texDelta * i;
        locTexCoords[(i * 2 + 1) * 2] = 1;
        locTexCoords[(i * 2 + 1) * 2 + 1] = texDelta * i;
      }
      this.#previousNuPoints = this.#nuPoints;
    }

    this.#nuPoints = this.#nuPoints;
  }

  _createRenderCmd() {
    return ServiceLocator.sys.rendererConfig.isWebGL
      ? new MotionStreak.WebGLRenderCmd(this)
      : null; // MotionStreak doesn't support Canvas mode
  }
}
