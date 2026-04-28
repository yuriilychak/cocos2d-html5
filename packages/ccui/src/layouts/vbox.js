import { Layout } from './layout';

export class VBox extends Layout {
    constructor(size) {
        super();
        this.setLayoutType(Layout.LINEAR_VERTICAL);

        if (size) {
            this.setContentSize(size);
        }
    }

    initWithSize(size) {
        if (this.init()) {
            return true;
        }
        return false;
    }
}
