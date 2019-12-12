// Make collisions with existing classes on page very unlikely.
const cssPrefix = `__xfy-`;
const pfx = className => cssPrefix + className;

let isEnabled = false;

// TODO based on screen width AND background color (darker = fewer flakes)
const numSnowFlakes = 300;
let snowflakes = [];

// How often to update snow animation.
const framesPerSecond = 60;
const frameMillis = 1000 / framesPerSecond;

// Last time the snow animation was updated in milliseconds.
let lastUpdate = new Date().getTime();

class Snowflake {
  context;
  posX;
  posY;
  size;
  velocity;

  constructor(drawingContext) {
    this.context = drawingContext;
    this.posX = Math.random() * window.innerWidth;
    this.posY = Math.random() * window.innerHeight;
    this.size = 2 + Math.random() * 3;

    // Multiplier 1.75 based on trial and error / what looks right.
    // We want smaller flakes to move slower to give illusion of depth.
    this.velocity = this.size * 1.75;
  }

  isVisible() {
    return this.posY - Math.ceil(this.size / 2) < window.innerHeight;
  }

  backToTop() {
    this.posY = 0 - Math.ceil(this.size / 2);
  }

  // Update internal state for animation.
  update() {
    this.posY += this.velocity;
  }

  render() {
    const ctx = this.context;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(
      this.posX,
      this.posY,
      this.size,
      this.size,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
  }
}

// Animation loop for our snow.
const snowLoop = drawingContext => {
  if (isEnabled === true) {
    window.requestAnimationFrame(() => snowLoop(drawingContext));
  }

  const now = new Date().getTime();
  const timeDelta = now - lastUpdate;

  // Enforce the frame rate set in our global variable.
  if (timeDelta < frameMillis) {
    return;
  }

  // Reset canvas drawing area.
  drawingContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Loop through the snowflake objects, update state and render to canvas.
  for (let i = 0; i < snowflakes.length; i++) {
    const flake = snowflakes[i];
    flake.update();

    // Snowflake is past the bottom of the visible area.
    if (flake.isVisible() === false) {
      flake.backToTop();
    }

    flake.render();
  }

  lastUpdate = new Date().getTime();
};

const makeItSnow = () => {
  const parentElement = document.body;
  let overlay = document.getElementById(pfx("overlay"));

  if (overlay === null) {
    overlay = document.createElement("canvas");
  }

  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
  const drawingContext = overlay.getContext("2d");

  // For JS.
  overlay.setAttribute("id", pfx("overlay"));

  // For CSS.
  overlay.setAttribute("class", pfx("overlay"));
  parentElement.appendChild(overlay);

  // Reset snowflakes array.
  snowflakes = [];

  // Make some flakes!
  for (let i = 0; i < numSnowFlakes; i++) {
    snowflakes.push(new Snowflake(drawingContext));
  }

  snowLoop(drawingContext);
};

const meltTheSnow = () => {
  const canvas = document.getElementById(pfx("overlay"));
  canvas.parentElement.removeChild(canvas);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "xmasify_clicked_action") return;

  // Toggle enabled state.
  isEnabled = !isEnabled;

  if (isEnabled === true) {
    makeItSnow();
    window.addEventListener("resize", makeItSnow);
  } else {
    meltTheSnow();
    window.removeEventListener("resize", makeItSnow);
  }
});
