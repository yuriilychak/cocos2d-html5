import Matrix4Stack from './mat4-stack';
import Matrix4 from '../mat4';
import Vec3 from '../vec3';

export const KM_GL_MODELVIEW = 0x1700;
export const KM_GL_PROJECTION = 0x1701;
export const KM_GL_TEXTURE = 0x1702;

export function lazyInitialize() {
    if (!cc.initialized) {
        const identity = new Matrix4();

        cc.modelview_matrix_stack.initialize();
        cc.projection_matrix_stack.initialize();
        cc.texture_matrix_stack.initialize();

        cc.current_stack = cc.modelview_matrix_stack;
        cc.initialized = true;
        identity.identity();

        cc.modelview_matrix_stack.push(identity);
        cc.projection_matrix_stack.push(identity);
        cc.texture_matrix_stack.push(identity);
    }
}

export function kmGLFreeAll() {
    cc.modelview_matrix_stack.release();
    cc.modelview_matrix_stack = null;
    cc.projection_matrix_stack.release();
    cc.projection_matrix_stack = null;
    cc.texture_matrix_stack.release();
    cc.texture_matrix_stack = null;

    cc.initialized = false;
    cc.current_stack = null;
}

export function kmGLPushMatrix() {
    cc.current_stack.push(cc.current_stack.top);
}

export function kmGLPushMatrixWitMat4(saveMat) {
    cc.current_stack.stack.push(cc.current_stack.top);
    saveMat.assignFrom(cc.current_stack.top);
    cc.current_stack.top = saveMat;
}

export function kmGLPopMatrix() {
    cc.current_stack.top = cc.current_stack.stack.pop();
}

export function kmGLMatrixMode(mode) {
    switch (mode) {
        case KM_GL_MODELVIEW:
            cc.current_stack = cc.modelview_matrix_stack;
            break;
        case KM_GL_PROJECTION:
            cc.current_stack = cc.projection_matrix_stack;
            break;
        case KM_GL_TEXTURE:
            cc.current_stack = cc.texture_matrix_stack;
            break;
        default:
            throw new Error("Invalid matrix mode specified");
    }
    cc.current_stack.lastUpdated = cc.director.getTotalFrames();
}

export function kmGLLoadIdentity() {
    cc.current_stack.top.identity();
}

export function kmGLLoadMatrix(pIn) {
    cc.current_stack.top.assignFrom(pIn);
}

export function kmGLMultMatrix(pIn) {
    cc.current_stack.top.multiply(pIn);
}

const tempMatrix = new Matrix4();

export function kmGLTranslatef(x, y, z) {
    const translation = Matrix4.createByTranslation(x, y, z, tempMatrix);
    cc.current_stack.top.multiply(translation);
}

const tempVector3 = new Vec3();

export function kmGLRotatef(angle, x, y, z) {
    tempVector3.fill(x, y, z);
    const rotation = Matrix4.createByAxisAndAngle(tempVector3, cc.degreesToRadians(angle), tempMatrix);
    cc.current_stack.top.multiply(rotation);
}

export function kmGLScalef(x, y, z) {
    const scaling = Matrix4.createByScale(x, y, z, tempMatrix);
    cc.current_stack.top.multiply(scaling);
}

export function kmGLGetMatrix(mode, pOut) {
    switch (mode) {
        case KM_GL_MODELVIEW:
            pOut.assignFrom(cc.modelview_matrix_stack.top);
            break;
        case KM_GL_PROJECTION:
            pOut.assignFrom(cc.projection_matrix_stack.top);
            break;
        case KM_GL_TEXTURE:
            pOut.assignFrom(cc.texture_matrix_stack.top);
            break;
        default:
            throw new Error("Invalid matrix mode specified");
    }
}
