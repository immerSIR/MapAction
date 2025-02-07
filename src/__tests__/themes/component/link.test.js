import { render } from "@testing-library/react";
import { linkStyles } from "../../../theme/components/link"; // Ajuste le chemin selon ton projet

// Test des styles de Link
test("Link should have default styles", () => {
  const link = linkStyles.components.Link;
  
  expect(link.decoration).toBe("none");
  expect(link.baseStyle._hover.textDecoration).toBe("none");
  expect(link.baseStyle._focus.boxShadow).toBe("none");
});