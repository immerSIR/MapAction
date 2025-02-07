const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider, useColorMode } = require('@chakra-ui/react');
const Configurator = require('../../../components/Configurator/Configurator').default;

// Mock des composants externes
jest.mock('react-github-btn', () => ({
  __esModule: true,
  default: () => <div data-testid="github-button">GitHub Button</div>
}));

// Mock du hook useColorMode
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorMode: jest.fn()
}));

describe('Configurator Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSwitch: jest.fn(),
    isChecked: false,
    setSidebarVariant: jest.fn(),
    sidebarVariant: 'transparent',
    secondary: false,
    fixed: false
  };

  beforeEach(() => {
    useColorMode.mockImplementation(() => ({
      colorMode: 'light',
      toggleColorMode: jest.fn()
    }));
  });

  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement le composant avec les props par défaut', () => {
    renderWithChakra(<Configurator {...mockProps} />);
    
    expect(screen.getByText('Argon Chakra Configurator')).toBeInTheDocument();
    expect(screen.getByText('See your dashboard options.')).toBeInTheDocument();
    expect(screen.getByText('Navbar Fixed')).toBeInTheDocument();
    expect(screen.getByText('Dark/Light')).toBeInTheDocument();
  });

  it('gère correctement le switch de la navbar', async () => {
    renderWithChakra(<Configurator {...mockProps} />);
    
    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);
    
    expect(mockProps.onSwitch).toHaveBeenCalledWith(true);
    
    fireEvent.click(switchElement);
    expect(mockProps.onSwitch).toHaveBeenCalledWith(false);
  });

  it('gère correctement le changement de mode couleur', () => {
    const toggleColorMode = jest.fn();
    useColorMode.mockImplementation(() => ({
      colorMode: 'light',
      toggleColorMode
    }));

    renderWithChakra(<Configurator {...mockProps} />);
    
    const colorModeButton = screen.getByText(/Toggle Dark/i);
    fireEvent.click(colorModeButton);
    
    expect(toggleColorMode).toHaveBeenCalled();
  });

  it('affiche correctement les boutons de réseaux sociaux', () => {
    renderWithChakra(<Configurator {...mockProps} />);
    
    expect(screen.getByText('Tweet')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('affiche le bouton GitHub', () => {
    renderWithChakra(<Configurator {...mockProps} />);
    
    expect(screen.getByTestId('github-button')).toBeInTheDocument();
  });

  it('gère correctement la fermeture du drawer', () => {
    renderWithChakra(<Configurator {...mockProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('change correctement le mode couleur', async () => {
    const toggleColorMode = jest.fn();
    useColorMode.mockImplementation(() => ({
      colorMode: 'light',
      toggleColorMode
    }));

    renderWithChakra(<Configurator {...mockProps} />);

    const darkModeButton = screen.getByText(/Toggle Dark/i);
    fireEvent.click(darkModeButton);

    expect(toggleColorMode).toHaveBeenCalled();

    // Simuler le changement en mode sombre
    useColorMode.mockImplementation(() => ({
      colorMode: 'dark',
      toggleColorMode
    }));

    renderWithChakra(<Configurator {...mockProps} />);
    
    const lightModeButton = screen.getByText(/Toggle Light/i);
    expect(lightModeButton).toBeInTheDocument();
  });

  it('vérifie les liens externes', () => {
    renderWithChakra(<Configurator {...mockProps} />);
    
    const downloadLink = screen.getByText('Free Download').closest('a');
    const docsLink = screen.getByText('Documentation').closest('a');
    const tweetLink = screen.getByText('Tweet').closest('a');
    const shareLink = screen.getByText('Share').closest('a');

    expect(downloadLink).toHaveAttribute('href', expect.stringContaining('creative-tim.com'));
    expect(docsLink).toHaveAttribute('href', expect.stringContaining('demos.creative-tim.com'));
    expect(tweetLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));
    expect(shareLink).toHaveAttribute('href', expect.stringContaining('facebook.com'));
  });

  it('gère les changements d\'état du switch', async () => {
    const { rerender } = renderWithChakra(<Configurator {...mockProps} isChecked={false} />);
    
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    expect(mockProps.onSwitch).toHaveBeenCalledWith(true);

    rerender(
      <ChakraProvider>
        <Configurator {...mockProps} isChecked={true} />
      </ChakraProvider>
    );

    expect(switchElement).toBeChecked();
  });
}); 