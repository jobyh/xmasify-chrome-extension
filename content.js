// This content script can access the current tab's DOM.

// Make collisions with existing classes on page very unlikely.
const cssPrefix = `__xfy-`;
const pfx = className => cssPrefix + className;

const localStorageKey = "xmasify";
let isEnabled = false;

// TODO base on screen width AND background color (darker = fewer flakes)
const numSnowFlakes = 300;
let snowflakes = [];

// How often to update snow animation.
const framesPerSecond = 60;
const frameMillis = 1000 / framesPerSecond;

// Last time the snow animation was updated in milliseconds.
let lastUpdate = new Date().getTime();

// Hackery. Poll the page in case client side rendering makes detecting DOM load tricky.
const deckTheHallsRetries = 20;
let deckTheHallsCount = 0;

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

  // Is the flake still on screen?
  isVisible() {
    return this.posY - Math.ceil(this.size / 2) < window.innerHeight;
  }

  // Move flake back to the top of screen to fall again.
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
  const overlay = document.getElementById(pfx("overlay"));

  if (overlay === null) {
    return;
  }

  overlay.parentElement.removeChild(overlay);
};

const deckTheHalls = () => {
  // If we already decked the halls don't add any
  // more boughs of holly...
  if (document.querySelector(`.${pfx("holly")}`) !== null) {
    return;
  }

  const headings = document.querySelectorAll("h1, h2, h3");

  // This polling behaviour is a workaround for
  // difficulties detecting when DOM has loaded
  // when client-side rendering e.g. React is used.
  if (
    (headings === null || headings.length < 1) &&
    deckTheHallsCount < deckTheHallsRetries
  ) {
    window.setTimeout(deckTheHalls, 500);
    deckTheHallsCount += 1;
    return;
  }

  if (deckTheHallsCount >= deckTheHallsRetries) {
    return;
  }

  const hollyUrl = chrome.runtime.getURL("images/holly.png");

  for (let i = 0; i < headings.length; i++) {
    const holly = document.createElement("div");
    holly.setAttribute("class", pfx("holly"));
    holly.setAttribute("style", `background-image: url('${hollyUrl}');`);

    headings[i].appendChild(holly);
  }
};

const undeckTheHalls = () => {
  const holly = document.querySelectorAll(`.${pfx("holly")}`);

  if (holly === null) return;

  for (let i = 0; i < holly.length; i++) {
    holly[i].parentElement.removeChild(holly[i]);
  }
};

const init = () => {
  // Check whether xmasify state already exists.
  isEnabled =
    localStorage.getItem(localStorageKey) === null
      ? false
      : JSON.parse(localStorage.getItem(localStorageKey)).isEnabled;

  chrome.runtime.sendMessage({
    message: "xmasify:isEnabled",
    data: isEnabled
  });

  if (isEnabled === true) {
    makeItSnow();
    deckTheHalls();
    window.addEventListener("resize", makeItSnow);
    return;
  }

  meltTheSnow();
  undeckTheHalls();
  window.removeEventListener("resize", makeItSnow);
};

// TODO don't add this multiple times. Chrome runtime
// doesn't actually have a .removeListener !
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "xmasify:toggle") return;

  // Toggle enabled state and store it.
  isEnabled = !isEnabled;
  localStorage.setItem(
    localStorageKey,
    JSON.stringify({ isEnabled: isEnabled })
  );

  init();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "xmasify:init") return;
  init();
});

init();
