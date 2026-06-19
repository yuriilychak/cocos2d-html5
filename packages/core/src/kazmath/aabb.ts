import Vec3 from "./vec3";
import type { AABBLike, Vec3Like } from "./types";

export default class AABB implements AABBLike {
    public min: Vec3;
    public max: Vec3;

    public constructor(min: Vec3Like | null = null, max: Vec3Like | null = null) {
        this.min = min ? new Vec3(min) : new Vec3();
        this.max = max ? new Vec3(max) : new Vec3();
    }

    public containsPoint(point: Vec3Like): boolean {
        return (
            point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y &&
            point.z >= this.min.z && point.z <= this.max.z
        );
    }

    public assignFrom(aabb: AABBLike): this {
        this.min.assignFrom(aabb.min);
        this.max.assignFrom(aabb.max);
        return this;
    }

    public static containsPoint(pPoint: Vec3Like, pBox: AABBLike): boolean {
        return (
            pPoint.x >= pBox.min.x && pPoint.x <= pBox.max.x &&
            pPoint.y >= pBox.min.y && pPoint.y <= pBox.max.y &&
            pPoint.z >= pBox.min.z && pPoint.z <= pBox.max.z
        );
    }

    public static assign<T extends AABB>(pOut: T, pIn: AABBLike): T {
        pOut.min.assignFrom(pIn.min);
        pOut.max.assignFrom(pIn.max);
        return pOut;
    }
}
