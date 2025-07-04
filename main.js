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
      distanceLabel.visible = false;
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  // If a token is deselected, hide the label
  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Update label position on each frame
  Hooks.on("canvasPan", updateDistanceLabel);
  canvas.app.ticker.add(updateDistanceLabel);

  function updateDistanceLabel() {
    if (!currentHovered || canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      return;
    }

    const selected = canvas.tokens.controlled[0];
    const gridSize = canvas.scene.grid.size;
    const gridUnit = canvas.scene.grid.distance;

    // Calculate token grid positions by dividing pixel position by grid size and flooring
    const selectedGridX = Math.floor(selected.x / gridSize);
    const selectedGridY = Math.floor(selected.y / gridSize);
    const hoveredGridX = Math.floor(currentHovered.x / gridSize);
    const hoveredGridY = Math.floor(currentHovered.y / gridSize);

    // Calculate distance in grid spaces using equidistant diagonal rule
    const dx = Math.abs(hoveredGridX - selectedGridX);
    const dy = Math.abs(hoveredGridY - selectedGridY);
    const spaces = Math.max(dx, dy);

    const snappedDist = spaces * gridUnit;

    distanceLabel.text = `${snappedDist} ft`;
    distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
    distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
    distanceLabel.visible = true;
  }
});
