// __tests__/FAQ.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import FAQ from "../../views/Pages/FAQ"; 

describe("FAQ Component", () => {
  test('affiche le titre "Foire à Question"', () => {
    render(<FAQ />);
    expect(
      screen.getByRole("heading", { name: /Foire à Question/i })
    ).toBeInTheDocument();
  });

  test("affiche les questions de la FAQ", () => {
    render(<FAQ />);
    // Vérifie qu'au moins une des questions est présente
    expect(
      screen.getByText(/Comment puis-je visualiser les données sur la carte\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Comment exporter des données en CSV\?/i)
    ).toBeInTheDocument();
  });
});
