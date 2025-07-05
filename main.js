let distanceLabel = null;
let currentHovered = null;

Hooks.once("canvasReady", () => {
  console.log("Token Distance | canvasReady");

  // Only create if canvas.interface exists
  if (!canvas?.interface) {
    console.warn("Token Distance | canvas.interface not ready.");
    return;
  }

  // Safely create the distance label
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
  canvas.interface.addChild(distanceLabel);

  Hooks.on("hoverToken", (token, hovered) => {
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      if (distanceLabel) distanceLabel.visible = false;
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      if (distanceLabel) distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  Hooks.on("canvasPan", updateDistanceLabel);
});

function updateDistanceLabel() {
  if (!distanceLabel || !currentHovered || canvas.tokens.controlled.length === 0) {
    if (distanceLabel) distanceLabel.visible = false;
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

  // Wrap these in a try block to avoid crashing on render issues
  try {
    distanceLabel.x = currentHovered.center.x - (distanceLabel.width ?? 0) / 2;
    distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
    distanceLabel.visible = true;
  } catch (err) {
    console.error("Token Distance | Error positioning label:", err);
    distanceLabel.visible = false;
  }
}
