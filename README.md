# React Quadtree Map Visualizer

A high-performance React application that demonstrates spatial data structures and optimization techniques using **quadtree** algorithms. This interactive visualization shows how quadtrees can dramatically improve rendering performance when dealing with thousands of visual elements.

## 🎯 What This Project Demonstrates

This project showcases:

- **Spatial Data Structures**: Implementation of quadtree algorithms for efficient spatial partitioning
- **Performance Optimization**: How to render thousands of elements smoothly using viewport culling
- **Interactive Visualizations**: Zoom, pan, and explore large datasets with smooth 60fps performance
- **Real-time Performance Monitoring**: Built-in FPS counter and rendering statistics
- **Quadtree Visualization**: See the actual quadtree structure overlaid on your data

## 🚀 Live Features

### Multiple Visualization Examples

- **Polka Dots**: Thousands of colorful circles with smooth zoom/pan
- **Rectangles**: Randomly positioned and sized rectangular elements
- **Stars**: Complex star-shaped SVG elements with rotation
- **Text Labels**: Dynamic text rendering with font scaling
- **Mixed Elements**: Combination of different shape types

### Performance Features

- **Viewport Culling**: Only renders elements visible in the current view
- **Quadtree Spatial Indexing**: O(log n) spatial queries instead of O(n) brute force
- **Real-time FPS Monitoring**: See exactly how many frames per second you're getting
- **Performance Statistics**: Query times, render counts, and optimization metrics
- **Bypass Mode**: Toggle quadtree optimization on/off to see the performance difference

### Interactive Controls

- **Zoom**: Mouse wheel or touch gestures to zoom in/out (0.1x to 10x)
- **Pan**: Click and drag to navigate around the world
- **Toggle Quadtree Visualization**: See the spatial partitioning boundaries
- **Performance Stats Dialog**: Real-time metrics and controls
- **Example Switcher**: Compare different types of visualizations

## 🛠️ Technical Architecture

### Core Components

1. **GenericQuadtreeVisualization**: Main component that orchestrates the entire system
2. **Quadtree Implementation**: Custom spatial data structure for efficient element queries
3. **ZoomPanContainer**: Handles all zoom/pan interactions and viewport management
4. **QuadtreeRenderer**: Manages quadtree building and viewport-based element filtering
5. **Performance Monitor**: Tracks FPS, render times, and optimization metrics

### Key Algorithms

- **Quadtree Spatial Partitioning**: Recursively divides 2D space into quadrants
- **Viewport Culling**: Only processes elements within the visible area
- **Frustum Culling**: Includes buffer zone for smooth panning experience
- **Efficient Boundary Checking**: Fast intersection tests for spatial queries

## 📊 Performance Benefits

Without quadtree optimization:

- **10,000 elements**: ~5-15 FPS, sluggish interactions
- **Linear time complexity**: O(n) for every frame

With quadtree optimization:

- **10,000 elements**: Smooth 60 FPS, responsive interactions
- **Logarithmic time complexity**: O(log n) spatial queries
- **Memory efficient**: Only renders visible elements

## 🎮 How to Use

### Development Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Basic Usage

1. **Navigate**: Click and drag to pan around the visualization
2. **Zoom**: Use mouse wheel or pinch gestures to zoom in/out
3. **Switch Examples**: Use the dropdown to try different visualizations
4. **Toggle Features**:
   - Click "Show Quadtree" to see spatial partitioning
   - Click "Show Stats" to view performance metrics
   - Toggle "Bypass Quadtree" to compare performance

### Understanding the Quadtree

The quadtree visualization (green rectangles) shows how the space is divided:

- **Dense areas** get subdivided into smaller regions
- **Sparse areas** remain as larger regions
- **Dynamic partitioning** adapts to your data distribution

## 🎨 Customization

This project is designed to be a flexible foundation. You can:

- **Add new element types**: Create custom shapes and rendering functions
- **Modify spatial algorithms**: Experiment with different tree structures
- **Adjust performance parameters**: Tune viewport buffers and subdivision thresholds
- **Create new examples**: Implement your own data visualizations

See `GENERIC_USAGE.md` for detailed documentation on extending the system.

## 🧮 Educational Value

Perfect for learning about:

- **Spatial Data Structures**: Quadtrees, spatial indexing, and geometric algorithms
- **Performance Optimization**: Viewport culling, efficient rendering, and bottleneck analysis
- **React Performance**: Memoization, efficient re-rendering, and performance monitoring
- **Computer Graphics**: 2D transformations, viewport management, and rendering pipelines
- **Algorithm Visualization**: Making abstract concepts tangible and interactive

## 🔧 Built With

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Zoom Pan Pinch** - Smooth zoom/pan interactions
- **Tabler Icons** - Beautiful iconography
- **Custom Quadtree Implementation** - Educational spatial data structure

## 📈 Performance Metrics

The built-in performance monitor tracks:

- **FPS (Frames Per Second)**: Real-time frame rate
- **Query Time**: Time to find visible elements
- **Render Count**: Number of elements actually drawn
- **Total Elements**: Complete dataset size
- **Quadtree Depth**: Spatial subdivision levels

## 🎯 Use Cases

This visualization technique is used in:

- **Game Engines**: Spatial culling in 2D/3D games
- **Mapping Applications**: Efficient tile and marker rendering
- **Scientific Visualization**: Large dataset exploration
- **Data Analytics**: Interactive scatter plots and spatial analysis
- **Computer Graphics**: Collision detection and spatial queries
