import inherits from "inherits";

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { componentsToPath, createLine } from "diagram-js/lib/util/RenderUtil";

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from "tiny-svg";

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles) {
  BaseRenderer.call(this, eventBus, 2000);

  var computeStyle = styles.computeStyle;

  this.drawCustomConnection = function (p, element) {
    var attrs = computeStyle(attrs, {
      stroke: "#D6D6D6",
      strokeWidth: 1,
    });

    return svgAppend(p, createLine(element.waypoints, attrs));
  };

  this.getCustomConnectionPath = function (connection) {
    var waypoints = connection.waypoints.map(function (p) {
      return p.original || p;
    });

    var connectionPath = [["M", waypoints[0].x, waypoints[0].y]];

    waypoints.forEach(function (waypoint, index) {
      if (index !== 0) {
        connectionPath.push(["L", waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ["eventBus", "styles"];

CustomRenderer.prototype.canRender = function (element) {
  return /^custom:/.test(element.type);
};

CustomRenderer.prototype.drawConnection = function (p, element) {
  var type = element.type;

  if (type === "custom:connection") {
    return this.drawCustomConnection(p, element);
  }
};

CustomRenderer.prototype.getConnectionPath = function (connection) {
  var type = connection.type;

  if (type === "custom:connection") {
    return this.getCustomConnectionPath(connection);
  }
};
