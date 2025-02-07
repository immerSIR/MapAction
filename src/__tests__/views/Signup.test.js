// __tests__/SignUp.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import SignUp from "../../views/Pages/SignUp"; // Ajuste le chemin

describe("SignUp Component", () => {
  test('affiche le texte "Welcome!"', () => {
    render(<SignUp />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });

  test("affiche le bouton SIGN UP", () => {
    render(<SignUp />);
    expect(
      screen.getByRole("button", { name: /SIGN UP/i })
    ).toBeInTheDocument();
  });
});
