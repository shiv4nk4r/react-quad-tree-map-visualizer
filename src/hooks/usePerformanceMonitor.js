import { useState, useEffect, useCallback, useRef } from "react";

/**
 * usePerformanceMonitor - Hook for tracking FPS and performance metrics
 * @param {boolean} enabled - Whether to track performance (default: true)
 * @returns {Object} Performance stats and update function
 */
const usePerformanceMonitor = (enabled = true) => {
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    frameTime: 0,
    queryTime: 0,
    renderTime: 0,
    quadtreeBuildTime: 0,
    visibleItems: 0,
    totalItems: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef(null);

  // FPS tracking
  useEffect(() => {
    if (!enabled) return;

    const updateFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= 1000) {
        // Update every second
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        const frameTime = deltaTime / frameCountRef.current;

        setPerformanceStats((prev) => ({
          ...prev,
          fps: fps,
          frameTime: Number(frameTime.toFixed(2)),
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationIdRef.current = requestAnimationFrame(updateFPS);
    };

    animationIdRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [enabled]);

  // Update performance metrics
  const updateMetrics = useCallback((metrics) => {
    setPerformanceStats((prev) => ({
      ...prev,
      ...metrics,
    }));
  }, []);

  // Track render time for components
  const trackRenderTime = useCallback(
    (renderFunction) => {
      if (!enabled) return renderFunction();

      const startTime = performance.now();
      const result = renderFunction();
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      updateMetrics({ renderTime: Number(renderTime.toFixed(2)) });
      return result;
    },
    [enabled, updateMetrics]
  );

  // Track async operations
  const trackAsyncOperation = useCallback(
    async (operation, metricName) => {
      if (!enabled) return await operation();

      const startTime = performance.now();
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;

      updateMetrics({ [metricName]: Number(duration.toFixed(2)) });
      return result;
    },
    [enabled, updateMetrics]
  );

  return {
    stats: performanceStats,
    updateMetrics,
    trackRenderTime,
    trackAsyncOperation,
    enabled,
  };
};

export default usePerformanceMonitor;
