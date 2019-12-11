// Make collisions with existing classes
// on page very unlikely.
const cssPrefix = `__xfy-`;
const pfx = className => cssPrefix + className;

const numSnowFlakes = 200;
const snowflakes = [];

// How often to update snow animation.
const framesPerSecond = 60;
let lastUpdate = new Date().getTime();

// This is actually a very simple particle implementation.
class Snowflake {
  acceleration = 0.1;
  context;
  posX;
  posY;
  size;
  velocityY;

  constructor(drawingContext) {
    this.posX = Math.random() * window.innerWidth;
    this.posY = Math.random() * window.innerHeight;
    this.context = drawingContext;
    this.size = 2 + Math.random() * 3;
    this.velocityY = this.size + 1;
  }

  update() {
    this.posY += this.velocityY;
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

const snowLoop = drawingContext => {
  window.requestAnimationFrame(() => snowLoop(drawingContext));

  const now = new Date().getTime();

  if (now - lastUpdate < 1000 / framesPerSecond) {
    return;
  }

  console.log("loopo");
  drawingContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < snowflakes.length; i++) {
    const flake = snowflakes[i];
    flake.update();

    if (flake.posY + Math.floor(flake.size / 2) > window.innerHeight) {
      snowflakes[i].posY = 0 - Math.ceil(flake.size / 2);
    }

    snowflakes[i].render();
  }

  lastUpdate = new Date().getTime();
};

const makeItSnow = parentElement => {
  const overlay = document.createElement("canvas");
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
  const drawingContext = overlay.getContext("2d");

  // For JS.
  overlay.setAttribute("id", pfx("overlay"));

  // For CSS.
  overlay.setAttribute("class", pfx("overlay"));
  parentElement.appendChild(overlay);

  // Make some flakes!
  for (let i = 0; i < numSnowFlakes; i++) {
    snowflakes.push(new Snowflake(drawingContext));
  }

  snowLoop(drawingContext);
};

makeItSnow(document.body);
