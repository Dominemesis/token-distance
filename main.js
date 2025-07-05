let distanceLabel = null;
let currentHovered = null;

Hooks.once("canvasReady", () => {
  console.log("Token Distance | canvasReady");

  // Create and configure PIXI Text label
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

  // Add to canvas interface
  if (canvas?.interface) {
    canvas.interface.addChild(distanceLabel);
  } else {
    console.warn("Token Distance | canvas.interface not available.");
    return;
  }

  // Hover events
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

  // Control event
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Pan event
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
  const hoveredGridY = Math.floor(cu
