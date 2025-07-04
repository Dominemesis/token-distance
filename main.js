let distanceLabel;

Hooks.on("ready", () => {
  let lastHovered = null;

  // Create a PIXI Text label once, reused across hovers
  distanceLabel = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 16,
    fill: "#ffffff",
    stroke: "#000000",
    strokeThickness: 4
  });
  distanceLabel.visible = false;
  canvas.interface.addChild(distanceLabel);

  canvas.stage.on("mouseover", event => {
    const hovered = event.target?.document;
    if (!hovered || hovered.documentName !== "Token") return;

    const selected = canvas.tokens.controlled[0];
    const hoveredToken = hovered.object;

    if (!selected || hoveredToken === selected) return;

    const dist = canvas.grid.measureDistance(selected.center, hoveredToken.center);
    distanceLabel.text = `${dist.toFixed(1)} ft`;

    // Position above the hovered token
    const center = hoveredToken.center;
    distanceLabel.x = center.x - distanceLabel.width / 2;
    distanceLabel.y = center.y - hoveredToken.h / 2 - 40;
    distanceLabel.visible = true;

    lastHovered = hoveredToken;
  });

  canvas.stage.on("mouseout", () => {
    distanceLabel.visible = false;
    lastHovered = null;
  });

  Hooks.on("controlToken", () => {
    // Hide label if no token is selected anymore
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.visible = false;
      lastHovered = null;
    }
  });
});
