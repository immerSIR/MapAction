const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter } = require('react-router-dom');
const AuthLayout = require('../../layouts/Auth').default;

jest.mock("react-markdown", () => (props) => <div {...props} />);
jest.mock("react-slick", () => (props) => <div {...props} />);
jest.mock('../../components/Navbars/AuthNavbar', () => {
  return function MockAuthNavbar() {
    return <div data-testid="auth-navbar">Auth Navbar</div>;
  };
});

jest.mock('../../components/Footer/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe('Auth Layout', () => {
  const renderWithProviders = (component) => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    // Reset des styles du body
    document.body.style.overflow = '';
  });

  it('rend correctement les composants principaux', () => {
    renderWithProviders(<AuthLayout />);
    
    expect(screen.getByTestId('auth-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('définit le style overflow du body', () => {
    renderWithProviders(<AuthLayout />);
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('gère correctement le wrapper', () => {
    renderWithProviders(<AuthLayout />);
    
    const wrapper = screen.getByTestId('auth-wrapper');
    expect(wrapper).toHaveStyle({
      width: '100%'
    });
  });

  it('applique les styles du footer', () => {
    renderWithProviders(<AuthLayout />);
    
    const footerContainer = screen.getByTestId('footer-container');
    expect(footerContainer).toHaveStyle({
      maxWidth: '100%',
      marginTop: '60px'
    });
  });
}); 