import { render } from "@testing-library/react";
import { PanelContentComponent } from "../../../theme/additions/layout/PanelContent"; // Ajuste le chemin selon ton projet

// Test de la configuration par défaut de PanelContent
test("PanelContent should have default styles", () => {
  const panelContent = PanelContentComponent.components.PanelContent;

  expect(panelContent.baseStyle.ms).toBe("auto");
  expect(panelContent.baseStyle.me).toBe("auto");
  expect(panelContent.baseStyle.ps).toBe("15px");
  expect(panelContent.baseStyle.pe).toBe("15px");
});
