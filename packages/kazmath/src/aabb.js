import Vec3 from './vec3';

export default class AABB {
    constructor(min, max) {
        this.min = min || new Vec3();
        this.max = max || new Vec3();
    }

    containsPoint(point) {
        return (
            point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y &&
            point.z >= this.min.z && point.z <= this.max.z
        );
    }

    assignFrom(aabb) {
        this.min.assignFrom(aabb.min);
        this.max.assignFrom(aabb.max);
    }

    static containsPoint(pPoint, pBox) {
        return (
            pPoint.x >= pBox.min.x && pPoint.x <= pBox.max.x &&
            pPoint.y >= pBox.min.y && pPoint.y <= pBox.max.y &&
            pPoint.z >= pBox.min.z && pPoint.z <= pBox.max.z
        );
    }

    static assign(pOut, pIn) {
        pOut.min.assignFrom(pIn.min);
        pOut.max.assignFrom(pIn.max);
        return pOut;
    }
}
