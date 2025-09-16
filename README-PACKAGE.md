# React Quadtree Zoom Pan Renderer

A high-performance React library for rendering large datasets with zoom and pan functionality using quadtree spatial indexing.

## Features

- ⚡ **High Performance**: Quadtree spatial indexing for optimal rendering
- 🔍 **Zoom & Pan**: Smooth zoom and pan with `react-zoom-pan-pinch`
- 📊 **Performance Monitoring**: Built-in FPS and timing metrics
- 🎨 **Customizable**: Flexible rendering functions for any data type
- 🔧 **Developer Tools**: Debug visualization and stats dialog
- 📦 **Modular**: Use individual components or the complete system

## Installation

```bash
npm install react-quadtree-zoom-pan
# or
yarn add react-quadtree-zoom-pan
```

## Quick Start

```jsx
import React from "react";
import {
  ZoomPanContainer,
  QuadtreeRenderer,
  StatsDialog,
  usePerformanceMonitor,
} from "react-quadtree-zoom-pan";

function MyVisualization() {
  const { stats } = usePerformanceMonitor();
  const [viewport, setViewport] = useState(null);

  // Your data items
  const items = [
    { id: 1, x: 100, y: 100, size: 10, color: "red" },
    { id: 2, x: 200, y: 150, size: 8, color: "blue" },
    // ... thousands more items
  ];

  // Define how to get bounds for each item
  const getItemBounds = (item) => ({
    x: item.x,
    y: item.y,
    width: item.size,
    height: item.size,
  });

  // Define how to render each item
  const renderItem = (item, index) => (
    <circle
      key={item.id}
      cx={item.x + item.size / 2}
      cy={item.y + item.size / 2}
      r={item.size / 2}
      fill={item.color}
    />
  );

  return (
    <div>
      <ZoomPanContainer
        worldBounds={{ width: 2000, height: 2000 }}
        onViewportChange={setViewport}
      >
        <QuadtreeRenderer
          items={items}
          getItemBounds={getItemBounds}
          renderItem={renderItem}
          viewport={viewport}
          worldBounds={{ width: 2000, height: 2000 }}
        />
      </ZoomPanContainer>

      <StatsDialog stats={stats} />
    </div>
  );
}
```

## Components

### QuadtreeRenderer

The core component that provides quadtree-optimized rendering.

```jsx
<QuadtreeRenderer
  items={data} // Array of items to render
  getItemBounds={getBounds} // Function: item => {x, y, width, height}
  renderItem={renderFunction} // Function: (item, index) => JSX
  viewport={currentViewport} // Current viewport bounds
  worldBounds={worldDimensions} // World dimensions
  bufferScale={0.2} // Viewport buffer (20%)
  onPerformanceUpdate={callback} // Performance metrics callback
/>
```

### ZoomPanContainer

Provides zoom and pan functionality with viewport tracking.

```jsx
<ZoomPanContainer
  worldBounds={{ width: 2000, height: 2000 }}
  initialScale={1}
  minScale={0.1}
  maxScale={10}
  onViewportChange={handleViewport}
  onTransformChange={handleTransform}
>
  {/* Your content */}
</ZoomPanContainer>
```

### QuadtreeVisualization

Renders quadtree boundary lines for debugging.

```jsx
<QuadtreeVisualization
  bounds={quadtreeBounds}
  visible={showDebug}
  strokeColor="red"
  strokeWidth={1}
/>
```

### StatsDialog

Performance and debug information overlay.

```jsx
<StatsDialog
  stats={performanceStats}
  isVisible={showStats}
  onToggle={toggleStats}
  actions={[{ label: "Reset", onClick: handleReset }]}
/>
```

## Hooks

### usePerformanceMonitor

Tracks FPS and performance metrics.

```jsx
const {
  stats, // Current performance stats
  updateMetrics, // Update specific metrics
  trackRenderTime, // Measure render performance
  enabled, // Enable/disable monitoring
} = usePerformanceMonitor();
```

## Advanced Usage

### Custom Item Types

```jsx
// For any data structure
const mapItems = [
  { lat: 40.7128, lng: -74.006, type: "city" },
  { lat: 34.0522, lng: -118.2437, type: "city" },
];

const getMapItemBounds = (item) => {
  const pixelX = lngToPixel(item.lng);
  const pixelY = latToPixel(item.lat);
  return { x: pixelX, y: pixelY, width: 10, height: 10 };
};

const renderMapItem = (item) => (
  <circle
    cx={lngToPixel(item.lng)}
    cy={latToPixel(item.lat)}
    r={5}
    fill={item.type === "city" ? "red" : "blue"}
  />
);
```

### Performance Optimization

```jsx
// Use bufferScale to control viewport buffer
<QuadtreeRenderer
  bufferScale={0.1} // Smaller buffer = better performance
  // or
  bufferScale={0.5} // Larger buffer = smoother panning
/>;

// Track performance metrics
const handlePerformanceUpdate = (metrics) => {
  if (metrics.type === "quadtree_query") {
    console.log(
      `Query took ${metrics.time}ms for ${metrics.visibleCount} items`
    );
  }
};
```

### Custom Styling

```jsx
// Custom container styles
<ZoomPanContainer
  containerStyle={{
    background: '#f0f0f0',
    border: '1px solid #ccc'
  }}
/>

// Custom stats dialog position
<StatsDialog
  position="top-left"  // or "bottom-left", "top-right"
  style={{ fontSize: '12px' }}
/>
```

## API Reference

[Detailed API documentation coming soon]

## Examples

- **Polka Dots**: Basic pattern rendering
- **Map Visualization**: Geographic data points
- **Particle System**: Animated particles
- **Data Visualization**: Charts and graphs

## Performance Tips

1. **Use appropriate buffer sizes**: Balance between performance and smoothness
2. **Optimize render functions**: Keep item rendering lightweight
3. **Batch updates**: Update multiple items together when possible
4. **Monitor performance**: Use the built-in performance monitoring

## License

MIT

## Contributing

Pull requests welcome! Please read our contributing guidelines first.
