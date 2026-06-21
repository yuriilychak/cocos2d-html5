import { BaseClass, log } from "@aspect/core";

export class _parser extends BaseClass {

    _dirnameReg = /\S*\//;

    constructor() {
        super();
        this.parsers = {};
    }

    _dirname(path) {
        var arr = path.match(this._dirnameReg);
        return (arr && arr[0]) ? arr[0] : "";
    }

    getClass(json) {
        return json["classname"];
    }

    getNodeJson(json) {
        return json["widgetTree"];
    }

    parse(file, json, resourcePath) {
        resourcePath = resourcePath || this._dirname(file);
        this.pretreatment(json, resourcePath);
        var node = this.parseNode(this.getNodeJson(json), resourcePath, file);
        node && this.deferred(json, resourcePath, node, file);
        return node;
    }

    pretreatment(json, resourcePath, file) {
    }

    deferred(json, resourcePath, node, file) {
    }

    parseNode(json, resourcePath) {
        var parser = this.parsers[this.getClass(json)];
        var widget = null;
        if (parser)
            widget = parser.call(this, json, resourcePath);
        else
            log("Can't find the parser : %s", this.getClass(json));

        return widget;
    }

    registerParser(widget, parse) {
        this.parsers[widget] = parse;
    }
};

