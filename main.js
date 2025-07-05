let distanceLabel;
let currentHovered = null;

// Define a persistent PIXI.TextStyle object
const labelTextStyle = new PIXI.TextStyle({
  fontFamily: "Signika",
  fontSize: 24,
  fill: "#ffffff",
  stroke: "#000000",
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4
});

Hooks.on("ready", () => {
  console.log("Token Distance | Initializing...");

  // Create label with shared style
  distanceLabel = new PIXI.Text("", labelTextStyle);
  distanceLabel.visible = false;

  // Add label to canvas interface layer
  canvas.interface.addChild(distanceLabel);

  // Handle token hover
  Hooks.on("hoverToken", (token, hovered) => {
    console.log(`Token Distance | hoverToken: ${token.name}, hovered: ${hovered}`);
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      console.log("Token Distance | Hiding label: no valid hover target");
      distanceLabel.visible = false;
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  // Handle token control/deselect
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Reposition label during canvas pan
  Hooks.on("canvasPan", updateDistanceLabel);

  // Optional: update on every tick (can remove for performance)
  // canvas.app.ticker.add(updateDistanceLabel);
});

// Reset state after scene load
Hooks.on("canvasReady", () => {
  console.log("Token Distance | Scene ready, resetting label.");
  if (distanceLabel) distanceLabel.visible = false;
  currentHovered = null;
});

function updateDistanceLabel() {
  if (!currentHovered || canvas.tokens.controlled.length === 0) {
    distanceLabel.visible = false;
    return;
  }

  try {
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
  } catch (err) {
    console.error("Token Distance | Error updating label:", err);
    distanceLabel.visible = false;
  }
}
