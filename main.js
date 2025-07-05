let distanceLabel;

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
  canvas.tokens.addChild(distanceLabel);

  // Store current hovered token
  let currentHovered = null;

  // Watch for hover in/out events
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

  // If a token is deselected, hide the label
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      if (distanceLabel) distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Update label position on each frame
  Hooks.on("canvasPan", updateDistanceLabel);
  canvas.app.ticker.add(updateDistanceLabel);

  function updateDistanceLabel() {
    if (
      !distanceLabel ||
      !distanceLabel.style ||
      !currentHovered ||
      canvas.tokens.controlled.length === 0
    ) {
      if (distanceLabel) distanceLabel.visible = false;
      return;
    }

    const selected = canvas.tokens.controlled[0];
    const gridSize = canvas.scene.grid.size;
    const gridUnit = canvas.scene.grid.distance;

    // Get 2D center pixel distances
    const dx = currentHovered.center.x - selected.center.x;
    const dy = currentHovered.center.y - selected.center.y;

    // Get elevation from tokens (default to 0)
    const selectedElevation = selected.document.elevation ?? 0;
    const hoveredElevation = currentHovered.document.elevation ?? 0;
    const dz = hoveredElevation - selectedElevation;

    // Compute true 3D distance in pixels
    const distPixels = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Convert to grid units (e.g., feet)
    const snappedDist = (distPixels / gridSize) * gridUnit;

    distanceLabel.text = `${Math.round(snappedDist)} ft`;
    distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
    distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
    distanceLabel.visible = true;
  }
});
