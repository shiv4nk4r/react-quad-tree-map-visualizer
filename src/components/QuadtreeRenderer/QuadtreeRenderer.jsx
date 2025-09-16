import React, { useMemo, useCallback, useEffect } from "react";
import { Quadtree, Rectangle } from "../../utils/Quadtree";

/**
 * Generic QuadtreeRenderer component that can render any type of items using quadtree optimization
 * @param {Array} items - Array of items to be spatially indexed
 * @param {Function} getItemBounds - Function that returns {x, y, width, height} for an item
 * @param {Function} renderItem - Function that renders a single item (item, index) => JSX
 * @param {Object} viewport - Current viewport {x, y, width, height, scale}
 * @param {Object} worldBounds - World boundaries {width, height}
 * @param {number} bufferScale - Buffer around viewport (0.2 = 20% buffer)
 * @param {boolean} bypassQuadtree - If true, render all items without quadtree optimization
 * @param {Function} onPerformanceUpdate - Callback for performance metrics
 */
const QuadtreeRenderer = ({
  items = [],
  getItemBounds,
  renderItem,
  viewport,
  worldBounds,
  bufferScale = 0.2,
  bypassQuadtree = false,
  onPerformanceUpdate,
  children,
}) => {
  // Memoize the quadtree creation
  const { quadtree, buildTime, itemCount } = useMemo(() => {
    const startTime = performance.now();

    // Create the quadtree boundary
    const boundary = new Rectangle(0, 0, worldBounds.width, worldBounds.height);
    const newQuadtree = new Quadtree(boundary);

    // Insert all items into the quadtree
    for (const item of items) {
      const bounds = getItemBounds(item);
      const quadtreeItem = {
        ...item,
        cx: bounds.x + bounds.width / 2,
        cy: bounds.y + bounds.height / 2,
        originalItem: item,
      };
      newQuadtree.insert(quadtreeItem);
    }

    const buildTime = performance.now() - startTime;

    return {
      quadtree: newQuadtree,
      buildTime,
      itemCount: items.length,
    };
  }, [items, worldBounds.width, worldBounds.height, getItemBounds]);

  // Report quadtree build performance after render
  useEffect(() => {
    onPerformanceUpdate?.({
      type: "quadtree_build",
      time: buildTime,
      itemCount: itemCount,
    });
  }, [buildTime, itemCount, onPerformanceUpdate]);

  // Get visible items based on viewport and bypass setting
  const { visibleItems, queryTime, visibleCount } = useMemo(() => {
    if (bypassQuadtree) {
      // Bypass quadtree - render all items directly
      return {
        visibleItems: items.map((item) => ({ originalItem: item })),
        queryTime: 0,
        visibleCount: items.length,
      };
    }

    if (!quadtree || !viewport)
      return { visibleItems: [], queryTime: 0, visibleCount: 0 };

    const queryStartTime = performance.now();

    // Calculate buffered viewport
    const bufferX = viewport.width * bufferScale;
    const bufferY = viewport.height * bufferScale;

    const bufferedViewport = new Rectangle(
      viewport.x - bufferX,
      viewport.y - bufferY,
      viewport.width + bufferX * 2,
      viewport.height + bufferY * 2
    );

    // Query the quadtree
    const quadtreeItems = quadtree.query(bufferedViewport);

    const queryTime = performance.now() - queryStartTime;

    return {
      visibleItems: quadtreeItems,
      queryTime,
      visibleCount: quadtreeItems.length,
    };
  }, [quadtree, viewport, bufferScale, bypassQuadtree, items]);

  // Report query performance after render
  useEffect(() => {
    if (bypassQuadtree) {
      onPerformanceUpdate?.({
        type: "direct_render",
        time: 0,
        visibleCount: items.length,
      });
    } else if (queryTime > 0) {
      onPerformanceUpdate?.({
        type: "quadtree_query",
        time: queryTime,
        visibleCount: visibleCount,
      });
    }
  }, [
    queryTime,
    visibleCount,
    onPerformanceUpdate,
    bypassQuadtree,
    items.length,
  ]);

  // Get visible quadtree boundaries for visualization
  const getVisibleBounds = useCallback(() => {
    if (!quadtree || !viewport) return [];

    const bufferX = viewport.width * bufferScale;
    const bufferY = viewport.height * bufferScale;

    const viewportRect = new Rectangle(
      viewport.x - bufferX,
      viewport.y - bufferY,
      viewport.width + bufferX * 2,
      viewport.height + bufferY * 2
    );

    const bounds = [];
    const collectVisibleBounds = (node) => {
      if (node && viewportRect.intersects(node.boundary)) {
        bounds.push({
          x: node.boundary.x,
          y: node.boundary.y,
          width: node.boundary.width,
          height: node.boundary.height,
        });
        if (node.northwest) {
          collectVisibleBounds(node.northwest);
          collectVisibleBounds(node.northeast);
          collectVisibleBounds(node.southwest);
          collectVisibleBounds(node.southeast);
        }
      }
    };
    collectVisibleBounds(quadtree);

    return bounds;
  }, [quadtree, viewport, bufferScale]);

  return (
    <>
      {visibleItems.map((item, index) =>
        renderItem(item.originalItem || item, index)
      )}
      {children &&
        children({
          visibleItems,
          quadtree,
          getVisibleBounds,
          totalItems: items.length,
        })}
    </>
  );
};

export default QuadtreeRenderer;
