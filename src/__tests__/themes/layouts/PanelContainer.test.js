import { render } from "@testing-library/react";
import { PanelContainerComponent } from "../../../theme/additions/layout/PanelContainer"; // Ajuste le chemin selon ton projet

// Test de la configuration par défaut de PanelContainer
test("PanelContainer should have default styles", () => {
  const panelContainer = PanelContainerComponent.components.PanelContainer;

  expect(panelContainer.baseStyle.p).toBe("30px 15px");
  expect(panelContainer.baseStyle.minHeight).toBe("calc(100vh - 123px)");
});
