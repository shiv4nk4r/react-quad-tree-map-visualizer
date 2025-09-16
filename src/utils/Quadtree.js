// A simple Rectangle class for boundaries
class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // Keep w and h for backward compatibility
    this.w = width;
    this.h = height;
  }
  contains(point) {
    return (
      point.cx >= this.x &&
      point.cx <= this.x + this.width &&
      point.cy >= this.y &&
      point.cy <= this.y + this.height
    );
  }
  intersects(range) {
    return !(
      range.x > this.x + this.width ||
      range.x + range.width < this.x ||
      range.y > this.y + this.height ||
      range.y + range.height < this.y
    );
  }
}

const CAPACITY = 4; // Max number of dots per node before it subdivides

class Quadtree {
  constructor(boundary) {
    this.boundary = boundary;
    this.dots = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y, w, h);
    this.northeast = new Quadtree(ne);
    let nw = new Rectangle(x, y, w, h);
    this.northwest = new Quadtree(nw);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new Quadtree(se);
    let sw = new Rectangle(x, y + h, w, h);
    this.southwest = new Quadtree(sw);

    this.divided = true;
  }

  insert(dot) {
    if (!this.boundary.contains(dot)) {
      return false;
    }
    if (this.dots.length < CAPACITY) {
      this.dots.push(dot);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(dot)) return true;
      if (this.northwest.insert(dot)) return true;
      if (this.southeast.insert(dot)) return true;
      if (this.southwest.insert(dot)) return true;
    }
  }

  query(range, found) {
    if (!found) {
      found = [];
    }
    if (!this.boundary.intersects(range)) {
      return;
    }
    for (let dot of this.dots) {
      if (range.contains(dot)) {
        found.push(dot);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }
    return found;
  }
}

export { Quadtree, Rectangle };
