// main.js

Hooks.once("ready", () => {
  console.log("Token Distance | Module ready");

  const distanceTexts = new Map();
  const hoveredTokens = new Set();

  function getScaledFontSize() {
    const baseFontSize = 18;
    const gridScale = canvas.scene?.dimensions?.size / 100 || 1;
    const zoomLevel = Math.min(1, canvas.stage?.scale.x || 1);
    return ((baseFontSize * gridScale) / zoomLevel) * 1.5;
  }

  function updateDistanceText(token) {
    if (!token?.isVisible) return;

    const controlled = canvas.tokens.controlled;
    if (controlled.length !== 1 || controlled[0].id === token.id) {
      const existing = distanceTexts.get(token.id);
      if (existing) existing.visible = false;
      return;
    }

    if (!hoveredTokens.has(token.id)) {
      const existing = distanceTexts.get(token.id);
      if (existing) existing.visible = false;
      return;
    }

    const dist = canvas.grid.measureDistance(controlled[0].center, token.center);
    let text = distanceTexts.get(token.id);

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
        align: "center"
      });
      text.anchor.set(0, 0.5); // Left-center anchor for right-side display
      canvas.interface.addChild(text);
      distanceTexts.set(token.id, text);
    }

    text.text = dist.toFixed(1);
    text.style.fontSize = getScaledFontSize();

    const bounds = token.getBounds();
    text.position.set(bounds.x + bounds.width + 6, bounds.y + bounds.height / 2);
    text.visible = true;
  }

  function updateAllDistances() {
    for (const token of canvas.tokens.placeables) {
      updateDistanceText(token);
    }
  }

  Hooks.on("hoverToken", (token, hovered) => {
    if (hovered) hoveredTokens.add(token.id);
    else hoveredTokens.delete(token.id);
    updateAllDistances();
  });

  Hooks.on("canvasReady", updateAllDistances);
  Hooks.on("updateToken", updateAllDistances);
  Hooks.on("controlToken", updateAllDistances);
  Hooks.on("canvasPan", updateAllDistances);
});
