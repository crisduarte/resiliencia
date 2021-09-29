class AudioControl {
  
  constructor(x, y, text_on, text_off, text_size) {
    this.x = x;
    this.y = y;
    this.text_on = text_on;
    this.text_off = text_off;
    this.text_size = text_size;
    this.pressed = false;
    this.muted = false;
  }
  
  toggle() {
    this.muted = !this.muted;
  }
  
  mouse_is_over() {
    var w = max(textWidth(this.text_on), 
                   textWidth(this.text_off));

    return mouseX >= this.x && mouseX <= this.x + w &&      mouseY >= this.y - textSize() && mouseY <= this.y + textSize() / 3;
  }
  
  user_interact() {
    if (this.pressed) {
      if (!mouseIsPressed) {
        this.pressed = false;
        this.on_release();
      } else {
        this.on_hold();
      }
    } else if (this.mouse_is_over()) {
      if (mouseIsPressed) {
        this.pressed = true;
        this.on_press();
      }
    }
  }
  
  on_release() {
    this.toggle();
  }
  
  on_hold() {
  }
  
  on_press() {
  }
  
  update() {
    this.user_interact();
    textSize(this.text_size);
    fill(40);
    textAlign(LEFT);
    if (this.muted) {
      text(this.text_off, this.x, this.y);
    } else {
      text(this.text_on, this.x, this.y);
    }
  }  
}
