// Make collisions with existing classes
// on page very unlikely.
const cssPrefix = `__xfy-`;
const pfx = className => cssPrefix + className;

const numSnowFlakes = 200;
const snowflakes = [];

// This is actually a very simple particle implementation.
class Snowflake {
  context;
  velocityY;
  acceleration = 0.1;
  posX;
  posY;
  size;

  constructor(drawingContext) {
    this.posX = Math.random() * window.innerWidth;
    this.posY = Math.random() * window.innerHeight;
    this.context = drawingContext;
    this.velocityY = Math.random() * 0.5 + 1;
    this.size = 2 + Math.random() * 3;
  }

  update() {
    this.posY += this.velocityY;
  }

  render() {
    const ctx = this.context;
    ctx.fillStyle = "lime";
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
  drawingContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < snowflakes.length; i++) {
    const flake = snowflakes[i];
    flake.update();

    if (flake.posY + Math.floor(flake.size / 2) > window.innerHeight) {
      snowflakes[i].posY = 0 - Math.ceil(flake.size / 2);
    }

    snowflakes[i].render();
  }
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
