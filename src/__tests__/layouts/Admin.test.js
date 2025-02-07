const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter } = require('react-router-dom');
const AdminLayout = require('../../layouts/Admin').default;

// Mocks
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

describe('Admin Layout', () => {
  const renderWithProviders = (component) => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  it('rend correctement les composants principaux', () => {
    renderWithProviders(<AdminLayout />);
    
    expect(screen.getByTestId('admin-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('définit la direction LTR', () => {
    renderWithProviders(<AdminLayout />);
    
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('gère correctement le panel principal', () => {
    renderWithProviders(<AdminLayout />);
    
    const mainPanel = screen.getByTestId('main-panel');
    expect(mainPanel).toHaveStyle({
      width: '100%'
    });
  });

  it('applique les styles de fond', () => {
    renderWithProviders(<AdminLayout />);
    
    const bgElement = screen.getByTestId('admin-bg');
    expect(bgElement).toHaveStyle({
      minHeight: '40vh',
      position: 'absolute'
    });
  });
}); 