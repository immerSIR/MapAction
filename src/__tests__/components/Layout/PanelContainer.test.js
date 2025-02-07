const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider, useStyleConfig } = require('@chakra-ui/react');
const PanelContainer = require('../../../components/Layout/PanelContainer').default;

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useStyleConfig: jest.fn()
}));

describe('PanelContainer Component', () => {
  const mockStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
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
      <PanelContainer>
        <div data-testid="child">Test Content</div>
      </PanelContainer>
    );

    const container = screen.getByTestId('child').parentElement;
    expect(container).toHaveStyle(mockStyles);
  });

  it('applique correctement la variante de style', () => {
    const variantStyles = {
      padding: '24px',
      borderRadius: '8px'
    };
    useStyleConfig.mockReturnValueOnce(variantStyles);

    renderWithChakra(
      <PanelContainer variant="bordered">
        <div data-testid="child">Test Content</div>
      </PanelContainer>
    );

    expect(useStyleConfig).toHaveBeenCalledWith('PanelContainer', { variant: 'bordered' });
  });

  it('gère correctement les props personnalisées', () => {
    renderWithChakra(
      <PanelContainer className="custom-class" id="test-container">
        <div>Test Content</div>
      </PanelContainer>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('custom-class');
    expect(container).toHaveAttribute('id', 'test-container');
  });
}); 