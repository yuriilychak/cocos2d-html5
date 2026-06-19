import Vec3 from "./vec3";
import type { PlaneLike, Vec3Like, Vec4Like } from "./types";

export default class Plane implements PlaneLike {
    #data: number[] = [0, 0, 0, 0];

    public constructor();
    public constructor(plane: PlaneLike);
    public constructor(a: number, b: number, c: number, d: number);
    public constructor(aOrPlane: number | PlaneLike = 0, b = 0, c = 0, d = 0) {
        if (Plane.isLike(aOrPlane)) {
            this.#initFromPlane(aOrPlane);
        } else {
            this.#initFromNumber(aOrPlane, b, c, d);
        }
    }

    public get a(): number {
        return this.#data[0];
    }

    public set a(value: number) {
        this.#data[0] = value;
    }

    public get b(): number {
        return this.#data[1];
    }

    public set b(value: number) {
        this.#data[1] = value;
    }

    public get c(): number {
        return this.#data[2];
    }

    public set c(value: number) {
        this.#data[2] = value;
    }

    public get d(): number {
        return this.#data[3];
    }

    public set d(value: number) {
        this.#data[3] = value;
    }

    public dot(vec4: Vec4Like): number {
        return this.a * vec4.x + this.b * vec4.y + this.c * vec4.z + this.d * vec4.w;
    }

    public dotCoord(vec3: Vec3Like): number {
        return this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
    }

    public dotNormal(vec3: Vec3Like): number {
        return this.a * vec3.x + this.b * vec3.y + this.c * vec3.z;
    }

    public normalize(): this {
        const n = new Vec3(this.a, this.b, this.c);
        const l = 1.0 / n.length;
        n.normalize();
        this.a = n.x;
        this.b = n.y;
        this.c = n.z;
        this.d = this.d * l;
        return this;
    }

    public classifyPoint(vec3: Vec3Like): number {
        const distance = this.a * vec3.x + this.b * vec3.y + this.c * vec3.z + this.d;
        if (distance > 0.001) return Plane.POINT_INFRONT_OF_PLANE;
        if (distance < -0.001) return Plane.POINT_BEHIND_PLANE;
        return Plane.POINT_ON_PLANE;
    }

    public static fromPointNormal(vec3: Vec3Like, normal: Vec3): Plane {
        return new Plane(normal.x, normal.y, normal.z, -normal.dot(vec3));
    }

    public static fromPoints(vec1: Vec3Like, vec2: Vec3Like, vec3: Vec3Like): Plane {
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

    public static LEFT = 0;
    public static RIGHT = 1;
    public static BOTTOM = 2;
    public static TOP = 3;
    public static NEAR = 4;
    public static FAR = 5;

    public static POINT_INFRONT_OF_PLANE = 0;
    public static POINT_BEHIND_PLANE = 1;
    public static POINT_ON_PLANE = 2;

    private static isLike(value: unknown): value is PlaneLike {
        return (
            typeof value === "object" &&
            value !== null &&
            "a" in value &&
            "b" in value &&
            "c" in value &&
            "d" in value
        );
    }

    #initFromNumber(a: number, b: number, c: number, d: number): void {
        this.a = a || 0;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d || 0;
    }

    #initFromPlane(plane: PlaneLike): void {
        this.a = plane.a;
        this.b = plane.b;
        this.c = plane.c;
        this.d = plane.d;
    }
}
