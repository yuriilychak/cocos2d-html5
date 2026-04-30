import { _ccsLoad } from "./utils.js";

export const csLoader = {

    //@deprecated This function will be deprecated sooner or later please use load
    /**
     * Create Timeline Node
     * @param file
     * @returns {*}
     */
    createNode: function (file) {
        return _ccsLoad(file);
    }
};
