const React = require('react');
const { render, screen, fireEvent, act } = require('@testing-library/react');
const { 
  ChakraProvider, 
  useColorMode,
  Icon 
} = require('@chakra-ui/react');
const { MemoryRouter, useLocation } = require('react-router-dom');
const { useAuth } = require('../../../context/AuthContext');
const Sidebar = require('../../../components/Sidebar/Sidebar').default;
const { SidebarResponsive } = require('../../../components/Sidebar/Sidebar');
const { HomeIcon, PersonIcon } = require('../../../components/Icons/Icons');

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorMode: jest.fn(),
  Icon: ({ children }) => <div data-testid="icon">{children}</div>
}));

// Mock des routes modifié pour utiliser des composants d'icônes réels
const mockRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: HomeIcon,  // Utilisation d'un composant d'icône réel
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: PersonIcon,  // Utilisation d'un composant d'icône réel
    layout: "/admin",
    roles: ["admin"],
  },
  {
    name: "Sign In",
    layout: "/auth",
  },
];

describe('Sidebar Components', () => {
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    // Setup des mocks
    useLocation.mockImplementation(() => ({ pathname: '/admin/dashboard' }));
    useAuth.mockImplementation(() => ({
      userType: 'admin',
      logout: mockLogout,
    }));
    useColorMode.mockImplementation(() => ({
      colorMode: 'light',
    }));
    
    // Reset du DOM
    document.documentElement.dir = 'ltr';
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

  describe('Sidebar Component', () => {
    it('rend correctement avec les props de base', () => {
      const props = {
        logo: <div data-testid="logo">Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<Sidebar {...props} />);
      
      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('filtre les routes selon le userType', () => {
      useAuth.mockImplementation(() => ({
        userType: 'user',
        logout: mockLogout,
      }));

      const props = {
        logo: <div>Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<Sidebar {...props} />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('gère le clic sur le bouton de déconnexion', () => {
      const props = {
        logo: <div>Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<Sidebar {...props} />);
      
      const logoutButton = screen.getByText('Se Déconnecter');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalled();
    });

    it('applique les styles RTL correctement', () => {
      document.documentElement.dir = 'rtl';
      
      const props = {
        logo: <div>Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<Sidebar {...props} />);
      
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveStyle({ direction: 'rtl' });
    });
  });

  describe('SidebarResponsive Component', () => {
    it('rend correctement en mode responsive', () => {
      const props = {
        logo: <div data-testid="logo">Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<SidebarResponsive {...props} />);
      
      const hamburgerButton = screen.getByLabelText('Open menu');
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('ouvre et ferme le drawer correctement', () => {
      const props = {
        logo: <div>Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<SidebarResponsive {...props} />);
      
      const hamburgerButton = screen.getByLabelText('Open menu');
      
      // Ouvre le drawer
      fireEvent.click(hamburgerButton);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      
      // Ferme le drawer
      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('gère la navigation active', () => {
      useLocation.mockImplementation(() => ({
        pathname: '/admin/dashboard'
      }));

      const props = {
        logo: <div>Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<SidebarResponsive {...props} />);
      
      const hamburgerButton = screen.getByLabelText('Open menu');
      fireEvent.click(hamburgerButton);
      
      const activeLink = screen.getByText('Dashboard').closest('a');
      expect(activeLink).toHaveClass('active');
    });
  });

  describe('Sidebar Interactions', () => {
    it('gère les états de collapse correctement', () => {
      const routesWithCollapse = [
        {
          name: "Dashboards",
          icon: "HomeIcon",
          collapse: true,
          views: [
            {
              path: "/dashboard",
              name: "Main Dashboard",
              layout: "/admin",
            },
          ],
        },
        ...mockRoutes,
      ];

      const props = {
        logo: <div>Logo</div>,
        routes: routesWithCollapse,
      };

      renderWithProviders(<Sidebar {...props} />);
      
      const collapseButton = screen.getByText('Dashboards');
      fireEvent.click(collapseButton);
      
      expect(screen.getByText('Main Dashboard')).toBeInTheDocument();
    });

    it('applique les styles selon le mode couleur', () => {
      useColorMode.mockImplementation(() => ({
        colorMode: 'dark',
      }));

      const props = {
        logo: <div>Logo</div>,
        routes: mockRoutes,
      };

      renderWithProviders(<Sidebar {...props} />);
      
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveStyle({
        backgroundColor: 'navy.800',
      });
    });
  });
}); 