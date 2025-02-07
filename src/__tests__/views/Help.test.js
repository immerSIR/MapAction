// __tests__/Help.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Help from "../../views/Pages/Help"; 

describe("Help Component", () => {
  test('affiche le titre "Aide en ligne"', () => {
    render(<Help />);
    expect(
      screen.getByRole("heading", { name: /Aide en ligne/i })
    ).toBeInTheDocument();
  });

  test("affiche les sujets d'aide", () => {
    render(<Help />);
    expect(
      screen.getByText(/Guide d'utilisation du tableau de bord/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/problèmes/i)).toBeInTheDocument();
  });
});
