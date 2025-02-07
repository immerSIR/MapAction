const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider, useStyleConfig } = require('@chakra-ui/react');
const PanelContent = require('../../../components/Layout/PanelContent').default;

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useStyleConfig: jest.fn()
}));

describe('PanelContent Component', () => {
  const mockStyles = {
    padding: '16px',
    backgroundColor: 'white'
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
      <PanelContent>
        <div data-testid="child">Test Content</div>
      </PanelContent>
    );

    const content = screen.getByTestId('child').parentElement;
    expect(content).toHaveStyle(mockStyles);
  });

  it('applique correctement la variante de style', () => {
    const variantStyles = {
      margin: '16px',
      boxShadow: 'lg'
    };
    useStyleConfig.mockReturnValueOnce(variantStyles);

    renderWithChakra(
      <PanelContent variant="elevated">
        <div data-testid="child">Test Content</div>
      </PanelContent>
    );

    expect(useStyleConfig).toHaveBeenCalledWith('PanelContent', { variant: 'elevated' });
  });

  it('préserve le contenu enfant', () => {
    renderWithChakra(
      <PanelContent>
        <div data-testid="nested">
          <span>Nested Content</span>
        </div>
      </PanelContent>
    );

    expect(screen.getByText('Nested Content')).toBeInTheDocument();
    expect(screen.getByTestId('nested')).toBeInTheDocument();
  });

  it('combine correctement les styles et les props', () => {
    const customProps = {
      'data-custom': 'test',
      className: 'custom-panel',
      role: 'region'
    };

    renderWithChakra(
      <PanelContent {...customProps}>
        <div>Test Content</div>
      </PanelContent>
    );

    const panel = screen.getByRole('region');
    expect(panel).toHaveAttribute('data-custom', 'test');
    expect(panel).toHaveClass('custom-panel');
    expect(panel).toHaveStyle(mockStyles);
  });
}); 