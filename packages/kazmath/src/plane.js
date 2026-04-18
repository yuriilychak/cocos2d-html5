import Vec3 from './vec3';

export default class Plane {
    constructor(a, b, c, d) {
        if (a && b === undefined) {
            this.a = a.a;
            this.b = a.b;
            this.c = a.c;
            this.d = a.d;
        } else {
            this.a = a || 0;
            this.b = b || 0;
            this.c = c || 0;
            this.d = d || 0;
        }
    }

    dot(vec4) {
        return this.a * vec4.x + this.b * vec4.y + this.c * vec4.z + this.d * vec4.w;
    }

    dotCoord(vec3) {
        return this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
    }

    dotNormal(vec3) {
        return this.a * vec3.x + this.b * vec3.y + this.c * vec3.z;
    }

    normalize() {
        const n = new Vec3(this.a, this.b, this.c);
        const l = 1.0 / n.length();
        n.normalize();
        this.a = n.x;
        this.b = n.y;
        this.c = n.z;
        this.d = this.d * l;
        return this;
    }

    classifyPoint(vec3) {
        const distance = this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
        if (distance > 0.001) return Plane.POINT_INFRONT_OF_PLANE;
        if (distance < -0.001) return Plane.POINT_BEHIND_PLANE;
        return Plane.POINT_ON_PLANE;
    }

    static fromPointNormal(vec3, normal) {
        return new Plane(normal.x, normal.y, normal.z, -normal.dot(vec3));
    }

    static fromPoints(vec1, vec2, vec3) {
        const v1 = new Vec3(vec2);
        const v2 = new Vec3(vec3);
        const plane = new Plane();

        v1.subtract(vec1);
        v2.subtract(vec1);
        v1.cross(v2);
        v1.normalize();

        plane.a = v1.x;
        plane.b = v1.y;
        plane.c = v1.z;
        plane.d = v1.scale(-1.0).dot(vec1);
        return plane;
    }

    static LEFT = 0;
    static RIGHT = 1;
    static BOTTOM = 2;
    static TOP = 3;
    static NEAR = 4;
    static FAR = 5;

    static POINT_INFRONT_OF_PLANE = 0;
    static POINT_BEHIND_PLANE = 1;
    static POINT_ON_PLANE = 2;
}
