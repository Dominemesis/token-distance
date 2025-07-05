let distanceLabel;
let currentHovered = null;

Hooks.on("ready", () => {
  // Create a PIXI Text label once with matching token label style
  distanceLabel = new PIXI.Text("", {
    fontFamily: "Signika",
    fontSize: 24,
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4
  });
  distanceLabel.visible = false;

  // Add label to interface layer so it's always visible
  canvas.interface.addChild(distanceLabel);

  // Handle token hover
  Hooks.on("hoverToken", (token, hovered) => {
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      distanceLabel.visible = false;
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  // Handle token selection changes
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Update label on canvas pan
  Hooks.on("canvasPan", updateDistanceLabel);

  // Update label on every frame tick (optional, you can remove if too heavy)
  canvas.app.ticker.add(updateDistanceLabel);
});

// Reset state when a new scene is fully loaded
Hooks.once("canvasReady", () => {
  console.log("Token Distance | Canvas ready, resetting label and state.");
  if (distanceLabel) distanceLabel.visible = false;
  currentHovered = null;
});

function updateDistanceLabel() {
  if (!currentHovered || canvas.tokens.controlled.length === 0) {
    distanceLabel.visible = false;
    return;
  }

  // Wait for PIXI Text style to be ready before updating
  if (!distanceLabel.style || distanceLabel.style.styleID === null) {
    console.log("Token Distance | Label style not ready, retrying...");
    setTimeout(updateDistanceLabel, 100); // Retry after 100ms
    return;
  }

  const selected = canvas.tokens.controlled[0];
  const gridSize = canvas.scene.grid.size;
  const gridUnit = canvas.scene.grid.distance;

  const selectedGridX = Math.floor(selected.x / gridSize);
  const selectedGridY = Math.floor(selected.y / gridSize);
  const hoveredGridX = Math.floor(currentHovered.x / gridSize);
  const hoveredGridY = Math.floor(currentHovered.y / gridSize);

  const dx = Math.abs(hoveredGridX - selectedGridX);
  const dy = Math.abs(hoveredGridY - selectedGridY);
  const spaces = Math.max(dx, dy);

  const snappedDist = spaces * gridUnit;

  distanceLabel.text = `${snappedDist} ft`;
  distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
  distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
  distanceLabel.visible = true;
}
