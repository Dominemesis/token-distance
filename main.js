let distanceLabel;

Hooks.on("ready", () => {
  // Create a PIXI Text label once
  distanceLabel = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 16,
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4
  });
  distanceLabel.visible = false;
  canvas.interface.addChild(distanceLabel);

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
    const dist = canvas.grid.measureDistance(selected.center, currentHovered.center);

    // Round to nearest grid unit (e.g. 5 ft)
    const gridUnit = canvas.scene.grid.distance;
    const snappedDist = Math.round(dist / gridUnit) * gridUnit;

    distanceLabel.text = `${snappedDist} ft`;
    distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
    distanceLabel.y = c
