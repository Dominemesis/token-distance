Hooks.on("ready", () => {
  let lastHovered = null;

  canvas.stage.on("mouseover", event => {
    const hovered = event.target?.document;
    if (!hovered || hovered.documentName !== "Token") return;

    const selected = canvas.tokens.controlled[0];
    const hoveredToken = hovered.object;

    // Prevent self or repeated notifications
    if (!selected || hoveredToken === selected || hoveredToken === lastHovered) return;

    lastHovered = hoveredToken;

    const dist = canvas.grid.measureDistance(selected.center, hoveredToken.center);
    ui.notifications.info(`Distance to ${hoveredToken.name}: ${dist.toFixed(1)} ft`);
  });

  canvas.stage.on("mouseout", () => {
    lastHovered = null;
  });
});
