import { NodeColor, log } from "@aspect/core";

/** Color state for MotionStreak's unsupported opacity protocol. */
export default class MotionStreakColor extends NodeColor {
  get opacity() {
    log("MotionStreak.opacity has not been supported.");
    return 0;
  }

  set opacity(value) {
    void value;
    log("MotionStreak.opacity has not been supported.");
  }
}
