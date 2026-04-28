import { Layout } from './layout';

export class HBox extends Layout {
    constructor(size) {
        super();
        this.setLayoutType(Layout.LINEAR_HORIZONTAL);

        if (size) {
            this.setContentSize(size);
        }
    }
}
