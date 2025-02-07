const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider, useStyleConfig } = require('@chakra-ui/react');
const MainPanel = require('../../../components/Layout/MainPanel').default;

// Mock du hook useStyleConfig
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useStyleConfig: jest.fn()
}));

describe('MainPanel Component', () => {
  const mockStyles = {
    backgroundColor: 'white',
    padding: '20px'
  };

  beforeEach(() => {
    useStyleConfig.mockReturnValue(mockStyles);
  });

  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement avec les styles par défaut', () => {
    renderWithChakra(
      <MainPanel>
        <div data-testid="child">Test Content</div>
      </MainPanel>
    );

    const panel = screen.getByTestId('child').parentElement;
    expect(panel).toHaveStyle(mockStyles);
  });

  it('applique correctement la variante de style', () => {
    const variantStyles = {
      backgroundColor: 'gray.100',
      margin: '10px'
    };
    useStyleConfig.mockReturnValueOnce(variantStyles);

    renderWithChakra(
      <MainPanel variant="custom">
        <div data-testid="child">Test Content</div>
      </MainPanel>
    );

    expect(useStyleConfig).toHaveBeenCalledWith('MainPanel', { variant: 'custom' });
  });

  it('transmet correctement les props supplémentaires', () => {
    renderWithChakra(
      <MainPanel data-custom="test" aria-label="main panel">
        <div>Test Content</div>
      </MainPanel>
    );

    const panel = screen.getByLabelText('main panel');
    expect(panel).toHaveAttribute('data-custom', 'test');
  });
}); 