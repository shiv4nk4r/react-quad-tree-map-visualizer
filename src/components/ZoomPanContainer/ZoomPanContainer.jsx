import React, { useState, useEffect, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

/**
 * ZoomPanContainer - A reusable container that provides zoom and pan functionality
 * @param {ReactNode} children - Content to be rendered inside the zoom/pan area
 * @param {Object} worldBounds - World dimensions {width, height}
 * @param {number} initialScale - Initial zoom level
 * @param {number} minScale - Minimum zoom level
 * @param {number} maxScale - Maximum zoom level
 * @param {Function} onTransformChange - Callback when transform changes (scale, positionX, positionY) => void
 * @param {Function} onViewportChange - Callback when viewport changes (viewport) => void
 * @param {Object} containerStyle - Additional styles for the container
 */
const ZoomPanContainer = ({
  children,
  worldBounds,
  initialScale = 1,
  minScale = 0.1,
  maxScale = 10,
  onTransformChange,
  onViewportChange,
  containerStyle = {},
  ...transformWrapperProps
}) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [, setCurrentTransform] = useState({
    scale: initialScale,
    positionX: 0,
    positionY: 0,
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate current viewport
  const calculateViewport = useCallback(
    (transform) => {
      const { scale, positionX, positionY } = transform;
      const viewWidth = dimensions.width / scale;
      const viewHeight = dimensions.height / scale;
      const viewX = -positionX / scale;
      const viewY = -positionY / scale;

      return {
        x: viewX,
        y: viewY,
        width: viewWidth,
        height: viewHeight,
        scale: scale,
      };
    },
    [dimensions.width, dimensions.height]
  );

  // Handle transform changes
  const handleTransformChange = useCallback(
    (ref, state) => {
      const newTransform = {
        scale: state.scale,
        positionX: state.positionX,
        positionY: state.positionY,
      };

      setCurrentTransform(newTransform);
      onTransformChange?.(newTransform);

      const viewport = calculateViewport(newTransform);
      onViewportChange?.(viewport);
    },
    [onTransformChange, onViewportChange, calculateViewport]
  );

  const defaultContainerStyle = {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    background: "#1a1a1a",
    touchAction: "none", // Prevent default touch behaviors for better mobile interaction
    userSelect: "none", // Prevent text selection on mobile
    ...containerStyle,
  };

  return (
    <div style={defaultContainerStyle}>
      <TransformWrapper
        initialScale={initialScale}
        minScale={minScale}
        maxScale={maxScale}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }} // Enable pinch-to-zoom on mobile
        doubleClick={{ disabled: false, step: 0.7 }} // Enable double-tap zoom
        smooth={true}
        onTransformed={handleTransformChange}
        {...transformWrapperProps}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
          contentStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          <svg width={worldBounds.width} height={worldBounds.height}>
            {children}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ZoomPanContainer;
