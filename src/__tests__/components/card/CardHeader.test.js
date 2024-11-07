import { render, screen } from "@testing-library/react";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import CardHeader from "components/Card/CardHeader";

describe("CardHeader Component", () => {
  const Wrapper = ({ children }) => <ChakraProvider>{children}</ChakraProvider>;

  it("renders without crashing", () => {
    render(<CardHeader variant="solid">Card Header Content</CardHeader>, {
      wrapper: Wrapper,
    });
    expect(screen.getByText("Card Header Content")).toBeInTheDocument();
  });


  it("renders children correctly", () => {
    render(<CardHeader variant="outline">Test Child</CardHeader>, {
      wrapper: Wrapper,
    });
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("passes additional props to the Box component", () => {
    const { container } = render(
      <CardHeader variant="outline" data-testid="cardheader-container">
        Card Header Content
      </CardHeader>,
      { wrapper: Wrapper }
    );
    expect(
      container.querySelector('[data-testid="cardheader-container"]')
    ).toBeInTheDocument();
  });

  it("applies the default styles when no variant is provided", () => {
    const { container } = render(<CardHeader>Default Card Header</CardHeader>, {
      wrapper: Wrapper,
    });
    const cardHeader = container.firstChild;

    // Check if the default background is applied when no variant is provided.
    const computedStyle = window.getComputedStyle(cardHeader);
    expect(computedStyle.backgroundColor).toBe(""); // transparent or default color
  });
});
