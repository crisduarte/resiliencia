class Mesh {
  constructor(xmin, ymin, xmax, ymax, loss, external_force, bouncing_const) {
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
    this.max_length = dist(0, 0, xmax - xmin, ymax - ymin);
    this.loss = loss;
    this.external_force = external_force;
    this.bouncing_const = bouncing_const;
    this.rows = 0;
    this.cols = 0;
    this.particles = [];
    this.springs = [];
    this.particles_tinker = null;
    this.springs_tinker = null;
  }

  draw() {
    // springs
    stroke(34, 34, 36);
    for (var i = 0; i < this.springs.length; i++) {
      this.springs[i].draw();
    }
    //particles
    strokeWeight(0);
    fill(40, 41, 48, 25);
    for (i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
    }
  }
  
  mean(x) {
    return x.reduce((a, b) => a + b) / x.length;
  }
  
  var(x) {
    var res = 0.0;
    var mx = this.mean(x);
    for (var i = 0; i < x.length; i++) {
      res += pow(x[i] - mx, 2);
    }
    return res / x.length;
  }

  cov(x, y) {
    var res = 0.0;
    var mx = this.mean(x);
    var my = this.mean(y);
    for (var i = 0; i < x.length; i++) {
      res += (x[i] - mx) * (y[i] - my);
    }
    return res / x.length;
  }

  update_force() {
    // springs
    for (var i = 0; i < this.springs.length; i++) {
      this.springs[i].update_force();
    }
    // mouse, friction loss
    for (i = 0; i < this.particles.length; i++) {
      this.particles[i].update_force();
    }
  }
  
  update_tinker() {
    // springs
    if (this.springs_tinker)
      this.springs_tinker.update();
    
    // particles
    if (this.particles_tinker)
      this.particles_tinker.update();
  }

  update_location(dt) {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update_location(dt);
    }
  }
  
  add_particles(rows, cols, size) {
    this.particles = [];
    this.rows = rows;
    this.cols = cols;
    for (var i = 0; i < rows * cols; i++) {
      this.particles[i] = new Particle(size, this);
    }
  }
  
  add_spring(p1, p2, thickness, rest_len, constant) {
    this.springs[this.springs.length] = new Spring(p1, p2, thickness, rest_len, constant, this);
  }

  set_triangle_topology(thickness, rest_len, constant) {
    this.springs = [];
    for (var i = 0; i < this.rows - 1; i++) {
      for (var j = 0; j < this.cols - 1; j++) {
        var a = this.particles[i * this.cols + j];
        var b = this.particles[i * this.cols + j + 1];
        var c = this.particles[(i + 1) * this.cols + j];
        var d = this.particles[(i + 1) * this.cols + j + 1];
        this.add_spring(a, b, thickness, rest_len, constant);
        this.add_spring(a, c, thickness, rest_len, constant);
        this.add_spring(b, c, thickness, rest_len, constant);
        this.add_spring(b, d, thickness, rest_len, constant);
        this.add_spring(c, d, thickness, rest_len, constant);
      }
    }
  }

  set_moore_topology(thickness, rest_len, constant) {
    this.springs = [];
    for (var i = 0; i < this.rows - 1; i++) {
      for (var j = 0; j < this.cols - 1; j++) {
        var a = this.particles[i * this.cols + j];
        var b = this.particles[i * this.cols + j + 1];
        var c = this.particles[(i + 1) * this.cols + j];
        var d = this.particles[(i + 1) * this.cols + j + 1];
        this.add_spring(a, b, thickness, rest_len, constant);
        this.add_spring(a, c, thickness, rest_len, constant);
        this.add_spring(a, d, thickness, rest_len, constant);
        this.add_spring(b, c, thickness, rest_len, constant);
        this.add_spring(b, d, thickness, rest_len, constant);
        this.add_spring(c, d, thickness, rest_len, constant);
      }
    }
  }
  
  set_vonneumann_topology(thickness, rest_len, constant) {
    this.springs = [];
    for (var i = 0; i < this.rows - 1; i++) {
      for (var j = 0; j < this.cols - 1; j++) {
        var a = this.particles[i * this.cols + j];
        var b = this.particles[i * this.cols + j + 1];
        var c = this.particles[(i + 1) * this.cols + j];
        var d = this.particles[(i + 1) * this.cols + j + 1];
        this.add_spring(a, b, thickness, rest_len, constant);
        this.add_spring(a, c, thickness, rest_len, constant);
        this.add_spring(b, d, thickness, rest_len, constant);
        this.add_spring(c, d, thickness, rest_len, constant);
      }
    }
  }
  
  add_springs_tinker(tinker, prob) {
    this.springs_tinker = tinker;
    for (var i = 0; i < this.springs.length; i++) {
      if (random() < prob)
        tinker.add_spring(this.springs[i]);
    }
  }
  
  springs_tone_tinker(type, prob) {
    for (var i = 0; i < this.springs.length; i++) {
      this.springs[i].tinker = null;
      if (random() < prob) {
        this.springs[i].tinker = 
          new SpringTinkerTone(type, 1 / prob / this.springs.length, this.springs[i]);
      }
    }
  }
  
  springs_violin_tinker(sound, prob) {
    for (var i = 0; i < this.springs.length; i++) {
      this.springs[i].tinker = null;
      if (random() < prob) {
        this.springs[i].tinker = 
          new SpringTinkerViolin(sound, 1 / prob / this.springs.length, this.springs[i]);
      }
    }
  }
  
  add_particles_tinker(tinker, prob) {
    this.particles_tinker = tinker;
    for (var i = 0; i < this.particles.length; i++) {
      if (random() < prob)
        tinker.add_particle(this.particles[i]);
    }
  }
}
