import { EditBoxInputBase } from './edit-box-input-base';

/**
 * Desktop input strategy — inherits the base no-op lifecycle hooks.
 * Focus/blur on desktop browsers needs no orientation, fullscreen or
 * scroll adjustments, so no overrides are required.
 */
export class DesktopEditBoxInput extends EditBoxInputBase {}
