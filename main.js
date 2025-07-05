let distanceLabel;

Hooks.on("ready", () => {
  console.log("Token Distance | Module ready");

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

  // Add label to top UI layer so it's always visible
  canvas.interface.addChild(distanceLabel);

  let currentHovered = null;

  Hooks.on("hoverToken", (token, hovered) => {
    const selected = canvas.tokens.controlled[0];
    console.log(`Token Distance | hoverToken: ${token.name}, hovered: ${hovered}`);

    if (!hovered || !selected || token === selected) {
      console.log("Token Distance | Hiding label: no valid hover target");
      if (distanceLabel) distanceLabel.visible = false;
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  Hooks.on("controlToken", () => {
    console.log("Token Distance | controlToken fired");

    if (canvas.tokens.controlled.length === 0) {
      console.log("Token Distance | No token selected, hiding label");
      if (distanceLabel) distanceLabel.visible = false;
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  // Update label position on canvas pan (to keep it positioned correctly)
  Hooks.on("canvasPan", updateDistanceLabel);

  // Remove continuous ticker update to avoid constant unnecessary updates
  // canvas.app.ticker.add(updateDistanceLabel);

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

    const dx = currentHovered.center.x - selected.center.x;
    const dy = currentHovered.center.y - selected.center.y;

    const selectedElevation = selected.document.elevation ?? 0;
    const hoveredElevation = currentHovered.document.elevation ?? 0;
    const dz = hoveredElevation - selectedElevation;

    const distPixels = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const snappedDist = (distPixels / gridSize) * gridUnit;

    // Log only when label is actually visible
    console.log(`Token Distance | Distance from ${selected.name} to ${currentHovered.name}: ${snappedDist.toFixed(2)} ft (dx: ${dx}, dy: ${dy}, dz: ${dz})`);

    distanceLabel.text = `${Math.round(snappedDist)} ft`;
    distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
    distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
    distanceLabel.visible = true;
  }
});
