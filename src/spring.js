class Spring {
  
  constructor(p1, p2, thickness, rest_len, constant, mesh) {
    this.p1 = p1;
    this.p2 = p2;
    this.thickness = thickness;
    this.rest_len = rest_len;
    this.constant = constant;
    this.mesh = mesh;
    this.length = 0.0;
    this.tension = 0.0;
  }
  
  draw() {
    strokeWeight(this.thickness);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }

  update_force() {
    this.length = dist(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    this.tension = this.length - this.rest_len;
    var force = this.tension * this.constant;
    var fx = (this.p1.x - this.p2.x) / (this.length + 1) * force;
    var fy = (this.p1.y - this.p2.y) / (this.length + 1) * force;
    this.p1.fx -= fx;
    this.p1.fy -= fy;
    this.p2.fx += fx;
    this.p2.fy += fy;
  }
}
