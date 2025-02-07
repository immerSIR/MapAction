import { breakpoints } from "../../../theme/foundations/breakpoints"; // Ajuste le chemin

test("Breakpoints should have correct values", () => {
  expect(breakpoints.sm).toBe("375px");
  expect(breakpoints.md).toBe("768px");
  expect(breakpoints.lg).toBe("1024px");
  expect(breakpoints.xl).toBe("1440px");
  expect(breakpoints["2xl"]).toBe("1680px");
});
