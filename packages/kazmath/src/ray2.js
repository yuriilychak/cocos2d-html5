import { EPSILON } from './utility';
import Vec2 from './vec2';

function calculateLineNormal(p1, p2, normalOut) {
    const tmp = new Vec2(p2);
    tmp.subtract(p1);
    normalOut.x = -tmp.y;
    normalOut.y = tmp.x;
    normalOut.normalize();
}

export default class Ray2 {
    constructor(start, dir) {
        this.start = start || new Vec2();
        this.dir = dir || new Vec2();
    }

    fill(px, py, vx, vy) {
        this.start.x = px;
        this.start.y = py;
        this.dir.x = vx;
        this.dir.y = vy;
        return this;
    }

    intersectLineSegment(p1, p2, intersection) {
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

    intersectTriangle(p1, p2, p3, intersection, normal_out) {
        const intersect = new Vec2();
        const final_intersect = new Vec2();
        const normal = new Vec2();
        let distance = 10000.0;
        let intersected = false;

        const checkLine = (a, b) => {
            if (!this.intersectLineSegment(a, b, intersect)) return;

            const this_distance = intersect.subtract(this.start).length();
            if (this_distance < distance) {
                final_intersect.x = intersect.x;
                final_intersect.y = intersect.y;
                distance = this_distance;
                calculateLineNormal(a, b, normal);
            }
            intersected = true;
        };

        checkLine(p1, p2);
        checkLine(p2, p3);
        checkLine(p3, p1);

        if (intersected) {
            intersection.x = final_intersect.x;
            intersection.y = final_intersect.y;
            if (normal_out) {
                normal_out.x = normal.x;
                normal_out.y = normal.y;
            }
        }
        return intersected;
    }
}
