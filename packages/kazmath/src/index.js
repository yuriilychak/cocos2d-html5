import { EPSILON, square, almostEqual } from './utility';
import Vec2 from './vec2';
import Vec3 from './vec3';
import Vec4 from './vec4';
import Ray2 from './ray2';
import Matrix3 from './mat3';
import Matrix4 from './mat4';
import {
    kmMat4Identity, kmMat4Inverse, kmMat4Multiply,
    getMat4MultiplyValue, kmMat4Assign, kmMat4Translation,
    kmMat4PerspectiveProjection, kmMat4LookAt, kmMat4RotationAxisAngle
} from './mat4';
import Plane from './plane';
import Quaternion from './quaternion';
import AABB from './aabb';
import Matrix4Stack from './gl/mat4-stack';
import { km_mat4_stack_push, km_mat4_stack_pop, km_mat4_stack_release } from './gl/mat4-stack';
import {
    KM_GL_MODELVIEW, KM_GL_PROJECTION, KM_GL_TEXTURE,
    lazyInitialize, kmGLFreeAll,
    kmGLPushMatrix, kmGLPushMatrixWitMat4, kmGLPopMatrix,
    kmGLMatrixMode, kmGLLoadIdentity, kmGLLoadMatrix,
    kmGLMultMatrix, kmGLTranslatef, kmGLRotatef,
    kmGLScalef, kmGLGetMatrix
} from './gl/matrix';

// Initialize cc.math namespace
cc.math = cc.math || {};

// Assign classes to cc.math.*
cc.math.EPSILON = EPSILON;
cc.math.square = square;
cc.math.almostEqual = almostEqual;
cc.math.Vec2 = Vec2;
cc.math.Vec3 = Vec3;
cc.math.Vec4 = Vec4;
cc.math.Ray2 = Ray2;
cc.math.Matrix3 = Matrix3;
cc.math.Matrix4 = Matrix4;
cc.math.Plane = Plane;
cc.math.Quaternion = Quaternion;
cc.math.AABB = AABB;
cc.math.Matrix4Stack = Matrix4Stack;

// Shorthand vec3 constructor
cc.math.vec3 = function (x, y, z) {
    return new Vec3(x, y, z);
};

// Compatibility aliases
cc.kmVec3 = Vec3;
cc.kmMat3 = Matrix3;
cc.kmMat4 = Matrix4;
cc.kmPlane = Plane;
cc.kmQuaternion = Quaternion;
cc.kmRay2 = Ray2;
cc.km_mat4_stack = Matrix4Stack;

// Mat4 wrapper functions
cc.kmMat4Identity = kmMat4Identity;
cc.kmMat4Inverse = kmMat4Inverse;
cc.kmMat4Multiply = kmMat4Multiply;
cc.getMat4MultiplyValue = getMat4MultiplyValue;
cc.kmMat4Assign = kmMat4Assign;
cc.kmMat4Translation = kmMat4Translation;
cc.kmMat4PerspectiveProjection = kmMat4PerspectiveProjection;
cc.kmMat4LookAt = kmMat4LookAt;
cc.kmMat4RotationAxisAngle = kmMat4RotationAxisAngle;

// Matrix4Stack wrapper functions
cc.km_mat4_stack_push = km_mat4_stack_push;
cc.km_mat4_stack_pop = km_mat4_stack_pop;
cc.km_mat4_stack_release = km_mat4_stack_release;

// GL constants
cc.KM_GL_MODELVIEW = KM_GL_MODELVIEW;
cc.KM_GL_PROJECTION = KM_GL_PROJECTION;
cc.KM_GL_TEXTURE = KM_GL_TEXTURE;

// GL state initialization
cc.modelview_matrix_stack = new Matrix4Stack();
cc.projection_matrix_stack = new Matrix4Stack();
cc.texture_matrix_stack = new Matrix4Stack();
cc.current_stack = null;

// GL functions
cc.lazyInitialize = lazyInitialize;
cc.kmGLFreeAll = kmGLFreeAll;
cc.kmGLPushMatrix = kmGLPushMatrix;
cc.kmGLPushMatrixWitMat4 = kmGLPushMatrixWitMat4;
cc.kmGLPopMatrix = kmGLPopMatrix;
cc.kmGLMatrixMode = kmGLMatrixMode;
cc.kmGLLoadIdentity = kmGLLoadIdentity;
cc.kmGLLoadMatrix = kmGLLoadMatrix;
cc.kmGLMultMatrix = kmGLMultMatrix;
cc.kmGLTranslatef = kmGLTranslatef;
cc.kmGLRotatef = kmGLRotatef;
cc.kmGLScalef = kmGLScalef;
cc.kmGLGetMatrix = kmGLGetMatrix;

// Initialize GL stacks
cc.lazyInitialize();

export {
    EPSILON, square, almostEqual,
    Vec2, Vec3, Vec4, Ray2,
    Matrix3, Matrix4, Plane, Quaternion, AABB,
    Matrix4Stack,
    kmMat4Identity, kmMat4Inverse, kmMat4Multiply,
    getMat4MultiplyValue, kmMat4Assign, kmMat4Translation,
    kmMat4PerspectiveProjection, kmMat4LookAt, kmMat4RotationAxisAngle,
    km_mat4_stack_push, km_mat4_stack_pop, km_mat4_stack_release,
    KM_GL_MODELVIEW, KM_GL_PROJECTION, KM_GL_TEXTURE,
    lazyInitialize, kmGLFreeAll,
    kmGLPushMatrix, kmGLPushMatrixWitMat4, kmGLPopMatrix,
    kmGLMatrixMode, kmGLLoadIdentity, kmGLLoadMatrix,
    kmGLMultMatrix, kmGLTranslatef, kmGLRotatef,
    kmGLScalef, kmGLGetMatrix
};
