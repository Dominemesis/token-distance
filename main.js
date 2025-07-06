let distanceLabel;
let currentHovered = null;

Hooks.on("ready", () => {
  // Create the DOM element once
  distanceLabel = document.createElement("div");
  distanceLabel.style.position = "absolute";
  distanceLabel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  distanceLabel.style.color = "#fff";
  distanceLabel.style.fontFamily = "Signika, sans-serif";
  distanceLabel.style.fontSize = "18px";
  distanceLabel.style.padding = "2px 6px";
  distanceLabel.style.borderRadius = "4px";
  distanceLabel.style.pointerEvents = "none";
  distanceLabel.style.zIndex = 1000;
  distanceLabel.style.whiteSpace = "nowrap";
  distanceLabel.style.display = "none";

  document.body.appendChild(distanceLabel);

  Hooks.on("hoverToken", (token, hovered) => {
    //console.log("Token Distance | hoverToken:", token.name, "hovered:", hovered);
    const selected = canvas.tokens.controlled[0];
    if (!hovered || !selected || token === selected) {
      //console.log("Token Distance | Hiding label: no valid hover target");
      distanceLabel.style.display = "none";
      currentHovered = null;
      return;
    }

    currentHovered = token;
    updateDistanceLabel();
  });

  Hooks.on("controlToken", () => {
    if (canvas.tokens.controlled.length === 0) {
      distanceLabel.style.display = "none";
      currentHovered = null;
    } else {
      updateDistanceLabel();
    }
  });

  Hooks.on("canvasPan", updateDistanceLabel);

  function updateDistanceLabel() {
    if (!currentHovered || canvas.tokens.controlled.length === 0) {
      distanceLabel.style.display = "none";
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

      distanceLabel.textContent = `${snappedDist} ft`;

      // Position label above and slightly right of hovered token
      const canvasRect = canvas.app.view.getBoundingClientRect();
      distanceLabel.style.left = `${canvasRect.left + hoveredCenter.x + gridSize / 4}px`;
      distanceLabel.style.top = `${canvasRect.top + hoveredCenter.y - currentHovered.h - distanceLabel.offsetHeight - 5}px`;

      distanceLabel.style.display = "block";
    } catch (error) {
      //console.error("Token Distance | Failed to position label:", error);
      distanceLabel.style.display = "none";
    }
  }
});
