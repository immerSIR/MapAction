import { render } from "@testing-library/react";
import { badgeStyles } from "../../../theme/components/badge"; // Ajuste le chemin selon ton projet

// Test de la configuration par défaut de Badge
test("Badge should have default styles", () => {
  const badge = badgeStyles.components.Badge;

  expect(badge.sizes.md.width).toBe("65px");
  expect(badge.sizes.md.height).toBe("25px");
  expect(badge.baseStyle.textTransform).toBe("capitalize");
});
