let distanceLabel;
let currentHovered = null;

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

  distanceLabel = new PIXI.Text("", labelTextStyle);
  distanceLabel.visible = false;
  canvas.interface.addChild(distanceLabel);

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

  Hooks.on("canvasReady", () => {
    console.log("Token Distance | Scene ready, resetting label.");
    if (distanceLabel) distanceLabel.visible = false;
    currentHovered = null;
  });
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

    // Wait TWO frames to ensure PIXI layout is complete before accessing width
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          distanceLabel.x = currentHovered.center.x - distanceLabel.width / 2;
          distanceLabel.y = currentHovered.center.y - currentHovered.h / 2 - 40;
          distanceLabel.visible = true;
        } catch (err) {
          console.error("Token Distance | Delayed label update failed (after 2 frames):", err);
          distanceLabel.visible = false;
        }
      });
    });
  } catch (err) {
    console.error("Token Distance | Error updating label:", err);
    distanceLabel.visible = false;
  }
}
