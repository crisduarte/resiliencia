class SpringNoiseTinker {
  constructor(type, audio_ctrl) {
    this.audio_ctrl = audio_ctrl;
    this.type = type;
    this.noises = [];
    this.springs = [];
  }

  add_spring(spring) {
    var noise = new p5.Noise(this.type);
    noise.amp(0);
    noise.start();
    this.noises.push(noise);
    this.springs.push(spring);
  }

  update() {
    for (var i = 0; i < this.noises.length; i++) {
      if (this.audio_ctrl && this.audio_ctrl.muted) {
        this.noises[i].amp(0);
      } else {
        var s = this.springs[i];
        this.noises[i].amp(
          map(
            abs(s.tension),
            0.5 * s.rest_len,
            s.mesh.max_length,
            0,
            1 / (this.noises.length + 1),
            true
          )
        );
      }
    }
  }
}

class SpringToneTinker {
  constructor(type) {
    this.type = type;
    this.oscs = [];
    this.env = new p5.Envelope();
    this.springs = [];
  }

  add_spring(spring) {
    var osc = new p5.Oscillator(this.type);
    osc.amp(0);
    osc.start();
    this.oscs.push(osc);
    this.springs.push(spring);
  }

  update() {
    for (var i = 0; i < this.oscs.length; i++) {
      if (this.audio_ctrl && this.audio_ctrl.muted) {
        this.oscs[i].amp(0);
      } else {
        var s = this.springs[i];
        this.oscs[i].freq(
          map(
            abs(s.tension),
            0.1 * s.rest_len,
            s.mesh.max_length,
            180,
            4000,
            true
          )
        );
        this.env.set(0.02, 1 / this.oscs.length, 0.02, 0);
        this.env.play(this.oscs[i]);
      }
    }
  }
}

class SpringSoundTinker {
  constructor(sound) {
    this.sound = sound;
    this.sound.amp(0);
    this.sound.rate(0.5);
    this.sound.loop();
    this.amp = 0.0;
    this.springs = [];
  }

  add_spring(spring) {
    this.springs.push(spring);
  }

  update() {
    var amp = 0.0;
    for (var i = 0; i < this.springs.length; i++) {
      var s = this.springs[i];
      amp += map(abs(s.tension), 0.01 * s.rest_len, 3 * s.rest_len, 0, 1, true) / (this.springs.length + 1);
    }
    if (this.amp == 0)
      this.amp = amp;
    this.amp = (14 * this.amp + amp) / 15;
    if (this.audio_ctrl && this.audio_ctrl.muted) {
        this.sound.amp(0);
    } else {
      if (amp > 0.4 || amp >= this.amp || mouseIsPressed) {
        this.sound.amp(0, 0.2);
      } else {
        this.sound.amp(map(this.amp, 0.01, 0.6, 0, 1, true), 2);
      }
    }
  }
}

class ParticleNoiseTinker {
  constructor(type, audio_ctrl) {
    this.type = type;
    this.audio_ctrl = audio_ctrl;
    this.dev = [];
    this.particles = [];
  }

  add_particle(particle) {
    var dev = new p5.Noise(this.type);
    dev.amp(0);
    dev.start();
    this.dev.push(dev);
    this.particles.push(particle);
  }

  update() {
    for (var i = 0; i < this.dev.length; i++) {
      if (this.audio_ctrl && this.audio_ctrl.muted) {
        this.dev[i].amp(0);
      } else {
        var p = this.particles[i];
        this.dev[i].amp(
          map(abs(p.velocity), 500, 10000, 0, 1 / (this.dev.length + 1), true)
        );
      }
    }
  }
}

class ParticleToneTinker {
  constructor(type, audio_ctrl) {
    this.type = type;
    this.audio_ctrl = audio_ctrl;
    this.oscs = [];
    this.particles = [];
  }

  add_particle(particle) {
    var osc = new p5.Oscillator(random([120, 200, 330]), this.type);
    osc.amp(0.5);
    osc.start();
    this.oscs.push(osc);
    this.particles.push(particle);
  }

  update() {
    for (var i = 0; i < this.oscs.length; i++) {
      if (this.audio_ctrl && this.audio_ctrl.muted) {
        this.oscs[i].amp(0);
      } else {
        var p = this.particles[i];
        this.oscs[i].freq(map(abs(p.velocity), 5, 10000, 220, 440, true), 0.2);
        this.oscs[i].amp(map(abs(p.velocity), 1000, 10000, 0, 0.8, true), 0.2);
      }
    }
  }
}
