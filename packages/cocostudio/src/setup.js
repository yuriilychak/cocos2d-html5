/**
 * Initialize the ccs global namespace before any module runs.
 * Must be the first import in index.js.
 */
import { Node, Sprite, Component } from "@aspect/core";

window.ccs = window.ccs || {};

ccs.Node = ccs.Node || Node;
ccs.Sprite = ccs.Sprite || Sprite;
ccs.Component = ccs.Component || Component;

ccs.cocostudioVersion = "v1.3.0.0";
