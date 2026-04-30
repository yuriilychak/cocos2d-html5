import { Director, Loader, Node, Path, log, warn } from "@aspect/core";

const _ccsLoad = ccs._load = (function () {

    /**
     * load file
     * @param {String} file
     * @param {String} [type=] - ccui|node|action
     * @param {String} [path=] - Resource search path
     * @returns {*}
     */
    var load = function (file, type, path) {

        var json = Loader.getInstance().getRes(file);

        if (!json)
            return log("%s does not exist", file);
        var ext = extname(file).toLocaleLowerCase();
        if (ext !== "json" && ext !== "exportjson")
            return log("%s load error, must be json file", file);

        var parse;
        if (!type) {
            if (json["Content"] && json["Content"]["Content"])
                parse = parser["timeline"];
        } else {
            parse = parser[type];
        }

        if (!parse) {
            log("Can't find the parser : %s", file);
            return new Node();
        }
        var version = json["version"] || json["Version"];
        if (!version && json["armature_data"]) {
            warn("%s is armature. please use:", file);
            warn("    ccs.armatureDataManager.addArmatureFileInfoAsync(%s);", file);
            warn("    var armature = new ccs.Armature('name');");
            return new Node();
        }
        var currentParser = getParser(parse, version);
        if (!currentParser) {
            log("Can't find the parser : %s", file);
            return new Node();
        }

        return currentParser.parse(file, json, path) || null;
    };

    var parser = {
        "timeline": {},
        "action": {}
    };

    load.registerParser = function (name, version, target) {
        if (!name || !version || !target)
            return log("register parser error");
        if (!parser[name])
            parser[name] = {};
        parser[name][version] = target;
    };

    load.getParser = function (name, version) {
        if (name && version)
            return parser[name] ? parser[name][version] : undefined;
        if (name)
            return parser[name];
        return parser;
    };

    //Gets the file extension
    var extname = function (fileName) {
        var arr = fileName.match(extnameReg);
        return ( arr && arr[1] ) ? arr[1] : null;
    };
    var extnameReg = /\.([^\.]+)$/;

    var parserReg = /([^\.](\.\*)?)*$/;
    var getParser = function (parser, version) {
        if (parser[version])
            return parser[version];
        else if (version === "*")
            return null;
        else
            return getParser(parser, version.replace(parserReg, "*"));
    };

    return load;

})();

/**
 * Analysis of studio JSON file
 * The incoming file name, parse out the corresponding object
 * Support file list:
 *   node 2.*
 *   action 2.*
 * @param {String} file
 * @param {String} [path=] Resource path
 * @returns {{node: Node, action: Action}}
 */
export function load (file, path) {
    var object = {
        node: null,
        action: null
    };

    object.node = ccs._load(file, null, path);
    object.action = ccs._load(file, "action", path);
    if (object.action && object.action.tag === -1 && object.node)
        object.action.tag = object.node.tag;
    return object;
};
load.validate = {};
load.preload = true;

/**
 * Analysis of studio JSON file and layout ui widgets by visible size.
 * The incoming file name, parse out the corresponding object
 * Support file list:
 *   node 2.*
 *   action 2.*
 * @param {String} file
 * @param {String} [path=] Resource path
 * @returns {{node: Node, action: Action}}
 */
export function loadWithVisibleSize (file, path) {
    var object = ccs.load(file, path);
    var size = Director.getInstance().getVisibleSize();
    if (object.node && size) {
        object.node.setContentSize(size.width, size.height);
        ccui.helper.doLayout(object.node);
    }
    return object;
};

Loader.getInstance().register(["json"], {
    load: function (realUrl, url, res, cb) {
        Loader.getInstance().loadJson(realUrl, function (error, data) {
            var path = Path;
            if (data && data["Content"] && data["Content"]["Content"]["UsedResources"]) {
                var UsedResources = data["Content"]["Content"]["UsedResources"],
                    dirname = path.dirname(url),
                    list = [],
                    tmpUrl, normalUrl;
                for (var i = 0; i < UsedResources.length; i++) {
                    if (!ccs.load.preload && /\.(png|jpg$)/.test(UsedResources[i]))
                        continue;
                    tmpUrl = path.join(dirname, UsedResources[i]);
                    normalUrl = path._normalize(tmpUrl);
                    if (!ccs.load.validate[normalUrl]) {
                        ccs.load.validate[normalUrl] = true;
                        list.push(normalUrl);
                    }
                }
                Loader.getInstance().load(list, function () {
                    cb(error, data);
                });
            } else {
                cb(error, data);
            }

        });
    }
});

ccs.load = load;
ccs.loadWithVisibleSize = loadWithVisibleSize;
