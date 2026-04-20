/**
 * @class
 */
export default class Path {
    static normalizeRE = /[^\.\/]+\/\.\.\//;

    /**
     * Join strings to be a path.
     * @example
     Path.join("a", "b.png");//-->"a/b.png"
     Path.join("a", "b", "c.png");//-->"a/b/c.png"
     Path.join("a", "b");//-->"a/b"
     Path.join("a", "b", "/");//-->"a/b/"
     Path.join("a", "b/", "/");//-->"a/b/"
     * @returns {string}
     */
    static join(...args) {
        var result = "";
        for (var i = 0; i < args.length; i++) {
            result = (result + (result === "" ? "" : "/") + args[i]).replace(/(\/|\\\\)$/, "");
        }
        return result;
    }

    /**
     * Get the ext name of a path.
     * @example
     Path.extname("a/b.png");//-->".png"
     Path.extname("a/b.png?a=1&b=2");//-->".png"
     Path.extname("a/b");//-->null
     Path.extname("a/b?a=1&b=2");//-->null
     * @param {string} pathStr
     * @returns {*}
     */
    static extname(pathStr) {
        var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
        return temp ? temp[1] : null;
    }

    /**
     * Get the main name of a file name
     * @param {string} fileName
     * @returns {string}
     */
    static mainFileName(fileName) {
        if (fileName) {
            var idx = fileName.lastIndexOf(".");
            if (idx !== -1)
                return fileName.substring(0, idx);
        }
        return fileName;
    }

    /**
     * Get the file name of a file path.
     * @example
     Path.basename("a/b.png");//-->"b.png"
     Path.basename("a/b.png?a=1&b=2");//-->"b.png"
     Path.basename("a/b.png", ".png");//-->"b"
     Path.basename("a/b.png?a=1&b=2", ".png");//-->"b"
     Path.basename("a/b.png", ".txt");//-->"b.png"
     * @param {string} pathStr
     * @param {string} [extname]
     * @returns {*}
     */
    static basename(pathStr, extname) {
        var index = pathStr.indexOf("?");
        if (index > 0) pathStr = pathStr.substring(0, index);
        var reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
        var result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
        if (!result) return null;
        var baseName = result[2];
        if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() === extname.toLowerCase())
            return baseName.substring(0, baseName.length - extname.length);
        return baseName;
    }

    /**
     * Get dirname of a file path.
     * @example
     * unix
     Path.driname("a/b/c.png");//-->"a/b"
     Path.driname("a/b/c.png?a=1&b=2");//-->"a/b"
     Path.dirname("a/b/");//-->"a/b"
     Path.dirname("c.png");//-->""
     * windows
     Path.driname("a\\b\\c.png");//-->"a\b"
     Path.driname("a\\b\\c.png?a=1&b=2");//-->"a\b"
     * @param {string} pathStr
     * @returns {*}
     */
    static dirname(pathStr) {
        return pathStr.replace(/((.*)(\/|\\|\\\\))?(.*?\..*$)?/, '$2');
    }

    /**
     * Change extname of a file path.
     * @example
     Path.changeExtname("a/b.png", ".plist");//-->"a/b.plist"
     Path.changeExtname("a/b.png?a=1&b=2", ".plist");//-->"a/b.plist?a=1&b=2"
     * @param {string} pathStr
     * @param {string} [extname]
     * @returns {string}
     */
    static changeExtname(pathStr, extname) {
        extname = extname || "";
        var index = pathStr.indexOf("?");
        var tempStr = "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf(".");
        if (index < 0) return pathStr + extname + tempStr;
        return pathStr.substring(0, index) + extname + tempStr;
    }

    /**
     * Change file name of a file path.
     * @example
     Path.changeBasename("a/b/c.plist", "b.plist");//-->"a/b/b.plist"
     Path.changeBasename("a/b/c.plist?a=1&b=2", "b.plist");//-->"a/b/b.plist?a=1&b=2"
     Path.changeBasename("a/b/c.plist", ".png");//-->"a/b/c.png"
     Path.changeBasename("a/b/c.plist", "b");//-->"a/b/b"
     Path.changeBasename("a/b/c.plist", "b", true);//-->"a/b/b.plist"
     * @param {String} pathStr
     * @param {String} basename
     * @param {Boolean} [isSameExt]
     * @returns {string}
     */
    static changeBasename(pathStr, basename, isSameExt) {
        if (basename.indexOf(".") === 0) return Path.changeExtname(pathStr, basename);
        var index = pathStr.indexOf("?");
        var tempStr = "";
        var ext = isSameExt ? Path.extname(pathStr) : "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + basename + ext + tempStr;
    }

    //todo make public after verification
    static _normalize(url) {
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(Path.normalizeRE, "");
        } while (oldUrl.length !== url.length);
        return url;
    }
}
