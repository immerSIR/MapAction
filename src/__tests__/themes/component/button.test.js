import { buttonStyles } from "../../../theme/components/button";
import { mode } from "@chakra-ui/theme-tools";

describe("Button styles", () => {
  test("should have correct base styles", () => {
    const base = buttonStyles.components.Button.baseStyle;
    expect(base.fontWeight).toBe("bold");
    expect(base.borderRadius).toBe("8px");
    expect(base.fontSize).toBe("10px");
  });

  test("primary variant has correct styles", () => {
    const primary = buttonStyles.components.Button.variants.primary;
    expect(primary.fontSize).toBe("10px");
    expect(primary.bg).toBe("blue.400");
    expect(primary.color).toBe("#fff");
    expect(primary._hover.bg).toBe("blue.300");
    expect(primary._focus.bg).toBe("blue.300");
    expect(primary._active.bg).toBe("blue.300");
  });

  test("navy variant has correct styles", () => {
    const navy = buttonStyles.components.Button.variants.navy;
    expect(navy.fontSize).toBe("10px");
    expect(navy.bg).toBe("navy.900");
    expect(navy.color).toBe("#fff");
    expect(navy._hover.bg).toBe("navy.900");
    expect(navy._focus.bg).toBe("navy.900");
    expect(navy._active.bg).toBe("navy.900");
  });

  test("danger variant returns correct styles", () => {
    const danger = buttonStyles.components.Button.variants.danger();
    expect(danger.fontSize).toBe("10px");
    expect(danger.bg).toBe("red.500");
    expect(danger.color).toBe("white");
    expect(danger._hover).toBe("red.400");
    expect(danger._focus).toBe("red.400");
    expect(danger._active).toBe("red.400");
  });

  test("no-effects variant disables hover, focus and active states", () => {
    const noEffects = buttonStyles.components.Button.variants["no-effects"];
    expect(noEffects._hover).toBe("none");
    expect(noEffects._focus).toBe("none");
    expect(noEffects._active).toBe("none");
  });

  test("outlined variant returns correct styles in light mode", () => {
    const props = { colorMode: "light" };
    const outlined = buttonStyles.components.Button.variants.outlined(props);
    
    // Pour light mode, mode() retourne la première valeur passée
    expect(outlined.color).toBe("blue.400");
    expect(outlined.bg).toBe("transparent");
    expect(outlined.fontSize).toBe("10px");
    expect(outlined.border).toBe("1px solid");
    // borderColor est défini sous la forme d'un objet { bg: ... }
    expect(outlined.borderColor.bg).toBe("blue.400");
    expect(outlined._hover.bg).toBe("blue.50");
    expect(outlined._focus.bg).toBe("blue.50");
    expect(outlined._active.bg).toBe("blue.50");
  });

  test("dark variant returns correct styles in light mode", () => {
    const props = { colorMode: "light" };
    const darkVariant = buttonStyles.components.Button.variants.dark(props);
    
    // En light mode, mode("gray.700", "blue.500") retourne "gray.700", etc.
    expect(darkVariant.color).toBe("white");
    expect(darkVariant.bg).toBe("gray.700");
    expect(darkVariant.fontSize).toBe("10px");
    expect(darkVariant._hover.bg).toBe("gray.700");
    expect(darkVariant._focus.bg).toBe("gray.700"); // mode("gray.700", "blue.600")(props) retourne "gray.700"
    expect(darkVariant._active.bg).toBe("gray.700");
  });

  test("light variant returns correct styles in light mode", () => {
    const props = { colorMode: "light" };
    const lightVariant = buttonStyles.components.Button.variants.light(props);
    
    expect(lightVariant.color).toBe("gray.700");
    expect(lightVariant.bg).toBe("gray.100");
    expect(lightVariant.fontSize).toBe("10px");
    expect(lightVariant._hover.bg).toBe("gray.50");
    expect(lightVariant._focus.bg).toBe("gray.50");
    expect(lightVariant._active.bg).toBe("gray.50");
  });
});
