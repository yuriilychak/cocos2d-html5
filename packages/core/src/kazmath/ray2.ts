import { EPSILON, square } from "./utility";
import Vec2 from "./vec2";
import type { Ray2Like, Vec2Like } from "./types";

export default class Ray2 implements Ray2Like {
    #start = new Vec2();
    #dir = new Vec2();

    public constructor(start: Vec2Like | null = null, dir: Vec2Like | null = null) {
        if (start) this.#start.fill(start);
        if (dir) this.#dir.fill(dir);
    }

    public get start(): Vec2 {
        return this.#start;
    }

    public get dir(): Vec2 {
        return this.#dir;
    }

    public fill(px: number, py: number, vx: number, vy: number): this {
        this.#start.fill(px, py);
        this.#dir.fill(vx, vy);
        return this;
    }

    public intersectLineSegment(p1: Vec2Like, p2: Vec2Like, intersection: Vec2Like): boolean {
        const x1 = this.start.x;
        const y1 = this.start.y;
        const x2 = this.start.x + this.dir.x;
        const y2 = this.start.y + this.dir.y;
        const x3 = p1.x;
        const y3 = p1.y;
        const x4 = p2.x;
        const y4 = p2.y;

        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom > -EPSILON && denom < EPSILON) return false;

        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const x = x1 + ua * (x2 - x1);
        const y = y1 + ua * (y2 - y1);

        if (
            x < Math.min(p1.x, p2.x) - EPSILON ||
            x > Math.max(p1.x, p2.x) + EPSILON ||
            y < Math.min(p1.y, p2.y) - EPSILON ||
            y > Math.max(p1.y, p2.y) + EPSILON
        ) {
            return false;
        }

        if (
            x < Math.min(x1, x2) - EPSILON ||
            x > Math.max(x1, x2) + EPSILON ||
            y < Math.min(y1, y2) - EPSILON ||
            y > Math.max(y1, y2) + EPSILON
        ) {
            return false;
        }

        intersection.x = x;
        intersection.y = y;
        return true;
    }

    public intersectTriangle(
        p1: Vec2Like,
        p2: Vec2Like,
        p3: Vec2Like,
        intersection: Vec2Like,
        normalOut?: Vec2Like | null,
    ): boolean {
        const intersect = new Vec2();
        const finalIntersect = new Vec2();
        const normal = new Vec2();
        const accamulator = { distance: 10000, intersected: false };

        const checkLine = (a: Vec2Like, b: Vec2Like, acc: { distance: number, intersected: boolean }): void => {
            if (!this.intersectLineSegment(a, b, intersect)) {
                return;
            }

            const thisDistance = intersect.subtract(this.start).length;

            if (thisDistance < acc.distance) {
                finalIntersect.fill(intersect);
                acc.distance = thisDistance;
                Ray2.calculateLineNormal(a, b, normal);
            }

            acc.intersected = true;
        };

        checkLine(p1, p2, accamulator);
        checkLine(p2, p3, accamulator);
        checkLine(p3, p1, accamulator);

        if (accamulator.intersected) {
            intersection.x = finalIntersect.x;
            intersection.y = finalIntersect.y;
            if (normalOut) {
                normalOut.x = normal.x;
                normalOut.y = normal.y;
            }
        }
        return accamulator.intersected;
    }

    public static calculateLineNormal<T extends Vec2Like>(p1: Vec2Like, p2: Vec2Like, normalOut: T): T {
        const x = p2.x - p1.x;
        const y = p2.y - p1.y;
        const length = Math.sqrt(square(x) + square(y));
        const scale = 1.0 / length;

        normalOut.x = -y * scale;
        normalOut.y = x * scale;
        return normalOut;
    }
}
