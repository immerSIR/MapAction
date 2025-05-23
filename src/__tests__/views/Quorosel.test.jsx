import React from 'react';
import { render, screen, act } from '@testing-library/react';
import QuotesCarousel from '../../views/Dashboard/QuotesCarousel';

// Utilisé pour contrôler les timers (setInterval/setTimeout)
jest.useFakeTimers();

describe('QuotesCarousel', () => {
  test('affiche la première citation au départ', () => {
    render(<QuotesCarousel />);
    expect(screen.getByText(/La Terre ne nous appartient pas/i)).toBeInTheDocument();
  });

  test('change de citation après 5 secondes', () => {
    render(<QuotesCarousel />);
    // Citation initiale
    expect(screen.getByText(/La Terre ne nous appartient pas/i)).toBeInTheDocument();

    // Avancer le temps de 5 secondes + 500ms (fade out)
    act(() => {
      jest.advanceTimersByTime(5500);
    });

    // La citation devrait avoir changé
    const newQuote = screen.getByText((content, node) =>
      node.textContent !== undefined &&
      node.textContent !== `"La Terre ne nous appartient pas, nous l'empruntons à nos enfants. – Antoine de Saint-Exupéry"`
    );

    expect(newQuote).toBeInTheDocument();
  });

  test('revient à la première citation après la dernière', () => {
    render(<QuotesCarousel />);
    // Avancer jusqu’à la dernière citation
    act(() => {
      jest.advanceTimersByTime((quotes.length - 1) * 5000 + 500 * (quotes.length - 1));
    });

    // Dernière citation affichée
    const lastQuote = quotes[quotes.length - 1];
    expect(screen.getByText((text) => text.includes(lastQuote))).toBeInTheDocument();

    // Avancer pour revenir à la première
    act(() => {
      jest.advanceTimersByTime(5500);
    });

    expect(screen.getByText((text) => text.includes(quotes[0]))).toBeInTheDocument();
  });
});

// Reprend les citations depuis le composant
const quotes = [
  "La Terre ne nous appartient pas, nous l'empruntons à nos enfants. – Antoine de Saint-Exupéry",
  "Il n'y a pas de passagers sur le vaisseau Terre. Nous sommes tous membres de l'équipage. – Marshall McLuhan",
  "L'environnement n'est pas une question de politique, mais de survie. – Inconnu",
  "Chaque fois que nous sauvons une goutte d'eau, nous sauvons un peu de notre avenir. – Inconnu",
  "La nature ne fait rien en vain. – Aristote",
  "La préservation de la nature est la plus noble des entreprises humaines. – Inconnu",
  "La planète ne dispose pas de substitut. – Inconnu",
  "La Terre a assez de ressources pour satisfaire les besoins de chacun, mais pas l'avidité de tous. – Mahatma Gandhi",
  "La meilleure façon de prédire l'avenir est de le protéger. – Inconnu",
  "Nous n'héritons pas de la Terre de nos ancêtres, nous l'empruntons à nos enfants. – Antoine de Saint-Exupéry",
];

