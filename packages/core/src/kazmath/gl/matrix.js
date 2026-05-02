import { KMGLMatrix } from "./km-gl-matrix";

export { KM_GL_MODELVIEW, KM_GL_PROJECTION, KM_GL_TEXTURE } from "./km-gl-matrix";

export function lazyInitialize() {
  KMGLMatrix.getInstance().lazyInitialize();
}

export function kmGLFreeAll() {
  KMGLMatrix.getInstance().freeAll();
}

export function kmGLPushMatrix() {
  KMGLMatrix.getInstance().pushMatrix();
}

export function kmGLPushMatrixWitMat4(saveMat) {
  KMGLMatrix.getInstance().pushMatrixWithMat4(saveMat);
}

export function kmGLPopMatrix() {
  KMGLMatrix.getInstance().popMatrix();
}

export function kmGLMatrixMode(mode) {
  KMGLMatrix.getInstance().matrixMode(mode);
}

export function kmGLLoadIdentity() {
  KMGLMatrix.getInstance().loadIdentity();
}

export function kmGLLoadMatrix(pIn) {
  KMGLMatrix.getInstance().loadMatrix(pIn);
}

export function kmGLMultMatrix(pIn) {
  KMGLMatrix.getInstance().multMatrix(pIn);
}

export function kmGLTranslatef(x, y, z) {
  KMGLMatrix.getInstance().translatef(x, y, z);
}

export function kmGLRotatef(angle, x, y, z) {
  KMGLMatrix.getInstance().rotatef(angle, x, y, z);
}

export function kmGLScalef(x, y, z) {
  KMGLMatrix.getInstance().scalef(x, y, z);
}

export function kmGLGetMatrix(mode, pOut) {
  KMGLMatrix.getInstance().getMatrix(mode, pOut);
}
