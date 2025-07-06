// main.js

Hooks.once("ready", () => {
  console.log("Main | Module ready");

  // --- Health Estimate integration ---

  // HealthEstimate global or your existing logic here if needed
  // For example, you might initialize or update health estimate here
  // If you want, I can also help integrate healthEstimate calls/hooks

  // --- Token Distance Display Below Token ---

  const distanceTexts = new Map();

  function getScaledFontSize() {
    const baseFontSize = 18;
    const gridScale = canvas.scene?.dimensions?.size / 100 || 1;
    const zoomLevel = Math.min(1, canvas.stage?.scale.x || 1);
    return ((baseFontSize * gridScale) / zoomLevel) * 1.5;
  }

  function updateDistanceText(token) {
    if (!token?.isVisible) return;

    let text = distanceTexts.get(token.id);

    const controlled = canvas.tokens.controlled;
    if (controlled.length === 0 || controlled[0].id === token.id) {
      if (text) {
        text.visible = false;
      }
      return;
    }

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
      text.anchor.set(0.5, 0);
      canvas.tokens.addChild(text);
      distanceTexts.set(token.id, text);
    }

    text.text = dist.toFixed(1);
    text.style.fontSize = getScaledFontSize();

    const bounds = token.getBounds();
    text.position.set(bounds.x + bounds.width / 2, bounds.y + bounds.height + 4);
    text.visible = true;
  }

  function updateAllDistances() {
    for (const token of canvas.tokens.placeables) {
      updateDistanceText(token);
    }
  }

  // Update distances when the canvas is ready or tokens move/control changes
  Hooks.on("canvasReady", updateAllDistances);
  Hooks.on("updateToken", updateAllDistances);
  Hooks.on("controlToken", updateAllDistances);
  Hooks.on("canvasPan", updateAllDistances);
  Hooks.on("hoverToken", updateAllDistances);
});
