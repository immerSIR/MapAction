const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { ChakraProvider, useColorModeValue } = require('@chakra-ui/react');
const FixedPlugin = require('../../../components/FixedPlugin/FixedPlugin').default;

// Mock du hook useColorModeValue
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorModeValue: jest.fn()
}));

describe('FixedPlugin Component', () => {
  const mockProps = {
    secondary: false,
    onChange: jest.fn(),
    onSwitch: jest.fn(),
    fixed: false,
    onOpen: jest.fn()
  };

  beforeEach(() => {
    useColorModeValue
      .mockReturnValueOnce('gray.500') // pour navbarIcon
      .mockReturnValueOnce('white');   // pour bgButton
  });

  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement le bouton de paramètres', () => {
    renderWithChakra(<FixedPlugin {...mockProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({
      height: '52px',
      width: '52px',
      position: 'fixed'
    });
  });

  it('appelle onOpen lors du clic sur le bouton', () => {
    renderWithChakra(<FixedPlugin {...mockProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockProps.onOpen).toHaveBeenCalled();
  });

  it('gère correctement le mode RTL', () => {
    // Simuler le mode RTL
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';

    renderWithChakra(<FixedPlugin {...mockProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ left: '35px' });

    // Restaurer la direction originale
    document.documentElement.dir = originalDir;
  });

  it('gère correctement le mode LTR', () => {
    // Simuler le mode LTR
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'ltr';

    renderWithChakra(<FixedPlugin {...mockProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ right: '35px' });

    // Restaurer la direction originale
    document.documentElement.dir = originalDir;
  });

  it('masque le bouton en mode secondaire', () => {
    renderWithChakra(<FixedPlugin {...mockProps} secondary={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.parentElement).toHaveStyle({ display: 'none' });
  });
}); 