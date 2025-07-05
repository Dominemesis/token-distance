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

  Hooks.on("hoverToken", (token, hovered) => {
    //console.log("Token Distance | hoverToken:", token.name, "hovered:", hovered);
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      //console.log("Token Distance | Hiding label: no valid hover target");
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

  function updateDistanceLabel() {
    if (!currentHovered || canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      return;
    }

    try {
      const selected = canvas.tokens.controlled[0];
      const gridSize = canvas.scene.grid.size;
      const gridUnit = canvas.scene.grid.distance;

      const selectedCenter = selected.center;
      const hoveredCenter = currentHovered.center;

      const dx = Math.abs(hoveredCenter.x - selectedCenter.x);
      const dy = Math.abs(hoveredCenter.y - selectedCenter.y);
      const spaces = Math.max(dx, dy) / gridSize;

      const snappedDist = Math.round(spaces * gridUnit);

      distanceLabel.text = `${snappedDist} ft`;

      // Position label consistently above and slightly right of hovered token
      distanceLabel.x = hoveredCenter.x - distanceLabel.width / 2 + gridSize / 4;
      distanceLabel.y = hoveredCenter.y - currentHovered.h - distanceLabel.height - 5;

      distanceLabel.visible = true;
    } catch (error) {
      //console.error("Token Distance | Failed to position label:", error);
      distanceLabel.visible = false;
    }
  }
});
