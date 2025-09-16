import React, { useState, useMemo, useCallback } from "react";
import ZoomPanContainer from "../ZoomPanContainer/ZoomPanContainer";
import QuadtreeRenderer from "../QuadtreeRenderer/QuadtreeRenderer";
import QuadtreeVisualization from "../QuadtreeVisualization/QuadtreeVisualization";
import StatsDialog from "../StatsDialog/StatsDialog";
import usePerformanceMonitor from "../../hooks/usePerformanceMonitor";
import "./PolkaDotGenerator.css";

/**
 * GenericQuadtreeVisualization - A flexible component that can render any type of items
 * @param {Array} items - Array of items to render
 * @param {Function} getItemBounds - Function that returns bounds for each item
 * @param {Function} renderItem - Function that renders each item as JSX
 * @param {Object} worldBounds - World dimensions {width, height}
 * @param {number} initialScale - Initial zoom level
 * @param {Object} config - Additional configuration options
 */
const GenericQuadtreeVisualization = ({
  items = [],
  getItemBounds,
  renderItem,
  worldBounds,
  initialScale = 1,
  minScale = 0.1,
  maxScale = 10,
  bufferScale = 0.2,
  showQuadtreeDefault = true,
  showStatsDefault = true,
  title = "Quadtree Visualization",
  containerClassName = "polka-dot-container",
}) => {
  // Component state
  const [showStats, setShowStats] = useState(showStatsDefault);
  const [showQuadtree, setShowQuadtree] = useState(showQuadtreeDefault);
  const [bypassQuadtree, setBypassQuadtree] = useState(false);
  const [viewport, setViewport] = useState(null);
  const [transform, setTransform] = useState({
    scale: initialScale,
    positionX: 0,
    positionY: 0,
  });

  // Performance monitoring
  const { stats, updateMetrics } = usePerformanceMonitor();

  // Handle performance updates from QuadtreeRenderer
  const handlePerformanceUpdate = useCallback(
    (metrics) => {
      if (metrics.type === "quadtree_query") {
        updateMetrics({
          queryTime: metrics.time,
          visibleItems: metrics.visibleCount,
        });
      }
    },
    [updateMetrics]
  );

  // Handle viewport changes
  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
  }, []);

  // Handle transform changes
  const handleTransformChange = useCallback((newTransform) => {
    setTransform(newTransform);
  }, []);

  // Prepare stats for the dialog
  const dialogStats = {
    ...stats,
    viewport: viewport
      ? `${Math.round(viewport.x)}, ${Math.round(viewport.y)}`
      : "N/A",
    zoom: transform.scale.toFixed(2),
    totalItems: items.length,
    renderMode: bypassQuadtree ? "Direct" : "Quadtree",
  };

  // Actions for the stats dialog
  const statsActions = [
    {
      label: showQuadtree ? "Hide Quadtree" : "Show Quadtree",
      onClick: () => setShowQuadtree(!showQuadtree),
      className: "primary",
    },
    {
      label: bypassQuadtree ? "Use Quadtree" : "Bypass Quadtree",
      onClick: () => setBypassQuadtree(!bypassQuadtree),
      className: bypassQuadtree ? "warning" : "secondary",
    },
  ];

  return (
    <div className={containerClassName}>
      <ZoomPanContainer
        worldBounds={worldBounds}
        initialScale={initialScale}
        minScale={minScale}
        maxScale={maxScale}
        onViewportChange={handleViewportChange}
        onTransformChange={handleTransformChange}
      >
        <QuadtreeRenderer
          items={items}
          getItemBounds={getItemBounds}
          renderItem={renderItem}
          viewport={viewport}
          worldBounds={worldBounds}
          bufferScale={bufferScale}
          bypassQuadtree={bypassQuadtree}
          onPerformanceUpdate={handlePerformanceUpdate}
        >
          {({ getVisibleBounds }) => (
            <QuadtreeVisualization
              bounds={getVisibleBounds()}
              visible={showQuadtree}
              strokeColor="rgba(255, 0, 0, 0.3)"
              strokeWidth={1}
            />
          )}
        </QuadtreeRenderer>
      </ZoomPanContainer>

      <StatsDialog
        stats={dialogStats}
        isVisible={showStats}
        onToggle={() => setShowStats(!showStats)}
        actions={statsActions}
        title={title}
      />
    </div>
  );
};

/**
 * PolkaDotGenerator - Example implementation using polka dots
 * Demonstrates how to use the generic quadtree visualization
 */
const PolkaDotGenerator = () => {
  // Polka dot configuration
  const [dotSize] = useState(2);
  const [dotSpacing] = useState(9);
  const [dotColor] = useState("#8a2be2");

  // Performance monitoring for data generation
  const { updateMetrics } = usePerformanceMonitor();

  // World dimensions (4x screen size for panning area)
  const worldBounds = useMemo(
    () => ({
      width: window.innerWidth * 4,
      height: window.innerHeight * 4,
    }),
    []
  );

  // Generate polka dot data
  const dots = useMemo(() => {
    const startTime = performance.now();

    const allDots = [];
    const h = dotSpacing;
    const v = (dotSpacing * Math.sqrt(3)) / 2;

    let row = 0;
    let y = 0;
    while (y < worldBounds.height + dotSize) {
      let x = row % 2 === 0 ? 0 : h / 2;
      while (x < worldBounds.width + dotSize) {
        allDots.push({
          id: `dot-${allDots.length}`,
          x: x - dotSize / 2,
          y: y - dotSize / 2,
          size: dotSize,
          color: dotColor,
        });
        x += h;
      }
      y += v;
      row++;
    }

    const buildTime = performance.now() - startTime;
    updateMetrics({
      quadtreeBuildTime: buildTime,
      totalItems: allDots.length,
    });

    return allDots;
  }, [
    dotSize,
    dotSpacing,
    dotColor,
    worldBounds.width,
    worldBounds.height,
    updateMetrics,
  ]);

  // Function to get bounds for each dot (required by QuadtreeRenderer)
  const getItemBounds = (dot) => ({
    x: dot.x,
    y: dot.y,
    width: dot.size,
    height: dot.size,
  });

  // Function to render each dot (required by QuadtreeRenderer)
  const renderDot = (dot, index) => (
    <circle
      key={dot.id || index}
      cx={dot.x + dot.size / 2}
      cy={dot.y + dot.size / 2}
      r={dot.size}
      fill={dot.color}
    />
  );

  return (
    <GenericQuadtreeVisualization
      items={dots}
      getItemBounds={getItemBounds}
      renderItem={renderDot}
      worldBounds={worldBounds}
      initialScale={3}
      minScale={0.3}
      maxScale={10}
      bufferScale={0.2}
      title="Polka Dot Demo"
      showQuadtreeDefault={true}
      showStatsDefault={true}
    />
  );
};

// Export both components
export { GenericQuadtreeVisualization };
export default PolkaDotGenerator;
