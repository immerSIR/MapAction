import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react"; // Chakra provider for styling
import "@testing-library/jest-dom"; // For additional assertions like toBeInTheDocument
import Configurator from "components/Configurator/Configurator";

jest.mock("react-github-btn", () => 'div'); // Mocking GitHub button as a simple div

// Helper Wrapper to include ChakraProvider
const Wrapper = ({ children }) => <ChakraProvider>{children}</ChakraProvider>;

describe("Configurator Component", () => {
  const defaultProps = {
    sidebarVariant: "default",
    setSidebarVariant: jest.fn(),
    secondary: false,
    isOpen: true,
    onClose: jest.fn(),
    fixed: false,
    onSwitch: jest.fn(),
    isChecked: false,
  };

  it("renders without crashing", () => {
    render(<Configurator {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getByText(/Argon Chakra Configurator/)).toBeInTheDocument();
  });

  it("can toggle dark/light mode", () => {
    render(<Configurator {...defaultProps} />, { wrapper: Wrapper });

    const button = screen.getByRole("button", { name: /Toggle Dark/ });
    fireEvent.click(button); // Simulate clicking the button

    // Here you would check the behavior when the color mode is toggled
    // This can be tricky as you'd need to mock or inspect the Chakra UI behavior
    // For this example, let's assume the button click changes the mode
    expect(button).toHaveTextContent("Toggle Light"); // After toggling, the button should say 'Toggle Light'
  });

  it("links open the correct URLs", () => {
    render(<Configurator {...defaultProps} />, { wrapper: Wrapper });

    // Check if the Free Download button has the correct URL
    const freeDownloadButton = screen.getByRole("link", {
      name: /Free Download/,
    });
    expect(freeDownloadButton).toHaveAttribute(
      "href",
      "https://www.creative-tim.com/product/argon-dashboard-chakra?ref=creativetim-pud"
    );

    // Check if the Documentation button has the correct URL
    const documentationButton = screen.getByRole("link", {
      name: /Documentation/,
    });
    expect(documentationButton).toHaveAttribute(
      "href",
      "https://demos.creative-tim.com/docs-argon-dashboard-chakra/?ref=creativetim-pud"
    );
  });

  it("renders social share buttons correctly", () => {
    render(<Configurator {...defaultProps} />, { wrapper: Wrapper });

    // Check if the Twitter and Facebook buttons are rendered correctly with the right links
    const twitterButton = screen.getByRole("link", { name: /Tweet/ });
    expect(twitterButton).toHaveAttribute(
      "href",
      "https://twitter.com/intent/tweet?url=https://www.creative-tim.com/product/argon-dashboard-chakra/&text=Check%20Argon%20Dashboard%20Chakra%20made%20by%20@simmmple_web%20and%20@CreativeTim"
    );

    const facebookButton = screen.getByRole("link", { name: /Share/ });
    expect(facebookButton).toHaveAttribute(
      "href",
      "https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/argon-dashboard-chakra/"
    );
  });
});
