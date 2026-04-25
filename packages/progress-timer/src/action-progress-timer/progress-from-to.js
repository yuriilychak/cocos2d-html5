import { ActionInterval } from "@aspect/actions";
import { ProgressTimer } from "../progress-timer";

/**
 * Progress from a percentage to another percentage
 * @param {Number} duration duration in seconds
 * @param {Number} fromPercentage
 * @param {Number} toPercentage
 * @example
 *  var fromTo = new ProgressFromTo(2, 100.0, 0.0);
 */
export class ProgressFromTo extends ActionInterval {
    _to = 0;
    _from = 0;

    /**
     * Constructor of ProgressFromTo
     * @param {Number} duration duration in seconds
     * @param {Number} fromPercentage
     * @param {Number} toPercentage
     */
    constructor(duration, fromPercentage, toPercentage) {
        super();
        this._to = 0;
        this._from = 0;

        toPercentage !== undefined &&
            this.initWithDuration(duration, fromPercentage, toPercentage);
    }

    /**
     * Initializes the action with a duration, a "from" percentage and a "to" percentage
     * @param {Number} duration duration in seconds
     * @param {Number} fromPercentage
     * @param {Number} toPercentage
     * @return {Boolean}
     */
    initWithDuration(duration, fromPercentage, toPercentage) {
        if (super.initWithDuration(duration)) {
            this._to = toPercentage;
            this._from = fromPercentage;
            return true;
        }
        return false;
    }

    /**
     * return a new ProgressFromTo, all the configuration is the same as the original
     * @returns {ProgressFromTo}
     */
    clone() {
        const action = new ProgressFromTo();
        action.initWithDuration(this._duration, this._from, this._to);
        return action;
    }

    /**
     * @return {ActionInterval}
     */
    reverse() {
        return new ProgressFromTo(this._duration, this._to, this._from);
    }

    /**
     * start with a target
     * @param {Node} target
     */
    startWithTarget(target) {
        super.startWithTarget(target);
    }

    /**
     * @param {Number} time time in seconds
     */
    update(time) {
        if (this.target instanceof ProgressTimer)
            this.target.percentage = this._from + (this._to - this._from) * time;
    }
}
