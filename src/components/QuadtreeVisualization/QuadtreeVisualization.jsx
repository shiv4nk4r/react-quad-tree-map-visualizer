import React from "react";

/**
 * QuadtreeVisualization - Component for rendering quadtree boundary lines
 * @param {Array} bounds - Array of boundary objects [{x, y, width, height}]
 * @param {boolean} visible - Whether to render the boundaries
 * @param {string} strokeColor - Color of the boundary lines
 * @param {number} strokeWidth - Width of the boundary lines
 * @param {number} opacity - Opacity of the boundary lines
 * @param {string} strokeDashArray - Dash pattern for the lines
 * @param {Object} style - Additional SVG styles
 */
const QuadtreeVisualization = ({
  bounds = [],
  visible = true,
  strokeColor = "rgba(255, 0, 0, 0.3)",
  strokeWidth = 1,
  opacity = 1,
  strokeDashArray = "",
  style = {},
  ...svgProps
}) => {
  if (!visible || bounds.length === 0) {
    return null;
  }

  return (
    <g style={{ opacity, ...style }} {...svgProps}>
      {bounds.map((bound, index) => (
        <rect
          key={`quadtree-bound-${index}`}
          x={bound.x}
          y={bound.y}
          width={bound.width}
          height={bound.height}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDashArray}
          style={{
            pointerEvents: "none", // Don't interfere with interactions
          }}
        />
      ))}
    </g>
  );
};

export default QuadtreeVisualization;
