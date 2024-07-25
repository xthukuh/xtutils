"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElapsedTime = void 0;
const _datetime_1 = require("../utils/_datetime");
const _number_1 = require("../utils/_number");
class ElapsedTime {
    //props
    start_time;
    stop_time;
    _ms;
    /**
     * New instance
     */
    constructor() {
        this.start_time = new Date();
        this.stop_time = undefined;
        this._ms = undefined;
    }
    /**
     * Start time tracking (sets start_time to now and resets other properties)
     */
    start() {
        const _now = new Date();
        this.start_time = (0, _datetime_1._isDate)(this.start_time) ? this.start_time : _now;
        this.stop_time = undefined;
        this._ms = undefined;
        return this;
    }
    /**
     * Track current time (sets this._ms to time difference between last start and now)
     *
     * @param updateStart  Set start to now
     */
    now(updateStart = false) {
        const _now = new Date();
        const _start = (0, _datetime_1._isDate)(this.start_time) ? this.start_time : this.start_time = _now;
        this._ms = _now.getTime() - _start.getTime();
        if (updateStart)
            this.start_time = _now;
        return this;
    }
    /**
     * Stop time tracking (sets this._ms to time difference between last start and last stop)
     * If last stop is less than start time, stop time is updated to now.
     */
    stop() {
        const _now = new Date();
        const _start = (0, _datetime_1._isDate)(this.start_time) ? this.start_time : _now, t = _start.getTime();
        const _stop_time = this.stop_time;
        const _stop = (0, _datetime_1._isDate)(_stop_time) && _stop_time.getTime() >= t ? _stop_time : this.stop_time = _now;
        this._ms = _stop.getTime() - t;
        return this;
    }
    /**
     * Whether time tracking was started
     */
    started() {
        return (0, _datetime_1._isDate)(this.start_time);
    }
    /**
     * Whether time tracking was stopped
     */
    stopped() {
        return (0, _datetime_1._isDate)(this.stop_time);
    }
    /**
     * Get tracked elapsed time in milliseconds
     *
     * @returns milliseconds
     */
    ms() {
        return parseInt(this._ms);
    }
    /**
     * Get tracked elapsed time in seconds
     *
     * @param decimalPlaces
     * @returns seconds
     */
    sec(decimalPlaces = 3) {
        return (0, _number_1._round)(this.ms() / 1000, decimalPlaces);
    }
    /**
     * Get tracked elapsed time in minutes
     *
     * @param decimalPlaces
     * @returns minutes
     */
    min(decimalPlaces = 3) {
        return (0, _number_1._round)(this.ms() / 60000, decimalPlaces);
    }
    /**
     * Get tracking data (this will stop tracking)
     */
    data() {
        this.stop();
        const start_time = (0, _datetime_1._isDate)(this.start_time) ? this.start_time : undefined;
        const stop_time = (0, _datetime_1._isDate)(this.stop_time) ? this.stop_time : undefined;
        const elapsed_ms = this.ms();
        return { start_time, stop_time, elapsed_ms };
    }
}
exports.ElapsedTime = ElapsedTime;
//# sourceMappingURL=_ElapsedTime.js.map