import { Layout } from './layout';

export class RelativeBox extends Layout {
    constructor(size) {
        super();
        this.setLayoutType(Layout.RELATIVE);

        if (size) {
            this.setContentSize(size);
        }
    }
}
