import { BaseClass, Point } from "@aspect/core";

/**
 * TMXObjectGroup represents the TMX object group.
 *
 * @property {Array}    properties  - Properties from the group. They can be added using tilemap editors
 * @property {String}   groupName   - Name of the group
 */
export class TMXObjectGroup extends BaseClass {
  constructor() {
    super();
    this.properties = null;
    this.groupName = "";
    this._positionOffset = null;
    this._objects = null;

    this.groupName = "";
    this._positionOffset = new Point(0, 0);
    this.properties = [];
    this._objects = [];
  }

  getPositionOffset() {
    return new Point(this._positionOffset);
  }

  setPositionOffset(offset) {
    this._positionOffset.x = offset.x;
    this._positionOffset.y = offset.y;
  }

  getProperties() {
    return this.properties;
  }

  setProperties(Var) {
    this.properties.push(Var);
  }

  getGroupName() {
    return this.groupName.toString();
  }

  setGroupName(groupName) {
    this.groupName = groupName;
  }

  propertyNamed(propertyName) {
    return this.properties[propertyName];
  }

  getObject(objectName) {
    if (this._objects && this._objects.length > 0) {
      var locObjects = this._objects;
      for (var i = 0, len = locObjects.length; i < len; i++) {
        var name = locObjects[i]["name"];
        if (name && name === objectName) return locObjects[i];
      }
    }
    return null;
  }

  getObjects() {
    return this._objects;
  }

  setObjects(objects) {
    this._objects.push(objects);
  }
}
