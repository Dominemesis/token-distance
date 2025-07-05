let distanceLabel = null;
let currentHovered = null;

Hooks.once("canvasReady", () => {
  console.log("Token Distance | canvasReady");

  // Create PIXI Text label
  distanceLabel = new PIXI.Text("...", {
    fontFamily: "Signika",
    fontSize: 24,
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4
  });

  // Force offscreen render to initialize style
  distanceLabel.visible = true;
  distanceLabel.x = -9999;
  distanceLabel.y = -9999;

  if (canvas?.interface) {
    canvas.interface.addChild(distanceLabel);
  } else {
    console.warn("Token Distance | canvas.interface not available.");
    return;
  }

  // Force a rendering pass to initialize styleID
  try {
    canvas.app.stage.updateTransform();
  } catch (e) {
    console.warn("Token Distance | Could not flush transform during init.");
  }

  // Reset after dummy render
  distanceLabel.visible = false;
  distanceLabel.text = "";

  // === Event Hooks ===

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

  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  Hooks.on("canvasPan", updateDistanceLabel);
});

function updateDistanceLabel() {
  console.log("Token Distance | Running updateDistanceLabel...");

  if (!distanceLabel || !currentHovered || canvas.tokens.controlled.length === 0) {
    console.log("Token Distance | Skipping update: missing elements or no token selected");
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

  try {
    // Guard: ensure label style is initialized
    if (!distanceLabel.style || !distanceLabel.style.styleID) {
      console.warn("Token Distance | Label style not ready, skipping position.");
      return;
    }

    distanceLabel.x = currentHovered.center.x - (distanceLabel.width ?? 0) / 2;
    distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
    distanceLabel.visible = true;
  } catch (err) {
    console.error("Token Distance | Error positioning label:", err);
    distanceLabel.visible = false;
  }
}
