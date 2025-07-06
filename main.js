// main.js

Hooks.once("ready", () => {
  console.log("Main | Module ready");

  // Map to store PIXI.Text objects for tokens
  const distanceTexts = new Map();

  // Calculate font size scaled to grid and zoom
  function getScaledFontSize() {
    const baseFontSize = 18;
    const gridScale = canvas.scene?.dimensions?.size / 100 || 1;
    const zoomLevel = Math.min(1, canvas.stage?.scale.x || 1);
    return ((baseFontSize * gridScale) / zoomLevel) * 1.5;
  }

  // Update or create distance text for a token
  function updateDistanceText(token) {
    if (!token?.isVisible) return;

    let text = distanceTexts.get(token.id);

    const controlled = canvas.tokens.controlled;
    if (controlled.length === 0 || controlled[0].id === token.id) {
      // Hide distance text if no controlled token or token is controlled itself
      if (text) text.visible = false;
      return;
    }

    // Show distance only when the token is hovered
    if (!token.hover) {
      if (text) text.visible = false;
      return;
    }

    // Calculate distance from first controlled token to hovered token
    const dist = canvas.grid.measureDistance(controlled[0].center, token.center);

    if (!text) {
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
      text.anchor.set(0, 0.5); // Left center anchor for right side display
      canvas.tokens.addChild(text);
      distanceTexts.set(token.id, text);
    }

    text.text = dist.toFixed(1);
    text.style.fontSize = getScaledFontSize();

    const bounds = token.getBounds();
    // Position to the right of the token, vertically centered
    text.position.set(bounds.x + bounds.width + 6, bounds.y + bounds.height / 2);
    text.visible = true;
  }

  // Update distances for all tokens on the canvas
  function updateAllDistances() {
    for (const token of canvas.tokens.placeables) {
      updateDistanceText(token);
    }
  }

  // Hooks to keep distance text updated
  Hooks.on("canvasReady", updateAllDistances);
  Hooks.on("updateToken", updateAllDistances);
  Hooks.on("controlToken", updateAllDistances);
  Hooks.on("canvasPan", updateAllDistances);
  Hooks.on("hoverToken", updateAllDistances);
});
