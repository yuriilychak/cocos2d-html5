export class Device {
    static vibrate(duration) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(Math.round(duration * 1000));
        }
    }
}
