import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Quadtree, Rectangle } from "../../utils/Quadtree"; // Import our new classes
import "./PolkaDotGenerator.css";

// The SVG component now takes the queried dots and quadtree boundaries
const PolkaDotSVG = ({
  dots,
  dotColor,
  width,
  height,
  quadtreeBounds = [],
  showQuadtree = true,
}) => (
  <svg width={width} height={height}>
    {/* Render quadtree boundaries conditionally */}
    {showQuadtree &&
      quadtreeBounds.map((bound, index) => (
        <rect
          key={`bound-${index}`}
          x={bound.x}
          y={bound.y}
          width={bound.width}
          height={bound.height}
          fill="none"
          stroke="rgba(255, 0, 0, 0.3)"
          strokeWidth="1"
        />
      ))}
    {/* Render dots */}
    {dots.map((dot, index) => (
      <circle key={index} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dotColor} />
    ))}
  </svg>
);

// Stats dialog component
const StatsDialog = ({
  stats,
  isVisible,
  onToggle,
  showQuadtree,
  onQuadtreeToggle,
}) => (
  <div className={`stats-dialog ${isVisible ? "visible" : ""}`}>
    <button className="stats-toggle" onClick={onToggle}>
      {isVisible ? "×" : "ℹ"}
    </button>
    {isVisible && (
      <div className="stats-content">
        <h4>Quadtree Stats</h4>
        <div>Total Dots: {stats.totalDots}</div>
        <div>Visible Dots: {stats.visibleDots}</div>
        <div>Quadtree Nodes: {stats.quadtreeNodes}</div>
        <div>Viewport: {stats.viewport}</div>
        <div>Zoom: {stats.zoom}x</div>

        <h4 style={{ marginTop: "16px" }}>Performance</h4>
        <div>FPS: {stats.fps}</div>
        <div>Render Time: {stats.renderTime}ms</div>
        <div>Query Time: {stats.queryTime}ms</div>

        <button className="quadtree-toggle" onClick={onQuadtreeToggle}>
          {showQuadtree ? "Hide" : "Show"} Quadtree
        </button>
      </div>
    )}
  </div>
);

const PolkaDotGenerator = () => {
  const [dotSize] = useState(2);
  const [dotSpacing] = useState(12);
  const [dotColor] = useState("#8a2be2");
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showStats, setShowStats] = useState(true);
  const [showQuadtree, setShowQuadtree] = useState(true);
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    renderTime: 0,
    queryTime: 0,
    frameCount: 0,
    lastTime: performance.now(),
  });
  const [currentTransform, setCurrentTransform] = useState({
    scale: 3,
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

  // FPS tracking
  useEffect(() => {
    let animationId;
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        // Update every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setPerformanceStats((prev) => ({
          ...prev,
          fps: fps,
          frameCount: 0,
        }));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Create a larger world area for panning
  const worldWidth = dimensions.width * 3;
  const worldHeight = dimensions.height * 3;

  // Memoize the entire Quadtree using the larger world dimensions
  const { quadtree, totalDots } = useMemo(() => {
    // 1. Generate all the dot data first (the expensive part)
    const allDots = [];
    const h = dotSpacing;
    const v = (dotSpacing * Math.sqrt(3)) / 2;

    let row = 0;
    let y = 0; // Start from 0 instead of v
    while (y < worldHeight + dotSize) {
      let x = row % 2 === 0 ? 0 : h / 2; // Start from 0
      while (x < worldWidth + dotSize) {
        allDots.push({ cx: x, cy: y, r: dotSize });
        x += h;
      }
      y += v;
      row++;
    }

    console.log(`Generated ${allDots.length} dots`); // Debug log

    // 2. Create the Quadtree and insert all the dots
    const boundary = new Rectangle(0, 0, worldWidth, worldHeight);
    const newQuadtree = new Quadtree(boundary);
    for (const dot of allDots) {
      newQuadtree.insert(dot);
    }

    // 3. Store quadtree for boundary collection later (don't collect all bounds here)
    return { quadtree: newQuadtree, totalDots: allDots.length };
  }, [dotSize, dotSpacing, worldWidth, worldHeight]);

  // Memoize the visible dots by querying the Quadtree based on viewport
  const visibleDots = useMemo(() => {
    if (!quadtree) return [];

    const queryStartTime = performance.now();

    // Calculate visible viewport based on current transform
    const { scale, positionX, positionY } = currentTransform;
    const viewWidth = dimensions.width / scale;
    const viewHeight = dimensions.height / scale;
    const viewX = -positionX / scale;
    const viewY = -positionY / scale;

    // Add buffer around the viewport for seamless rendering
    const bufferScale = 0.2; // 20% buffer on each side
    const bufferX = viewWidth * bufferScale;
    const bufferY = viewHeight * bufferScale;

    const bufferedViewport = new Rectangle(
      viewX - bufferX,
      viewY - bufferY,
      viewWidth + bufferX * 2,
      viewHeight + bufferY * 2
    );

    const dots = quadtree.query(bufferedViewport);

    const queryEndTime = performance.now();
    const queryTime = queryEndTime - queryStartTime;

    // Update performance stats
    setPerformanceStats((prev) => ({
      ...prev,
      queryTime: Number(queryTime.toFixed(2)),
    }));

    console.log(
      `Viewport: x=${viewX.toFixed(2)}, y=${viewY.toFixed(
        2
      )}, w=${viewWidth.toFixed(2)}, h=${viewHeight.toFixed(2)}`
    );
    console.log(
      `Buffered: x=${(viewX - bufferX).toFixed(2)}, y=${(
        viewY - bufferY
      ).toFixed(2)}, w=${(viewWidth + bufferX * 2).toFixed(2)}, h=${(
        viewHeight +
        bufferY * 2
      ).toFixed(2)}`
    );
    console.log(
      `Transform: scale=${scale}, posX=${positionX}, posY=${positionY}`
    );
    console.log(
      `Found ${dots.length} visible dots in ${queryTime.toFixed(2)}ms`
    );

    return dots;
  }, [quadtree, currentTransform, dimensions.width, dimensions.height]);

  // Memoize the visible quadtree boundaries based on viewport
  const visibleQuadtreeBounds = useMemo(() => {
    if (!quadtree) return [];

    // Calculate the same viewport used for dots
    const { scale, positionX, positionY } = currentTransform;
    const viewWidth = dimensions.width / scale;
    const viewHeight = dimensions.height / scale;
    const viewX = -positionX / scale;
    const viewY = -positionY / scale;

    // Add buffer for quadtree bounds (same as dots)
    const bufferScale = 0.2;
    const bufferX = viewWidth * bufferScale;
    const bufferY = viewHeight * bufferScale;

    const viewport = new Rectangle(
      viewX - bufferX,
      viewY - bufferY,
      viewWidth + bufferX * 2,
      viewHeight + bufferY * 2
    );

    // Collect only quadtree boundaries that intersect with viewport
    const bounds = [];
    const collectVisibleBounds = (node) => {
      if (node && viewport.intersects(node.boundary)) {
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
  }, [quadtree, currentTransform, dimensions.width, dimensions.height]);

  // Track render time
  useEffect(() => {
    const renderStartTime = performance.now();

    // Use requestAnimationFrame to measure render completion
    requestAnimationFrame(() => {
      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime;

      setPerformanceStats((prev) => ({
        ...prev,
        renderTime: Number(renderTime.toFixed(2)),
      }));
    });
  }, [visibleDots, showQuadtree]); // Re-measure when content changes

  // Stats for the dialog
  const stats = {
    totalDots: totalDots,
    visibleDots: visibleDots.length,
    quadtreeNodes: visibleQuadtreeBounds.length,
    viewport: `${Math.round(currentTransform.positionX)}, ${Math.round(
      currentTransform.positionY
    )}`,
    zoom: currentTransform.scale.toFixed(2),
    fps: performanceStats.fps,
    renderTime: performanceStats.renderTime,
    queryTime: performanceStats.queryTime,
  };

  return (
    <div className="polka-dot-container">
      <TransformWrapper
        initialScale={3}
        minScale={0.1}
        maxScale={5}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        onTransformed={(ref, state) => {
          setCurrentTransform({
            scale: state.scale,
            positionX: state.positionX,
            positionY: state.positionY,
          });
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
          contentStyle={{
            width: "100%",
            height: "100%",
          }}
        >
          <PolkaDotSVG
            dots={visibleDots}
            dotColor={dotColor}
            width={worldWidth}
            height={worldHeight}
            quadtreeBounds={visibleQuadtreeBounds}
            showQuadtree={showQuadtree}
          />
        </TransformComponent>
      </TransformWrapper>

      <StatsDialog
        stats={stats}
        isVisible={showStats}
        onToggle={() => setShowStats(!showStats)}
        showQuadtree={showQuadtree}
        onQuadtreeToggle={() => setShowQuadtree(!showQuadtree)}
      />
    </div>
  );
};

export default PolkaDotGenerator;
