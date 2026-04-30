/**
 * Initialize the ccs global namespace before any module runs.
 * Must be the first import in index.js.
 */
window.ccs = window.ccs || {};

ccs.Node = ccs.Node || cc.Node;
ccs.Sprite = ccs.Sprite || cc.Sprite;
ccs.Component = ccs.Component || cc.Component;

ccs.cocostudioVersion = "v1.3.0.0";
