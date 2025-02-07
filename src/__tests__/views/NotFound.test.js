// __tests__/NotFound.test.js
import React from "react";
import { render } from "@testing-library/react";
import NotFound from "../../views/Pages/NotFound"; // Ajuste le chemin

describe("NotFound Component", () => {
  test("ne rend aucun élément", () => {
    const { container } = render(<NotFound />);
    expect(container.firstChild).toBeNull();
  });
});
