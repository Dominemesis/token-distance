// Define a shared TextStyle once for the entire module
const DISTANCE_STYLE = new PIXI.TextStyle({
  fontFamily: "Signika",
  fontSize: 24,
  fill: "#ffffff",
  stroke: "#000000",
  strokeThickness: 4,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4
});

let distanceLabel;
let currentHovered = null;

Hooks.on("ready", () => {
  // Create the distance label once, using the shared style
  distanceLabel = new PIXI.Text("", DISTANCE_STYLE);
  distanceLabel.visible = false;

  // Add the label to the interface layer (above tokens)
  canvas.interface.addChild(distanceLabel);

  // Listen for token hover
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

  // Listen for token selection changes
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Also update label when the canvas is panned (to keep label in sync)
  Hooks.on("canvasPan", updateDistanceLabel);
});

function updateDistanceLabel() {
  // If no hovered token or no selected token, hide label and skip
  if (!currentHovered || canvas.tokens.controlled.length === 0) {
    distanceLabel.visible = false;
    return;
  }

  // Guard: ensure style is ready before accessing width
  if (!distanceLabel.style || distanceLabel.style.styleID === null) {
    console.warn("Token Distance | Label style not ready, skipping position.");
    return;
  }

  const selected = canvas.tokens.controlled[0];
  const gridSize = canvas.scene.grid.size;
  const gridUnit = canvas.scene.grid.distance;

  // Calculate grid coordinates
  const selectedGridX = Math.floor(selected.x / gridSize);
  const selectedGridY = Math.floor(selected.y / gridSize);
  const hoveredGridX = Math.floor(currentHovered.x / gridSize);
  const hoveredGridY = Math.floor(currentHovered.y / gridSize);

  // Distance using Chebyshev distance (max of dx, dy)
  const dx = Math.abs(hoveredGridX - selectedGridX);
  const dy = Math.abs(hoveredGridY - selectedGridY);
  const spaces = Math.max(dx, dy);

  const snappedDist = spaces * gridUnit;

  distanceLabel.text = `${snappedDist} ft`;

  // Position the label centered above hovered token
  distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
  distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;

  distanceLabel.visible = true;
}
