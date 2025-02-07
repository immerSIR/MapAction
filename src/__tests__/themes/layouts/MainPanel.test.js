import { render } from "@testing-library/react";
import { MainPanelComponent } from "../../../theme/additions/layout/MainPanel"; // Ajuste le chemin selon ton projet

// Test de la configuration par défaut
test("MainPanel should have default styles", () => {
  const mainPanel = MainPanelComponent.components.MainPanel;

  expect(mainPanel.baseStyle.float).toBe("right");
  expect(mainPanel.baseStyle.maxWidth).toBe("100%");
  expect(mainPanel.baseStyle.overflow).toBe("auto");
  expect(mainPanel.baseStyle.position).toBe("relative");
  expect(mainPanel.defaultProps.variant).toBe("main");
});

// Test de la variante "main"
test("MainPanel main variant should have float right", () => {
  const variant = MainPanelComponent.components.MainPanel.variants.main({});
  expect(variant.float).toBe("right");
});

// Test de la variante "rtl"
test("MainPanel rtl variant should have float left", () => {
  const variant = MainPanelComponent.components.MainPanel.variants.rtl({});
  expect(variant.float).toBe("left");
});
