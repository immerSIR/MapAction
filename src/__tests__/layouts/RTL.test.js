const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter } = require('react-router-dom');
const RTL = require('../../layouts/RTL').default;

// Mocks nécessaires
jest.mock("react-markdown", () => (props) => <div {...props} />);
jest.mock("react-slick", () => (props) => <div {...props} />);
jest.mock('../../components/Navbars/AdminNavbar', () => {
  return function MockAdminNavbar() {
    return <div data-testid="admin-navbar">Admin Navbar</div>;
  };
});

jest.mock('../../components/Sidebar/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('../../components/Footer/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../../components/Configurator/Configurator', () => {
  return function MockConfigurator() {
    return <div data-testid="configurator">Configurator</div>;
  };
});

describe('RTL Layout', () => {
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
    // Reset du DOM direction
    document.documentElement.dir = 'ltr';
  });

  it('rend correctement les composants principaux', () => {
    renderWithProviders(<RTL />);
    
    expect(screen.getByTestId('admin-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('configurator')).toBeInTheDocument();
  });

  it('définit la direction RTL', () => {
    renderWithProviders(<RTL />);
    
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('gère correctement le panel principal', () => {
    renderWithProviders(<RTL />);
    
    const mainPanel = screen.getByTestId('main-panel');
    expect(mainPanel).toHaveStyle({
      width: '100%'
    });
  });

  it('applique les styles RTL', () => {
    renderWithProviders(<RTL />);
    
    const rtlContainer = screen.getByTestId('rtl-container');
    expect(rtlContainer).toHaveStyle({
      direction: 'rtl'
    });
  });
}); 