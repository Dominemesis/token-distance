let distanceDiv = null;

Hooks.on("ready", () => {
  // Create a reusable HTML div for the distance label
  distanceDiv = document.createElement("div");
  distanceDiv.id = "token-distance-label";
  distanceDiv.style.position = "absolute";
  distanceDiv.style.padding = "4px 8px";
  distanceDiv.style.background = "rgba(0,0,0,0.7)";
  distanceDiv.style.color = "white";
  distanceDiv.style.borderRadius = "4px";
  distanceDiv.style.fontSize = "14px";
  distanceDiv.style.fontFamily = "Signika, sans-serif";
  distanceDiv.style.pointerEvents = "none";
  distanceDiv.style.zIndex = 100;
  distanceDiv.style.display = "none";
  document.body.appendChild(distanceDiv);

  let currentHovered = null;

  Hooks.on("hoverToken", (token, hovered) => {
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      distanceDiv.style.display = "none";
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceDiv.style.display = "none";
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  Hooks.on("canvasPan", updateDistanceLabel);

  function updateDistanceLabel() {
    if (!currentHovered || canvas.tokens.controlled.length === 0) {
      distanceDiv.style.display = "none";
      return;
    }

    const selected = canvas.tokens.controlled[0];
    const gridSize = canvas.scene.grid.size;
    const gridUnit = canvas.scene.grid.distance;

    const dx = Math.abs(Math.floor(currentHovered.x / gridSize) - Math.floor(selected.x / gridSize));
    const dy = Math.abs(Math.floor(currentHovered.y / gridSize) - Math.floor(selected.y / gridSize));
    const spaces = Math.max(dx, dy);
    const snappedDist = spaces * gridUnit;

    distanceDiv.textContent = `${snappedDist} ft`;

    const pos = canvas.app.renderer.plugins.interaction.mouse.global;
    distanceDiv.style.left = `${pos.x + 10}px`;
    distanceDiv.style.top = `${pos.y + 10}px`;
    distanceDiv.style.display = "block";
  }
});
