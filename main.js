/**
 * Token Distance Display Module Main
 * Shows token distance at bottom center with scale-aware font size.
 */

Hooks.once("init", () => {
  console.log("TokenDistance | Initializing module");

  // Settings could go here if needed
});

Hooks.once("ready", () => {
  console.log("TokenDistance | Ready");

  // Cache for PIXI.Text objects by token id
  const distanceTexts = new Map();

  // Helper: get scaled font size like Health Estimate
  function getScaledFontSize(token) {
    // Default font size setting; you can make this configurable
    const baseFontSize = 18;

    // Grid scale: token size * grid dimension scale
    const gridScale = canvas.scene.dimensions.size / 100; // same as HealthEstimate.gridScale

    // Zoom level clamped to max 1, optionally disable scaling if you want
    const zoomLevel = Math.min(1, canvas.stage.scale.x);

    return ((baseFontSize * gridScale) / zoomLevel) * 1.5; // multiplied by 1.5 for visibility
  }

  // Create or update distance text for a token
  function updateDistanceText(token) {
    if (!token || token.isVisible === false) return;

    let text = distanceTexts.get(token.id);

    // Distance from controlled tokens (or zero if none)
    let dist = 0;
    const controlled = canvas.tokens.controlled;
    if (controlled.length > 0) {
      const first = controlled[0];
      if (first.id !== token.id) {
        dist = canvas.grid.measureDistance(first.center, token.center);
      }
    }

    if (!text) {
      // Create new PIXI.Text
      text = new PIXI.Text("", {
        fontFamily: "Arial",
        fontWeight: "bold",
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 3,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowDistance: 2,
        align: "center",
      });
      text.anchor.set(0.5, 0); // center horizontally, top vertically
      canvas.tokens.addChild(text);
      distanceTexts.set(token.id, text);
    }

    // Update text content and style
    text.text = dist > 0 ? dist.toFixed(1) : "";

    // Scale font size with zoom and grid
    text.style.fontSize = getScaledFontSize(token);

    // Position text at bottom center of token
    const tokenBounds = token.getBounds();
    text.position.set(tokenBounds.x + tokenBounds.width / 2, tokenBounds.y + tokenBounds.height + 2);

    // Show/hide based on distance > 0
    text.visible = dist > 0;
  }

  // Remove distance text when token is deleted
  Hooks.on("deleteToken", (scene, tokenId) => {
    const text = distanceTexts.get(tokenId);
    if (text) {
      text.destroy();
      distanceTexts.delete(tokenId);
    }
  });

  // Update distance texts on these hooks
  function updateAllDistances() {
    for (const token of canvas.tokens.placeables) {
      updateDistanceText(token);
    }
  }

  Hooks.on("canvasReady", () => {
    updateAllDistances();
  });

  Hooks.on("updateToken", (scene, tokenData) => {
    updateAllDistances();
  });

  Hooks.on("controlToken", () => {
    updateAllDistances();
  });

  Hooks.on("hoverToken", () => {
    updateAllDistances();
  });

  Hooks.on("canvasPan", () => {
    updateAllDistances();
  });
});
