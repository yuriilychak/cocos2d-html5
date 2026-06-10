import Matrix4 from "../mat4";
import Vec3 from "../vec3";
import Matrix4Stack from "./mat4-stack";
import { degreesToRadians } from "../../platform/macro/utils";
import { ServiceLocator } from "../../service-locator";

export class KMGLMatrix {
  static KM_GL_MODELVIEW = 0x1700;
  static KM_GL_PROJECTION = 0x1701;
  static KM_GL_TEXTURE = 0x1702;

  static _instance = null;

  static getInstance() {
    if (!KMGLMatrix._instance) {
      KMGLMatrix._instance = new KMGLMatrix();
    }
    return KMGLMatrix._instance;
  }

  modelViewStack = new Matrix4Stack();
  projectionStack = new Matrix4Stack();
  textureStack = new Matrix4Stack();
  currentStack = null;
  _initialized = false;
  tmpMatrix = new Matrix4();
  tmpVector = new Vec3();

  lazyInitialize() {
    if (this._initialized) return;

    const identity = new Matrix4();
    this.modelViewStack.initialize();
    this.projectionStack.initialize();
    this.textureStack.initialize();
    this.currentStack = this.modelViewStack;
    this._initialized = true;
    identity.identity();
    this.modelViewStack.push(identity);
    this.projectionStack.push(identity);
    this.textureStack.push(identity);
  }

  freeAll() {
    this.modelViewStack.release();
    this.modelViewStack = null;
    this.projectionStack.release();
    this.projectionStack = null;
    this.textureStack.release();
    this.textureStack = null;
    this._initialized = false;
    this.currentStack = null;
  }

  pushMatrix() {
    this.currentStack.push(this.currentStack.top);
  }

  pushMatrixWithMat4(saveMat) {
    this.currentStack.stack.push(this.currentStack.top);
    saveMat.assignFrom(this.currentStack.top);
    this.currentStack.top = saveMat;
  }

  popMatrix() {
    this.currentStack.top = this.currentStack.stack.pop();
  }

  matrixMode(mode) {
    switch (mode) {
      case KMGLMatrix.KM_GL_MODELVIEW:
        this.currentStack = this.modelViewStack;
        break;
      case KMGLMatrix.KM_GL_PROJECTION:
        this.currentStack = this.projectionStack;
        break;
      case KMGLMatrix.KM_GL_TEXTURE:
        this.currentStack = this.textureStack;
        break;
      default:
        throw new Error("Invalid matrix mode specified");
    }
    this.currentStack.lastUpdated = ServiceLocator.director.getTotalFrames();
  }

  loadIdentity() {
    this.currentStack.top.identity();
  }

  loadMatrix(pIn) {
    this.currentStack.top.assignFrom(pIn);
  }

  multMatrix(pIn) {
    this.currentStack.top.multiply(pIn);
  }

  translatef(x, y, z) {
    const translation = Matrix4.createByTranslation(x, y, z, this.tmpMatrix);
    this.currentStack.top.multiply(translation);
  }

  rotatef(angle, x, y, z) {
    this.tmpVector.fill(x, y, z);
    const rotation = Matrix4.createByAxisAndAngle(
      this.tmpVector,
      degreesToRadians(angle),
      this.tmpMatrix
    );
    this.currentStack.top.multiply(rotation);
  }

  scalef(x, y, z) {
    const scaling = Matrix4.createByScale(x, y, z, this.tmpMatrix);
    this.currentStack.top.multiply(scaling);
  }

  getMatrix(mode, pOut) {
    switch (mode) {
      case KMGLMatrix.KM_GL_MODELVIEW:
        pOut.assignFrom(this.modelViewStack.top);
        break;
      case KMGLMatrix.KM_GL_PROJECTION:
        pOut.assignFrom(this.projectionStack.top);
        break;
      case KMGLMatrix.KM_GL_TEXTURE:
        pOut.assignFrom(this.textureStack.top);
        break;
      default:
        throw new Error("Invalid matrix mode specified");
    }
  }
}

export const { KM_GL_MODELVIEW, KM_GL_PROJECTION, KM_GL_TEXTURE } = KMGLMatrix;
