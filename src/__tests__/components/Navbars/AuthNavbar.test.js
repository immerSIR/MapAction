const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter } = require('react-router-dom');

// Mocks nécessaires
jest.mock('react-leaflet', () => ({
  MapContainer: () => null,
  TileLayer: () => null,
  Popup: () => null,
  Marker: () => null
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    goBack: jest.fn(),
    location: { pathname: '/' }
  })
}));
jest.mock("react-markdown", () => (props) => <div {...props} />);
jest.mock("react-slick", () => (props) => <div {...props} />);
// Import correct du composant AuthNavbar
const AuthNavbar = require('../../../components/Navbars/AuthNavbar');

describe('AuthNavbar Component', () => {
  const mockProps = {
    logo: 'logo.png',
    logoText: 'Test App',
    secondary: false,
    onOpen: jest.fn()
  };

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  it('rend correctement avec les props de base', () => {
    renderWithProviders(<AuthNavbar.default {...mockProps} />);
    
    // Vérification du logo text
    expect(screen.getByText('Test App')).toBeInTheDocument();
    
    // Vérification de la présence du logo
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logo.png');
  });

  it('applique les styles de position corrects', () => {
    renderWithProviders(<AuthNavbar.default {...mockProps} />);
    
    const navbar = screen.getByTestId('auth-navbar');
    expect(navbar).toHaveStyle({
      position: 'absolute',
      top: '16px'
    });
  });

  it('gère le responsive design', () => {
    renderWithProviders(<AuthNavbar.default {...mockProps} />);
    
    const container = screen.getByTestId('auth-navbar-container');
    expect(container).toHaveStyle({
      maxWidth: '1044px',
      margin: '0 auto'
    });
  });

  it('affiche le menu hamburger en version mobile', () => {
    renderWithProviders(<AuthNavbar.default {...mockProps} />);
    
    const mobileMenuButton = screen.getByLabelText('Open Menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('gère le mode secondaire', () => {
    renderWithProviders(
      <AuthNavbar.default {...mockProps} secondary={true} />
    );
    
    const navbar = screen.getByTestId('auth-navbar');
    expect(navbar).toHaveStyle({
      backdropFilter: 'none',
      boxShadow: 'none'
    });
  });

  it('gère le mode RTL', () => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';
    
    renderWithProviders(<AuthNavbar.default {...mockProps} />);
    
    const navbar = screen.getByTestId('auth-navbar');
    expect(navbar).toHaveStyle({
      right: '0px'
    });

    document.documentElement.dir = originalDir;
  });
}); 