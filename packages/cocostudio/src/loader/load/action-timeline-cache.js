import { _ccsLoad } from "./utils.js";

//Forward compatible interface

export const actionTimelineCache = ccs.actionTimelineCache = {

    //@deprecated This function will be deprecated sooner or later please use load
    /**
     * Create Timeline Action
     * @param file
     * @returns {*}
     */
    createAction: function (file) {
        return _ccsLoad(file, "action");
    }
};
