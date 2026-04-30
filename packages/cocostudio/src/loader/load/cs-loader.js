export const csLoader = ccs.csLoader = {

    //@deprecated This function will be deprecated sooner or later please use load
    /**
     * Create Timeline Node
     * @param file
     * @returns {*}
     */
    createNode: function (file) {
        return ccs._load(file);
    }
};
