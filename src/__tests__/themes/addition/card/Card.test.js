import { render, renderHook } from "@testing-library/react";
import { CardComponent } from "../../../../theme/additions/card/Card";
import React from "react";
import { ChakraProvider, Box, extendTheme, useStyleConfig } from "@chakra-ui/react";

// 1. Création d'un composant Card utilisant useStyleConfig
const Card = (props) => {
  // On récupère les styles définis pour "Card" dans le thème
  const styles = useStyleConfig("Card", props);
  return <Box data-testid="card" __css={styles} {...props} />;
};

// 2. Création d'un thème personnalisé qui inclut la configuration de Card
const createThemeWithCard = (config = {}) =>
  extendTheme({
    config,
    components: {
      // Ici, on doit donner un nom de composant identique à celui utilisé dans useStyleConfig (ici "Card")
      Card: CardComponent.components.Card,
    },
  });

describe("Card component", () => {
  test("applique les styles de base", () => {
    const theme = createThemeWithCard(); // Utilisation du thème par défaut
    const { getByTestId } = render(
      <ChakraProvider theme={theme}>
        <Card />
      </ChakraProvider>
    );
    const card = getByTestId("card");

    // Vérification de quelques styles de base
    expect(card).toHaveStyle("padding: 22px");
    expect(card).toHaveStyle("display: flex");
    expect(card).toHaveStyle("flex-direction: column");
    expect(card).toHaveStyle("width: 100%");
    expect(card).toHaveStyle("box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.05)");
    expect(card).toHaveStyle("border-radius: 20px");
    expect(card).toHaveStyle("position: relative");
    expect(card).toHaveStyle("word-wrap: break-word");
  });

});
