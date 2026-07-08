import Matrix4 from "./mat4";
import Vec3 from "./vec3";
import Matrix4Stack from "./mat4-stack";
import { degreesToRadians } from "../platform/macro/utils";
import { DirectorProjection } from "../enums";
import { log, _LogInfos } from "../boot/debugger";
import type { EGLViewLike } from "../platform/egl-view/types";
import type { Mat4Like } from "./types";

interface DirectorLike {
  getTotalFrames(): number;
}

export class KMGLMatrix {
  public static KM_GL_MODELVIEW = 0x1700;
  public static KM_GL_PROJECTION = 0x1701;
  public static KM_GL_TEXTURE = 0x1702;


  public modelViewStack: Matrix4Stack | null = new Matrix4Stack();
  public projectionStack: Matrix4Stack | null = new Matrix4Stack();
  public textureStack: Matrix4Stack | null = new Matrix4Stack();
  public currentStack: Matrix4Stack | null = null;
  public _initialized = false;
  public tmpMatrix = new Matrix4();
  public tmpVector = new Vec3();
  public _director: DirectorLike | null = null;

  public injectServices({ director }: { director: DirectorLike }): void {
    this._director = director;
  }

  public lazyInitialize(): void {
    if (this._initialized) return;

    const identity = new Matrix4();
    this.modelViewStack = this.modelViewStack || new Matrix4Stack();
    this.projectionStack = this.projectionStack || new Matrix4Stack();
    this.textureStack = this.textureStack || new Matrix4Stack();
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

  public freeAll(): void {
    this.modelViewStack!.release();
    this.modelViewStack = null;
    this.projectionStack!.release();
    this.projectionStack = null;
    this.textureStack!.release();
    this.textureStack = null;
    this._initialized = false;
    this.currentStack = null;
  }

  public pushMatrix(): void {
    this.currentStack!.push(this.currentStack!.top);
  }

  public pushMatrixWithMat4(saveMat: Matrix4): void {
    this.currentStack!.push(this.currentStack!.top);
    saveMat.assignFrom(this.currentStack!.top!);
    this.currentStack!.top = saveMat;
  }

  public popMatrix(): void {
    this.currentStack!.pop();
  }

  public matrixMode(mode: number): void {
    switch (mode) {
      case KMGLMatrix.KM_GL_MODELVIEW:
        this.currentStack = this.modelViewStack!;
        break;
      case KMGLMatrix.KM_GL_PROJECTION:
        this.currentStack = this.projectionStack!;
        break;
      case KMGLMatrix.KM_GL_TEXTURE:
        this.currentStack = this.textureStack!;
        break;
      default:
        throw new Error("Invalid matrix mode specified");
    }
    this.currentStack.lastUpdated = this._director!.getTotalFrames();
  }

  public loadIdentity(): void {
    this.currentStack!.top!.identity();
  }

  public loadMatrix(pIn: Mat4Like): void {
    this.currentStack!.top!.assignFrom(pIn);
  }

  public multMatrix(pIn: Mat4Like): void {
    this.currentStack!.top!.multiply(pIn);
  }

  public setDirectorProjection(
    projection: DirectorProjection,
    eglView: EGLViewLike
  ): void {
    const size = eglView.winSizeInPoints;

    switch (projection) {
      case DirectorProjection.TWO_D:
        this.matrixMode(KMGLMatrix.KM_GL_PROJECTION);
        this.loadIdentity();
        this.multMatrix(
          Matrix4.createOrthographicProjection(
            0,
            size.width,
            0,
            size.height,
            -1024,
            1024
          )
        );
        this.matrixMode(KMGLMatrix.KM_GL_MODELVIEW);
        this.loadIdentity();
        break;
      case DirectorProjection.THREE_D: {
        this.matrixMode(KMGLMatrix.KM_GL_PROJECTION);
        this.loadIdentity();

        const zEye = eglView.zEye;
        const viewPortOrigin = eglView.viewPortOriginInPoints;

        this.multMatrix(
          Matrix4.createPerspectiveProjection(
            60,
            size.width / size.height,
            0.1,
            zEye * 2
          )!
        );

        const eye = new Vec3(
          -viewPortOrigin.x + size.width / 2,
          -viewPortOrigin.y + size.height / 2,
          zEye
        );
        const center = new Vec3(
          -viewPortOrigin.x + size.width / 2,
          -viewPortOrigin.y + size.height / 2,
          0.0
        );
        const up = new Vec3(0.0, 1.0, 0.0);
        this.multMatrix(new Matrix4().lookAt(eye, center, up));

        this.matrixMode(KMGLMatrix.KM_GL_MODELVIEW);
        this.loadIdentity();
        break;
      }
      default:
        log(_LogInfos.Director_setProjection);
        break;
    }
  }

  public translatef(x: number, y: number, z: number): void {
    const translation = Matrix4.createByTranslation(x, y, z, this.tmpMatrix);
    this.currentStack!.top!.multiply(translation);
  }

  public rotatef(angle: number, x: number, y: number, z: number): void {
    this.tmpVector.fill(x, y, z);
    const rotation = Matrix4.createByAxisAndAngle(
      this.tmpVector,
      degreesToRadians(angle),
      this.tmpMatrix
    );
    this.currentStack!.top!.multiply(rotation);
  }

  public scalef(x: number, y: number, z: number): void {
    const scaling = Matrix4.createByScale(x, y, z, this.tmpMatrix);
    this.currentStack!.top!.multiply(scaling);
  }

  public getMatrix(mode: number, pOut: Matrix4): void {
    switch (mode) {
      case KMGLMatrix.KM_GL_MODELVIEW:
        pOut.assignFrom(this.modelViewStack!.top!);
        break;
      case KMGLMatrix.KM_GL_PROJECTION:
        pOut.assignFrom(this.projectionStack!.top!);
        break;
      case KMGLMatrix.KM_GL_TEXTURE:
        pOut.assignFrom(this.textureStack!.top!);
        break;
      default:
        throw new Error("Invalid matrix mode specified");
    }
  }
}
