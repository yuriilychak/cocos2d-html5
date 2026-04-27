import {
  Node,
  Point,
  BlendFunc,
  SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA,
  isString,
  vertexLineToPolygon,
  RendererConfig,
  Color,
  log
} from "@aspect/core";

/**
 * cc.MotionStreak manages a Ribbon based on it's motion in absolute space.
 * @property {Texture2D} texture                         - Texture used for the motion streak.
 * @property {Boolean}   fastMode                        - Indicate whether use fast mode.
 * @property {Boolean}   startingPositionInitialized     - Indicate whether starting position initialized.
 * @example
 * new MotionStreak(2, 3, 32, Color.GREEN, s_streak);
 */
export class MotionStreak extends Node {
  texture = null;
  fastMode = false;
  startingPositionInitialized = false;

  _blendFunc = null;
  _stroke = 0;
  _fadeDelta = 0;
  _minSeg = 0;
  _maxPoints = 0;
  _nuPoints = 0;
  _previousNuPoints = 0;

  /* Pointers */
  _pointVertexes = null;
  _pointState = null;

  // webgl
  _vertices = null;
  _colorPointer = null;
  _texCoords = null;

  _verticesBuffer = null;
  _colorPointerBuffer = null;
  _texCoordsBuffer = null;
  _className = "MotionStreak";

  constructor(fade, minSeg, stroke, color, texture) {
    super();
    this._positionR = new Point(0, 0);
    this._blendFunc = new BlendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA);

    this.fastMode = false;
    this.startingPositionInitialized = false;
    this.texture = null;
    this._stroke = 0;
    this._fadeDelta = 0;
    this._minSeg = 0;
    this._maxPoints = 0;
    this._nuPoints = 0;
    this._previousNuPoints = 0;
    this._pointVertexes = null;
    this._pointState = null;
    this._vertices = null;
    this._colorPointer = null;
    this._texCoords = null;
    this._verticesBuffer = null;
    this._colorPointerBuffer = null;
    this._texCoordsBuffer = null;

    if (texture !== undefined)
      this.initWithFade(fade, minSeg, stroke, color, texture);
  }

  getTexture() {
    return this.texture;
  }

  setTexture(texture) {
    if (this.texture !== texture) this.texture = texture;
  }

  getBlendFunc() {
    return this._blendFunc;
  }

  setBlendFunc(src, dst) {
    if (dst === undefined) {
      this._blendFunc = src;
    } else {
      this._blendFunc.src = src;
      this._blendFunc.dst = dst;
    }
  }

  getOpacity() {
    log("cc.MotionStreak.getOpacity has not been supported.");
    return 0;
  }

  setOpacity(opacity) {
    log("cc.MotionStreak.setOpacity has not been supported.");
  }

  setOpacityModifyRGB(value) {}
  isOpacityModifyRGB() {
    return false;
  }
  isFastMode() {
    return this.fastMode;
  }
  setFastMode(fastMode) {
    this.fastMode = fastMode;
  }
  isStartingPositionInitialized() {
    return this.startingPositionInitialized;
  }
  setStartingPositionInitialized(v) {
    this.startingPositionInitialized = v;
  }
  getStroke() {
    return this._stroke;
  }
  setStroke(stroke) {
    this._stroke = stroke;
  }

  initWithFade(fade, minSeg, stroke, color, texture) {
    if (!texture)
      throw new Error(
        "cc.MotionStreak.initWithFade(): Invalid filename or texture"
      );

    if (isString(texture)) texture = cc.textureCache.addImage(texture);

    super.setPosition(new Point(0, 0));
    this.anchorX = 0;
    this.anchorY = 0;
    this.ignoreAnchor = true;
    this.startingPositionInitialized = false;

    this.fastMode = true;
    this._minSeg = minSeg === -1.0 ? stroke / 5.0 : minSeg;
    this._minSeg *= this._minSeg;

    this._stroke = stroke;
    this._fadeDelta = 1.0 / fade;

    var locMaxPoints = (0 | (fade * 60)) + 2;
    this._maxPoints = locMaxPoints;
    this._nuPoints = 0;
    this._pointState = new Float32Array(locMaxPoints);
    this._pointVertexes = new Float32Array(locMaxPoints * 2);

    this._vertices = new Float32Array(locMaxPoints * 4);
    this._texCoords = new Float32Array(locMaxPoints * 4);
    this._colorPointer = new Uint8Array(locMaxPoints * 8);

    this._verticesBuffer = gl.createBuffer();
    this._texCoordsBuffer = gl.createBuffer();
    this._colorPointerBuffer = gl.createBuffer();

    // Set blend mode
    this._blendFunc.src = gl.SRC_ALPHA;
    this._blendFunc.dst = gl.ONE_MINUS_SRC_ALPHA;

    this.texture = texture;
    this.color = color;
    this.scheduleUpdate();

    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._texCoords, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorPointerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._colorPointer, gl.DYNAMIC_DRAW);

    return true;
  }

  tintWithColor(color) {
    this.color = color;
    var locColorPointer = this._colorPointer;
    for (var i = 0, len = this._nuPoints * 2; i < len; i++) {
      locColorPointer[i * 4] = color.r;
      locColorPointer[i * 4 + 1] = color.g;
      locColorPointer[i * 4 + 2] = color.b;
    }
  }

  reset() {
    this._nuPoints = 0;
  }

  setPosition(position, yValue) {
    this.startingPositionInitialized = true;
    if (yValue === undefined) {
      this._positionR.x = position.x;
      this._positionR.y = position.y;
    } else {
      this._positionR.x = position;
      this._positionR.y = yValue;
    }
  }

  getPositionX() {
    return this._positionR.x;
  }

  setPositionX(x) {
    this._positionR.x = x;
    if (!this.startingPositionInitialized)
      this.startingPositionInitialized = true;
  }

  getPositionY() {
    return this._positionR.y;
  }

  setPositionY(y) {
    this._positionR.y = y;
    if (!this.startingPositionInitialized)
      this.startingPositionInitialized = true;
  }

  update(delta) {
    if (!this.startingPositionInitialized) return;

    this._renderCmd._updateDisplayColor();

    delta *= this._fadeDelta;

    var i, newIdx, newIdx2, i2;
    var mov = 0;

    var locNuPoints = this._nuPoints;
    var locPointState = this._pointState,
      locPointVertexes = this._pointVertexes,
      locVertices = this._vertices;
    var locColorPointer = this._colorPointer;

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
    if (locNuPoints >= this._maxPoints) {
      appendNewPoint = false;
    } else if (locNuPoints > 0) {
      var a1 =
        Point.distanceSQ(
          new Point(
            locPointVertexes[(locNuPoints - 1) * 2],
            locPointVertexes[(locNuPoints - 1) * 2 + 1]
          ),
          this._positionR
        ) < this._minSeg;
      var a2 =
        locNuPoints === 1
          ? false
          : Point.distanceSQ(
              new Point(
                locPointVertexes[(locNuPoints - 2) * 2],
                locPointVertexes[(locNuPoints - 2) * 2 + 1]
              ),
              this._positionR
            ) <
            this._minSeg * 2.0;
      if (a1 || a2) appendNewPoint = false;
    }

    if (appendNewPoint) {
      locPointVertexes[locNuPoints * 2] = this._positionR.x;
      locPointVertexes[locNuPoints * 2 + 1] = this._positionR.y;
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

      if (locNuPoints > 0 && this.fastMode) {
        if (locNuPoints > 1)
          vertexLineToPolygon(
            locPointVertexes,
            this._stroke,
            this._vertices,
            locNuPoints,
            1
          );
        else
          vertexLineToPolygon(
            locPointVertexes,
            this._stroke,
            this._vertices,
            0,
            2
          );
      }
      locNuPoints++;
    }

    if (!this.fastMode)
      vertexLineToPolygon(
        locPointVertexes,
        this._stroke,
        this._vertices,
        0,
        locNuPoints
      );

    if (locNuPoints && this._previousNuPoints !== locNuPoints) {
      var texDelta = 1.0 / locNuPoints;
      var locTexCoords = this._texCoords;
      for (i = 0; i < locNuPoints; i++) {
        locTexCoords[i * 4] = 0;
        locTexCoords[i * 4 + 1] = texDelta * i;
        locTexCoords[(i * 2 + 1) * 2] = 1;
        locTexCoords[(i * 2 + 1) * 2 + 1] = texDelta * i;
      }
      this._previousNuPoints = locNuPoints;
    }

    this._nuPoints = locNuPoints;
  }

  _createRenderCmd() {
    if (RendererConfig.getInstance().isWebGL)
      return new MotionStreak.WebGLRenderCmd(this);
    else return null; // MotionStreak doesn't support Canvas mode
  }
}
