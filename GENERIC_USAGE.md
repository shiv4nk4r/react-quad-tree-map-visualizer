# Generic Quadtree Visualization Component

This package provides a flexible, high-performance quadtree visualization system that can render any type of elements with zoom, pan, and spatial optimization.

## Core Components

### GenericQuadtreeVisualization

The main component that provides quadtree-optimized rendering for any type of elements.

```jsx
import { GenericQuadtreeVisualization } from "./path/to/component";

<GenericQuadtreeVisualization
  items={yourItems}
  getItemBounds={(item) => ({ x, y, width, height })}
  renderItem={(item, index) => <YourJSXElement />}
  worldBounds={{ width: 2000, height: 2000 }}
  initialScale={1}
  title="Your Visualization"
/>;
```

### Props

| Prop                  | Type     | Required | Description                                                    |
| --------------------- | -------- | -------- | -------------------------------------------------------------- |
| `items`               | Array    | ✅       | Array of items to render                                       |
| `getItemBounds`       | Function | ✅       | Function that returns `{x, y, width, height}` for each item    |
| `renderItem`          | Function | ✅       | Function that returns JSX to render each item                  |
| `worldBounds`         | Object   | ✅       | World dimensions `{width, height}`                             |
| `initialScale`        | Number   | ❌       | Initial zoom level (default: 1)                                |
| `minScale`            | Number   | ❌       | Minimum zoom level (default: 0.1)                              |
| `maxScale`            | Number   | ❌       | Maximum zoom level (default: 10)                               |
| `bufferScale`         | Number   | ❌       | Viewport buffer for smooth panning (default: 0.2)              |
| `showQuadtreeDefault` | Boolean  | ❌       | Show quadtree visualization by default (default: true)         |
| `showStatsDefault`    | Boolean  | ❌       | Show stats dialog by default (default: true)                   |
| `title`               | String   | ❌       | Title for the stats dialog (default: "Quadtree Visualization") |
| `containerClassName`  | String   | ❌       | CSS class for the container (default: "polka-dot-container")   |

## Usage Examples

### 1. Circles/Dots

```jsx
const CircleExample = () => {
  const items = useMemo(() => {
    const circles = [];
    for (let i = 0; i < 1000; i++) {
      circles.push({
        id: i,
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        radius: Math.random() * 10 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      });
    }
    return circles;
  }, []);

  const getItemBounds = (circle) => ({
    x: circle.x - circle.radius,
    y: circle.y - circle.radius,
    width: circle.radius * 2,
    height: circle.radius * 2,
  });

  const renderItem = (circle) => (
    <circle cx={circle.x} cy={circle.y} r={circle.radius} fill={circle.color} />
  );

  return (
    <GenericQuadtreeVisualization
      items={items}
      getItemBounds={getItemBounds}
      renderItem={renderItem}
      worldBounds={{ width: 2000, height: 2000 }}
      title="Circle Demo"
    />
  );
};
```

### 2. Rectangles

```jsx
const RectangleExample = () => {
  const items = useMemo(() => {
    const rectangles = [];
    for (let i = 0; i < 500; i++) {
      const width = Math.random() * 50 + 10;
      const height = Math.random() * 50 + 10;
      rectangles.push({
        id: i,
        x: Math.random() * (2000 - width),
        y: Math.random() * (2000 - height),
        width,
        height,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      });
    }
    return rectangles;
  }, []);

  const getItemBounds = (rect) => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });

  const renderItem = (rect) => (
    <rect
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
      items={items}
      getItemBounds={getItemBounds}
      renderItem={renderItem}
      worldBounds={{ width: 2000, height: 2000 }}
      title="Rectangle Demo"
    />
  );
};
```

### 3. Text Labels

```jsx
const TextExample = () => {
  const items = useMemo(() => {
    const textItems = [];
    const words = ["Hello", "World", "React", "Quadtree"];

    for (let i = 0; i < 200; i++) {
      const text = words[Math.floor(Math.random() * words.length)];
      const fontSize = Math.random() * 20 + 12;
      // Estimate text dimensions
      const width = text.length * fontSize * 0.6;
      const height = fontSize;

      textItems.push({
        id: i,
        x: Math.random() * (2000 - width),
        y: Math.random() * (2000 - height) + height,
        text,
        fontSize,
        width,
        height,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      });
    }
    return textItems;
  }, []);

  const getItemBounds = (textItem) => ({
    x: textItem.x,
    y: textItem.y - textItem.height, // Text baseline adjustment
    width: textItem.width,
    height: textItem.height,
  });

  const renderItem = (textItem) => (
    <text
      x={textItem.x}
      y={textItem.y}
      fontSize={textItem.fontSize}
      fill={textItem.color}
      fontFamily="Arial, sans-serif"
    >
      {textItem.text}
    </text>
  );

  return (
    <GenericQuadtreeVisualization
      items={items}
      getItemBounds={getItemBounds}
      renderItem={renderItem}
      worldBounds={{ width: 2000, height: 2000 }}
      title="Text Demo"
    />
  );
};
```

### 4. Complex Custom Elements

```jsx
const CustomShapeExample = () => {
  const items = useMemo(() => {
    // Create custom shape data
    return Array.from({ length: 300 }, (_, i) => ({
      id: i,
      x: Math.random() * 1800,
      y: Math.random() * 1800,
      size: Math.random() * 40 + 20,
      rotation: Math.random() * 360,
      color: `hsl(${(i * 137.5) % 360}, 70%, 60%)`,
      type: ["star", "diamond", "hexagon"][Math.floor(Math.random() * 3)],
    }));
  }, []);

  const getItemBounds = (item) => ({
    x: item.x,
    y: item.y,
    width: item.size,
    height: item.size,
  });

  const renderItem = (item) => {
    // Create path based on type
    const centerX = item.x + item.size / 2;
    const centerY = item.y + item.size / 2;

    let pathData = "";
    switch (item.type) {
      case "star":
        pathData = createStarPath(centerX, centerY, item.size / 2);
        break;
      case "diamond":
        pathData = createDiamondPath(centerX, centerY, item.size / 2);
        break;
      case "hexagon":
        pathData = createHexagonPath(centerX, centerY, item.size / 2);
        break;
    }

    return (
      <path
        d={pathData}
        fill={item.color}
        stroke="#333"
        strokeWidth={1}
        transform={`rotate(${item.rotation} ${centerX} ${centerY})`}
      />
    );
  };

  return (
    <GenericQuadtreeVisualization
      items={items}
      getItemBounds={getItemBounds}
      renderItem={renderItem}
      worldBounds={{ width: 2000, height: 2000 }}
      title="Custom Shapes Demo"
    />
  );
};
```

## Key Features

1. **Performance Optimized**: Uses quadtree spatial indexing to only render visible items
2. **Smooth Zoom/Pan**: Built-in zoom and pan functionality with smooth interactions
3. **Viewport Culling**: Only renders items within the visible viewport (+ buffer)
4. **Real-time Stats**: Performance monitoring with FPS, render times, and item counts
5. **Quadtree Visualization**: Toggle quadtree boundaries for debugging
6. **Flexible Rendering**: Works with any SVG elements or custom shapes
7. **Responsive**: Automatically handles window resizing

## Performance Tips

1. **Memoize your data**: Use `useMemo` for item arrays to prevent unnecessary rebuilds
2. **Efficient bounds calculation**: Keep `getItemBounds` function simple and fast
3. **Optimize rendering**: Use simple SVG elements when possible
4. **Buffer tuning**: Adjust `bufferScale` based on your use case (0.1-0.3 recommended)
5. **Item limits**: For best performance, keep item counts under 10,000 visible items

## Architecture

The component consists of several modular parts:

- **ZoomPanContainer**: Handles zoom/pan interactions and viewport tracking
- **QuadtreeRenderer**: Manages quadtree building and viewport querying
- **QuadtreeVisualization**: Renders quadtree boundaries for debugging
- **StatsDialog**: Shows performance metrics and controls
- **usePerformanceMonitor**: Hook for tracking FPS and timing metrics

Each component can be used independently for custom implementations.
