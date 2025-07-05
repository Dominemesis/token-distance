let labelDiv;
let currentHovered = null;
let mousePosition = { x: 0, y: 0 };

Hooks.on("ready", () => {
  console.log("Token Distance | Initializing...");

  // Create a fixed-position HTML div to display the label
  labelDiv = document.createElement("div");
  labelDiv.style.position = "fixed";
  labelDiv.style.pointerEvents = "none";
  labelDiv.style.padding = "4px 8px";
  labelDiv.style.background = "rgba(0, 0, 0, 0.7)";
  labelDiv.style.color = "white";
  labelDiv.style.fontFamily = "Signika, sans-serif";
  labelDiv.style.fontSize = "16px";
  labelDiv.style.borderRadius = "4px";
  labelDiv.style.zIndex = 100;
  labelDiv.style.display = "none";
  document.body.appendChild(labelDiv);

  // Track mouse position globally
  canvas.app.view.addEventListener("mousemove", (event) => {
    mousePosition = { x: event.clientX, y: event.clientY };
  });

  // Token hover
  Hooks.on("hoverToken", (token, hovered) => {
    if (!hovered || canvas.tokens.controlled.length === 0 || canvas.tokens.controlled[0] === token) {
      labelDiv.style.display = "none";
      currentHovered = null;
      return;
    }
    currentHovered = token;
    updateDistanceLabel();
  });

  // Token control
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      labelDiv.style.display = "none";
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Scene change
  Hooks.on("canvasReady", () => {
    labelDiv.style.display = "none";
    currentHovered = null;
  });

  console.log("Token Distance | Ready");
});

function updateDistanceLabel() {
  if (!currentHovered || canvas.tokens.controlled.length === 0) {
    labelDiv.style.display = "none";
    return;
  }

  const selected = canvas.tokens.controlled[0];
  const gridSize = canvas.scene.grid.size;
  const gridUnit = canvas.scene.grid.distance;

  const dx = Math.abs(currentHovered.center.x - selected.center.x);
  const dy = Math.abs(currentHovered.center.y - selected.center.y);

  const gridDx = dx / gridSize;
  const gridDy = dy / gridSize;
  const spaces = Math.max(gridDx, gridDy);

  const snappedDist = spaces * gridUnit;

  labelDiv.textContent = `${snappedDist.toFixed(0)} ft`;
  labelDiv.style.left = `${mousePosition.x + 15}px`;
  labelDiv.style.top = `${mousePosition.y + 15}px`;
  labelDiv.style.display = "block";
}
