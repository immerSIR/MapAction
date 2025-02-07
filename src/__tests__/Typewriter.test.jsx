const React = require('react');
const { render, screen, act, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const Typewriter = require('../views/Dashboard/Typewriter').default;

// Mock de marked et DOMPurify
jest.mock('marked', () => ({
  marked: (text) => text
}));

jest.mock('dompurify', () => ({
  sanitize: (content) => content
}));

describe('Typewriter Component', () => {
  // Helper pour le rendu avec provider
  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('affiche le texte caractère par caractère', async () => {
    const mockText = "Hello World";
    const mockOnTypingDone = jest.fn();
    const mockOnTextUpdate = jest.fn();

    renderWithProvider(
      <Typewriter
        text={mockText}
        speed={50}
        onTypingDone={mockOnTypingDone}
        onTextUpdate={mockOnTextUpdate}
      />
    );

    // Vérifie le premier caractère
    expect(screen.getByText('H')).toBeInTheDocument();

    // Avance le temps pour voir plus de caractères
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(screen.getByText('He')).toBeInTheDocument();

    // Complète l'animation
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
      expect(mockOnTypingDone).toHaveBeenCalled();
    });
  });

  it('affiche immédiatement le texte complet quand isStopped est true', () => {
    const mockText = "Hello World";
    const mockOnTypingDone = jest.fn();

    renderWithProvider(
      <Typewriter
        text={mockText}
        speed={50}
        onTypingDone={mockOnTypingDone}
        isStopped={true}
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(mockOnTypingDone).toHaveBeenCalled();
  });

  it('appelle onTextUpdate pendant la frappe', () => {
    const mockText = "Test";
    const mockOnTextUpdate = jest.fn();

    renderWithProvider(
      <Typewriter
        text={mockText}
        speed={50}
        onTextUpdate={mockOnTextUpdate}
      />
    );

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(mockOnTextUpdate).toHaveBeenCalled();
  });

  it('gère le changement de texte', async () => {
    const { rerender } = renderWithProvider(
      <Typewriter
        text="Premier texte"
        speed={50}
      />
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(screen.getByText('Premier texte')).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <Typewriter
          text="Nouveau texte"
          speed={50}
        />
      </ChakraProvider>
    );

    // Le nouveau texte devrait commencer à s'afficher
    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('nettoie l\'intervalle lors du démontage', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = renderWithProvider(
      <Typewriter
        text="Test cleanup"
        speed={50}
      />
    );

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('gère le markdown correctement', () => {
    renderWithProvider(
      <Typewriter
        text="**Bold text**"
        speed={50}
      />
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(screen.getByText('**Bold text**')).toBeInTheDocument();
  });

  it('hérite de la couleur du parent', () => {
    renderWithProvider(
      <div style={{ color: 'red' }}>
        <Typewriter
          text="Texte coloré"
          speed={50}
        />
      </div>
    );

    const element = screen.getByText('T');
    expect(element.parentElement).toHaveStyle({ color: 'inherit' });
  });
}); 