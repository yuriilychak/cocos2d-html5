import { ActionInterval } from "@aspect/actions";
import { log } from "@aspect/core";
import { ProgressTimer } from "../progress-timer";

/**
 * Progress to percentage
 * @param {Number} duration duration in seconds
 * @param {Number} percent
 * @example
 * var to = new ProgressTo(2, 100);
 */
export class ProgressTo extends ActionInterval {
    _to = 0;
    _from = 0;

    /**
     * Constructor of ProgressTo
     * @param {Number} duration duration in seconds
     * @param {Number} percent
     */
    constructor(duration, percent) {
        super();
        this._to = 0;
        this._from = 0;

        percent !== undefined && this.initWithDuration(duration, percent);
    }

    /**
     * Initializes with a duration and a percent
     * @param {Number} duration duration in seconds
     * @param {Number} percent
     * @return {Boolean}
     */
    initWithDuration(duration, percent) {
        if (super.initWithDuration(duration)) {
            this._to = percent;
            return true;
        }
        return false;
    }

    /**
     * return a new ProgressTo, all the configuration is the same as the original
     * @returns {ProgressTo}
     */
    clone() {
        const action = new ProgressTo();
        action.initWithDuration(this._duration, this._to);
        return action;
    }

    /**
     * reverse hasn't been supported
     * @returns {null}
     */
    reverse() {
        log("ProgressTo.reverse(): reverse hasn't been supported.");
        return null;
    }

    /**
     * start with a target
     * @param {Node} target
     */
    startWithTarget(target) {
        super.startWithTarget(target);
        this._from = target.percentage;
    }

    /**
     * custom update
     * @param {Number} time time in seconds
     */
    update(time) {
        if (this.target instanceof ProgressTimer)
            this.target.percentage = this._from + (this._to - this._from) * time;
    }
}
