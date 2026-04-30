/**
 * The movement event class for Armature.
 * @constructor
 *
 * @property {Armature}             armature        - The armature reference of movement event.
 * @property {Number}                   movementType    - The type of movement.
 * @property {String}                   movementID      - The ID of movement.
 */
export function MovementEvent() {
    this.armature = null;
    this.movementType = ccs.MovementEventType.start;
    this.movementID = "";
};

/**
 * The frame event class for Armature.
 * @constructor
 *
 * @property {Bone}             bone                - The bone reference of frame event.
 * @property {String}               frameEventName      - The name of frame event.
 * @property {Number}               originFrameIndex    - The index of origin frame.
 * @property {Number}               currentFrameIndex   - The index of current frame.
 */
export function FrameEvent() {
    this.bone = null;
    this.frameEventName = "";
    this.originFrameIndex = 0;
    this.currentFrameIndex = 0;
};

ccs.MovementEvent = MovementEvent;
ccs.FrameEvent = FrameEvent;
