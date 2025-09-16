// Main Components
export { default as QuadtreeRenderer } from "./QuadtreeRenderer/QuadtreeRenderer";
export { default as ZoomPanContainer } from "./ZoomPanContainer/ZoomPanContainer";
export { default as QuadtreeVisualization } from "./QuadtreeVisualization/QuadtreeVisualization";
export { default as StatsDialog } from "./StatsDialog/StatsDialog";

// Hooks
export { default as usePerformanceMonitor } from "../hooks/usePerformanceMonitor";

// Utilities
export { Quadtree, Rectangle } from "../utils/Quadtree";

// Example Implementations
export { default as PolkaPattern } from "./PolkaDot/PolkaDotGeneratorRefactored"; // Use refactored version
export { default as PolkaDotGenerator } from "./PolkaDot/PolkaDotGeneratorRefactored";
export { default as PolkaDotGeneratorLegacy } from "./PolkaDot/PolkaDotGenerator"; // Keep original as legacy

// Re-export react-zoom-pan-pinch for convenience
export { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
