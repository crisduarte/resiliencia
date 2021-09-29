class Particle {
  constructor(size, mesh) {
    this.size = size;
    this.x = random(mesh.xmin, mesh.xmax);
    this.y = random(mesh.ymin, mesh.ymax);
    this.dx = 0.0;
    this.dy = 0.0;
    this.velocity = 0.0;
    this.fx = 0.0;
    this.fy = 0.0;
    this.mesh = mesh;
  }

  draw() {
    circle(this.x, this.y, this.size);
  }

  update_force() {
    // mouse interaction
    if (mouseIsPressed) {
      var d = dist(this.x, this.y, mouseX, mouseY) / 100;
      this.fx += ((this.x - mouseX) / (d * d + 1)) * this.mesh.external_force;
      this.fy += ((this.y - mouseY) / (d * d + 1)) * this.mesh.external_force;
    } else {
      // friction loss
      this.fx -= this.mesh.loss * this.dx;
      this.fy -= this.mesh.loss * this.dy;
    }
  }

  update_location(dt) {
    // update speed
    this.dx += this.fx * dt * dt;
    this.dy += this.fy * dt * dt;
    this.velocity = dist(0, 0, this.dx, this.dy);
    
    // reset forces
    this.fx = 0.0;
    this.fy = 0.0;

    // update location
    this.x += this.dx * dt;
    this.y += this.dy * dt;

    // bounce left/right
    if (this.x < this.mesh.xmin && this.dx < 0) {
      this.x = this.mesh.xmin;
      this.dx *= this.mesh.bouncing_const;
    } else if (this.x > this.mesh.xmax && this.dx > 0) {
      this.x = this.mesh.xmax;
      this.dx *= this.mesh.bouncing_const;
    }
    
    // bounce top/bottom
    if (this.y < this.mesh.ymin && this.dy < 0) {
      this.y = this.mesh.ymin;
      this.dy *= this.mesh.bouncing_const;
    } else if (this.y > this.mesh.ymax && this.dy > 0) {
      this.y = this.mesh.ymax;
      this.dy *= this.mesh.bouncing_const;
    }
  }
}
