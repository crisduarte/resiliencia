//begin of parameters
var silent = false;
var cols = 15;
var rows = 15;
var loss = 2000;
var mouse_force = 600000;
var bouncing_const = -0.9;
var spring_constant = 8000;
var spring_thickness = 1;
var dt = 0.01;
//end of parameters
// global
meshes = [];
var audio_control;

function preload() {
  //soundFormats("mp3");
  //violin = loadSound("assets/violin_G.mp3");
}

function start_audio() {
  if (getAudioContext().state !== "running")
      getAudioContext().resume();
  //fullscreen(true);
}

//setup function to initialize variables
function setup() {
  //ellipseMode(RADIUS);
  pixelDensity(1);
  var w = windowWidth;
  var h = windowHeight;
  var canvas = createCanvas(w, h);
  canvas.mousePressed(start_audio);
  frameRate(24);
  
  // create new mesh
  meshes[0] = new Mesh(5, 5, w - 5, h - 25, loss, mouse_force, bouncing_const);
  
  // add particles
  var particle_size = 38220 / w;
  meshes[0].add_particles(rows, cols, particle_size);
  
  // topologies: 
  // - triangle: set_triangle_topology
  // - Moore: set_moore_topology
  // - von Neumann: set_vonneumann_topology
  var spring_rest_length = 73500 / w;
  meshes[0].set_vonneumann_topology(spring_thickness, spring_rest_length, spring_constant);
  
  // add sound to springs
  audio_control = new AudioControl(5, h - 10, "sound: on", "sound: off", 38220 / w);
  //meshes[0].add_springs_tinker(new SpringToneTinker("triangle"), 0.05);
  meshes[0].add_springs_tinker(new SpringNoiseTinker("white", audio_control), 0.01);
  //meshes[0].add_springs_tinker(new SpringSoundTinker(violin), 0.1);
  
  // add sound to particles
  meshes[0].add_particles_tinker(new ParticleNoiseTinker("brown", audio_control), 0.02);
  //meshes[0].add_particles_tinker(new ParticleToneTinker("sine"), 0.01);
}


function draw() {
  background(211, 211, 213);

  if (getAudioContext().state !== 'running') {
    textSize(40);
    textAlign(CENTER);
    fill(62, 62, 66);
    text('click or touch to\nintroduce energy in\nthe system\n(click to start)', width / 2, height / 2);
    return;
  }
  
  for (var i = 0; i < meshes.length; i++) {
    audio_control.update();
    meshes[i].draw();
    meshes[i].update_force();
    meshes[i].update_location(dt);
    meshes[i].update_tinker();
  }
}
