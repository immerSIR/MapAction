import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import React from 'react'
import CardBody from "components/Card/CardBody";

describe("CardBody Component", () => {
  const Wrapper = ({ children }) => <ChakraProvider>{children}</ChakraProvider>;

  it("renders without crashing", () => {
    render(<CardBody variant="solid">Card Body Content</CardBody>, {
      wrapper: Wrapper,
    });
    expect(screen.getByText("Card Body Content")).toBeInTheDocument();
  });

//   it("applies the correct styles based on the variant prop", () => {
//     const { container } = render(
//       <CardBody variant="solid">Card Body Content</CardBody>,
//       { wrapper: Wrapper }
//     );

//     // Check if specific styles are applied based on the variant.
//     const cardBody = container.firstChild;
//     expect(cardBody).toHaveStyle("background-color: rgb(226, 232, 240)"); // Chakra UI solid variant background color (as an example)
//   });

  it("renders children correctly", () => {
    render(<CardBody variant="outline">Test Child</CardBody>, {
      wrapper: Wrapper,
    });
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("passes additional props to the Box component", () => {
    const { container } = render(
      <CardBody variant="outline" data-testid="cardbody-container">
        Card Body Content
      </CardBody>,
      { wrapper: Wrapper }
    );
    expect(
      container.querySelector('[data-testid="cardbody-container"]')
    ).toBeInTheDocument();
  });

  it("applies the default styles when no variant is provided", () => {
    const { container } = render(<CardBody>Default Card Body</CardBody>, {
      wrapper: Wrapper,
    });
    const cardBody = container.firstChild;

    // Check if the default styles are applied when no variant is provided
    const computedStyle = window.getComputedStyle(cardBody);
    expect(computedStyle.backgroundColor).toBe(""); // transparent or default color
  });
});
