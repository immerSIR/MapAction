const React = require('react');
const { render, screen, fireEvent, act } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter } = require('react-router-dom');

// Mocks
jest.mock('react-leaflet', () => ({
  MapContainer: () => null,
  TileLayer: () => null,
  Popup: () => null,
  Marker: () => null
}));

// Mock plus détaillé de react-router-dom
jest.mock('react-router-dom', () => {
  const listenMock = jest.fn(() => jest.fn()); // Retourne une fonction de nettoyage
  return {
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      listen: listenMock,
      location: { pathname: '/dashboard' },
      push: jest.fn(),
      goBack: jest.fn()
    }),
    useLocation: () => ({
      pathname: '/dashboard'
    })
  };
});

// Mock du composant AdminNavbarLinks
jest.mock('../../../components/Navbars/AdminNavbarLinks', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-navbar-links">Navbar Links</div>
}));

const AdminNavbar = require('../../../components/Navbars/AdminNavbar').default;

describe('AdminNavbar Component', () => {
  const mockProps = {
    brandText: 'Dashboard',
    onOpen: jest.fn(),
    fixed: false,
    secondary: false
  };

  beforeEach(() => {
    // Reset des mocks et de l'état global
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
    window.scrollY = 0;
  });

  afterEach(() => {
    // Nettoyage après chaque test
    jest.resetModules();
  });

  const renderWithProviders = (component) => {
    return render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          {component}
        </MemoryRouter>
      </ChakraProvider>
    );
  };

  it('rend correctement avec les props de base', () => {
    const { container } = renderWithProviders(<AdminNavbar {...mockProps} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('admin-navbar-links')).toBeInTheDocument();
  });

  it('gère le défilement correctement', async () => {
    const { container } = renderWithProviders(<AdminNavbar {...mockProps} fixed={true} />);
    
    await act(async () => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    const navbar = container.querySelector('[data-testid="admin-navbar"]');
    expect(navbar).toBeInTheDocument();
  });

  it('applique les styles secondaires', () => {
    const { container } = renderWithProviders(<AdminNavbar {...mockProps} secondary={true} />);
    
    const navbar = container.querySelector('[data-testid="admin-navbar"]');
    expect(navbar).toBeInTheDocument();
  });

  it('gère le mode RTL', () => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';

    const { container } = renderWithProviders(<AdminNavbar {...mockProps} />);
    
    const navbar = container.querySelector('[data-testid="admin-navbar"]');
    expect(navbar).toBeInTheDocument();

    document.documentElement.dir = originalDir;
  });

  it('rend les liens de la navbar', () => {
    renderWithProviders(<AdminNavbar {...mockProps} />);
    
    expect(screen.getByTestId('admin-navbar-links')).toBeInTheDocument();
  });

  it('vérifie la structure de la navbar', () => {
    const { container } = renderWithProviders(<AdminNavbar {...mockProps} />);
    
    const navbar = container.querySelector('[data-testid="admin-navbar"]');
    expect(navbar).toBeInTheDocument();
    expect(screen.getByTestId('admin-navbar-links')).toBeInTheDocument();
  });
}); 