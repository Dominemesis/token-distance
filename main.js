let labelDiv;
let currentHovered = null;

Hooks.on("ready", () => {
  console.log("Token Distance | Initializing");

  // Create a DOM label element
  labelDiv = document.createElement("div");
  labelDiv.style.position = "absolute";
  labelDiv.style.pointerEvents = "none";
  labelDiv.style.padding = "2px 6px";
  labelDiv.style.borderRadius = "4px";
  labelDiv.style.background = "rgba(0, 0, 0, 0.75)";
  labelDiv.style.color = "white";
  labelDiv.style.fontFamily = "Signika, sans-serif";
  labelDiv.style.fontSize = "14px";
  labelDiv.style.border = "1px solid #999";
  labelDiv.style.zIndex = 100;
  labelDiv.style.display = "none";
  document.body.appendChild(labelDiv);

  // Handle token hover
  Hooks.on("hoverToken", (token, hovered) => {
    console.log(`Token Distance | hoverToken: ${token.name}, hovered: ${hovered}`);
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      console.log("Token Distance | Hiding label: no valid hover target");
      labelDiv.style.display = "none";
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  // Handle token selection
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      console.log("Token Distance | No token selected, hiding label");
      labelDiv.style.display = "none";
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Recalculate on canvas pan/zoom
  Hooks.on("canvasPan", updateDistanceLabel);
  Hooks.on("canvasReady", updateDistanceLabel);
});

// Update label position and text
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

  try {
    const tokenCenter = currentHovered.center;
    const screenPos = canvas.app.renderer.plugins.interaction.mapPositionToPoint(
      new PIXI.Point(), tokenCenter.x, tokenCenter.y
    );

    labelDiv.style.left = `${screenPos.x - labelDiv.offsetWidth / 2}px`;
    labelDiv.style.top = `${screenPos.y - 40}px`;
    labelDiv.style.display = "block";
  } catch (err) {
    console.warn("Token Distance | Failed to position label:", err);
    labelDiv.style.display = "none";
  }
}
