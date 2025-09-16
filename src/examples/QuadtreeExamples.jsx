import React, { useMemo } from "react";
import { GenericQuadtreeVisualization } from "../components/PolkaDot/PolkaDotGeneratorRefactored";

/**
 * Example 1: Rectangles with different colors and sizes
 */
export const RectangleExample = () => {
  const worldBounds = useMemo(
    () => ({
      width: window.innerWidth * 2,
      height: window.innerHeight * 2,
    }),
    []
  );

  const rectangles = useMemo(() => {
    const items = [];
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];

    for (let i = 0; i < 1000; i++) {
      const width = Math.random() * 50 + 10;
      const height = Math.random() * 50 + 10;
      items.push({
        id: `rect-${i}`,
        x: Math.random() * (worldBounds.width - width),
        y: Math.random() * (worldBounds.height - height),
        width,
        height,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, [worldBounds]);

  const getItemBounds = (rect) => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });

  const renderRectangle = (rect, index) => (
    <rect
      key={rect.id || index}
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      fill={rect.color}
      stroke="#333"
      strokeWidth={0.5}
    />
  );

  return (
    <GenericQuadtreeVisualization
      items={rectangles}
      getItemBounds={getItemBounds}
      renderItem={renderRectangle}
      worldBounds={worldBounds}
      initialScale={1}
      title="Rectangle Demo"
    />
  );
};

/**
 * Example 2: Stars/polygons
 */
export const StarExample = () => {
  const worldBounds = useMemo(
    () => ({
      width: window.innerWidth * 2,
      height: window.innerHeight * 2,
    }),
    []
  );

  const stars = useMemo(() => {
    const items = [];
    const colors = ["#ffd700", "#ffb347", "#ff6347", "#da70d6", "#87ceeb"];

    for (let i = 0; i < 500; i++) {
      const size = Math.random() * 30 + 10;
      items.push({
        id: `star-${i}`,
        x: Math.random() * (worldBounds.width - size),
        y: Math.random() * (worldBounds.height - size),
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, [worldBounds]);

  const getItemBounds = (star) => ({
    x: star.x,
    y: star.y,
    width: star.size,
    height: star.size,
  });

  // Function to create a star path
  const createStarPath = (cx, cy, outerRadius, innerRadius, points = 5) => {
    const angle = Math.PI / points;
    let path = "";

    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(i * angle) * radius;
      const y = cy + Math.sin(i * angle) * radius;

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    return path + " Z";
  };

  const renderStar = (star, index) => {
    const cx = star.x + star.size / 2;
    const cy = star.y + star.size / 2;
    const outerRadius = star.size / 2;
    const innerRadius = outerRadius * 0.4;

    return (
      <path
        key={star.id || index}
        d={createStarPath(cx, cy, outerRadius, innerRadius)}
        fill={star.color}
        stroke="#333"
        strokeWidth={0.5}
      />
    );
  };

  return (
    <GenericQuadtreeVisualization
      items={stars}
      getItemBounds={getItemBounds}
      renderItem={renderStar}
      worldBounds={worldBounds}
      initialScale={1}
      title="Star Demo"
    />
  );
};

/**
 * Example 3: Text labels
 */
export const TextExample = () => {
  const worldBounds = useMemo(
    () => ({
      width: window.innerWidth * 2,
      height: window.innerHeight * 2,
    }),
    []
  );

  const textItems = useMemo(() => {
    const items = [];
    const words = [
      "Hello",
      "World",
      "React",
      "Quadtree",
      "Zoom",
      "Pan",
      "SVG",
      "Performance",
    ];
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"];

    for (let i = 0; i < 300; i++) {
      const fontSize = Math.random() * 20 + 12;
      const text = words[Math.floor(Math.random() * words.length)];
      // Estimate text width (rough approximation)
      const textWidth = text.length * fontSize * 0.6;
      const textHeight = fontSize;

      items.push({
        id: `text-${i}`,
        x: Math.random() * (worldBounds.width - textWidth),
        y: Math.random() * (worldBounds.height - textHeight) + textHeight,
        text,
        fontSize,
        width: textWidth,
        height: textHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, [worldBounds]);

  const getItemBounds = (textItem) => ({
    x: textItem.x,
    y: textItem.y - textItem.height, // Text baseline adjustment
    width: textItem.width,
    height: textItem.height,
  });

  const renderText = (textItem, index) => (
    <text
      key={textItem.id || index}
      x={textItem.x}
      y={textItem.y}
      fontSize={textItem.fontSize}
      fill={textItem.color}
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
    >
      {textItem.text}
    </text>
  );

  return (
    <GenericQuadtreeVisualization
      items={textItems}
      getItemBounds={getItemBounds}
      renderItem={renderText}
      worldBounds={worldBounds}
      initialScale={1}
      title="Text Demo"
    />
  );
};

/**
 * Example 4: Mixed elements (circles, rectangles, and triangles)
 */
export const MixedExample = () => {
  const worldBounds = useMemo(
    () => ({
      width: window.innerWidth * 2,
      height: window.innerHeight * 2,
    }),
    []
  );

  const mixedItems = useMemo(() => {
    const items = [];
    const types = ["circle", "rectangle", "triangle"];
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#fd79a8",
    ];

    for (let i = 0; i < 800; i++) {
      const size = Math.random() * 40 + 10;
      const type = types[Math.floor(Math.random() * types.length)];

      items.push({
        id: `mixed-${i}`,
        type,
        x: Math.random() * (worldBounds.width - size),
        y: Math.random() * (worldBounds.height - size),
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return items;
  }, [worldBounds]);

  const getItemBounds = (item) => ({
    x: item.x,
    y: item.y,
    width: item.size,
    height: item.size,
  });

  const renderMixedItem = (item, index) => {
    const key = item.id || index;

    switch (item.type) {
      case "circle":
        return (
          <circle
            key={key}
            cx={item.x + item.size / 2}
            cy={item.y + item.size / 2}
            r={item.size / 2}
            fill={item.color}
            stroke="#333"
            strokeWidth={0.5}
          />
        );

      case "rectangle":
        return (
          <rect
            key={key}
            x={item.x}
            y={item.y}
            width={item.size}
            height={item.size}
            fill={item.color}
            stroke="#333"
            strokeWidth={0.5}
          />
        );

      case "triangle": {
        const cx = item.x + item.size / 2;
        const cy = item.y + item.size / 2;
        const radius = item.size / 2;
        const points = `${cx},${cy - radius} ${cx - radius * 0.866},${
          cy + radius * 0.5
        } ${cx + radius * 0.866},${cy + radius * 0.5}`;

        return (
          <polygon
            key={key}
            points={points}
            fill={item.color}
            stroke="#333"
            strokeWidth={0.5}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <GenericQuadtreeVisualization
      items={mixedItems}
      getItemBounds={getItemBounds}
      renderItem={renderMixedItem}
      worldBounds={worldBounds}
      initialScale={1}
      title="Mixed Elements Demo"
    />
  );
};
