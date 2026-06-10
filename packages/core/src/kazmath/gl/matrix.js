import { ServiceLocator } from "../../service-locator";

export { KM_GL_MODELVIEW, KM_GL_PROJECTION, KM_GL_TEXTURE } from "./km-gl-matrix";

export function lazyInitialize() {
  ServiceLocator.kmglMatrix.lazyInitialize();
}

export function kmGLFreeAll() {
  ServiceLocator.kmglMatrix.freeAll();
}

export function kmGLPushMatrix() {
  ServiceLocator.kmglMatrix.pushMatrix();
}

export function kmGLPushMatrixWitMat4(saveMat) {
  ServiceLocator.kmglMatrix.pushMatrixWithMat4(saveMat);
}

export function kmGLPopMatrix() {
  ServiceLocator.kmglMatrix.popMatrix();
}

export function kmGLMatrixMode(mode) {
  ServiceLocator.kmglMatrix.matrixMode(mode);
}

export function kmGLLoadIdentity() {
  ServiceLocator.kmglMatrix.loadIdentity();
}

export function kmGLLoadMatrix(pIn) {
  ServiceLocator.kmglMatrix.loadMatrix(pIn);
}

export function kmGLMultMatrix(pIn) {
  ServiceLocator.kmglMatrix.multMatrix(pIn);
}

export function kmGLTranslatef(x, y, z) {
  ServiceLocator.kmglMatrix.translatef(x, y, z);
}

export function kmGLRotatef(angle, x, y, z) {
  ServiceLocator.kmglMatrix.rotatef(angle, x, y, z);
}

export function kmGLScalef(x, y, z) {
  ServiceLocator.kmglMatrix.scalef(x, y, z);
}

export function kmGLGetMatrix(mode, pOut) {
  ServiceLocator.kmglMatrix.getMatrix(mode, pOut);
}
