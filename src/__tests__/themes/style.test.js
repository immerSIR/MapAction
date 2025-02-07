// globalStyles.test.js
import { globalStyles } from "../../theme/styles"; // ajustez le chemin
import { mode } from "@chakra-ui/theme-tools";

describe("globalStyles", () => {
  test("applique les styles globaux en mode clair", () => {
    // Simule un objet props avec le mode clair
    const props = { colorMode: "light" };
    const styles = globalStyles.styles.global(props);

    expect(styles).toHaveProperty("body");
    expect(styles.body).toMatchObject({
      overflowX: "hidden",
      // En mode clair, le bg doit être "gray.50"
      bg: "gray.50",
      fontFamily: "Helvetica, sans-serif",
    });
    expect(styles).toHaveProperty("html");
    expect(styles.html.fontFamily).toBe("Helvetica, sans-serif");
  });

  test("applique les styles globaux en mode sombre", () => {
    // Simule un objet props avec le mode sombre
    const props = { colorMode: "dark" };
    const styles = globalStyles.styles.global(props);

    expect(styles).toHaveProperty("body");
    expect(styles.body).toMatchObject({
      overflowX: "hidden",
      // En mode sombre, le bg doit être "#1B254B"
      bg: "#1B254B",
      fontFamily: "Helvetica, sans-serif",
    });
    expect(styles).toHaveProperty("html");
    expect(styles.html.fontFamily).toBe("Helvetica, sans-serif");
  });

  test("contient les définitions de couleurs attendues", () => {
    // Vérification des couleurs globales
    expect(globalStyles.colors.gray["700"]).toBe("#1f2733");

    // Pour le jeu de couleurs "navy"
    expect(globalStyles.colors.navy["50"]).toBe("#d0dcfb");
    expect(globalStyles.colors.navy["100"]).toBe("#aac0fe");
    expect(globalStyles.colors.navy["200"]).toBe("#a3b9f8");
    expect(globalStyles.colors.navy["300"]).toBe("#728fea");
    expect(globalStyles.colors.navy["400"]).toBe("#3652ba");
    expect(globalStyles.colors.navy["500"]).toBe("#1b3bbb");
    // La propriété "600" est définie deux fois, la dernière valeur étant utilisée
    expect(globalStyles.colors.navy["600"]).toBe("#24388a");
    expect(globalStyles.colors.navy["700"]).toBe("#1b254b");
    expect(globalStyles.colors.navy["800"]).toBe("#111c44");
    expect(globalStyles.colors.navy["900"]).toBe("#0b1437");
  });
});
