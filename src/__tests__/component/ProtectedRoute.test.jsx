const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router-dom');
const { useAuth } = require('context/AuthContext');
const ProtectedRoute = require('../../components/ProtectedRoute').default;

// Mock du contexte d'authentification
jest.mock('context/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('ProtectedRoute Component', () => {
  // Composant fictif pour les tests
  const TestComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;

  // Helper pour le rendu avec router
  const renderWithRouter = (component, initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {component}
        <Route path="/auth/signin" component={LoginComponent} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rend le composant protégé quand l\'utilisateur est authentifié', () => {
    // Configuration du mock pour un utilisateur authentifié
    useAuth.mockReturnValue({
      isAuthenticated: true,
      userType: 'user'
    });

    renderWithRouter(
      <ProtectedRoute
        path="/"
        component={TestComponent}
      />
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirige vers la page de connexion quand l\'utilisateur n\'est pas authentifié', () => {
    // Configuration du mock pour un utilisateur non authentifié
    useAuth.mockReturnValue({
      isAuthenticated: false,
      userType: null
    });

    renderWithRouter(
      <ProtectedRoute
        path="/"
        component={TestComponent}
      />
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('passe les props supplémentaires au composant protégé', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      userType: 'user'
    });

    const TestComponentWithProps = (props) => (
      <div>Protected Content: {props.testProp}</div>
    );

    renderWithRouter(
      <ProtectedRoute
        path="/"
        component={TestComponentWithProps}
        testProp="test value"
      />
    );

    expect(screen.getByText('Protected Content: test value')).toBeInTheDocument();
  });

  it('conserve les props de route lors de la redirection', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      userType: null
    });

    const { container } = renderWithRouter(
      <ProtectedRoute
        path="/protected"
        component={TestComponent}
        someExtraProp="test"
      />,
      ['/protected']
    );

    // Vérifie que la redirection a eu lieu
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    
    // Vérifie que l'URL a été mise à jour
    expect(container.innerHTML).toContain('Login Page');
  });

  it('gère correctement les changements d\'état d\'authentification', () => {
    // Commence non authentifié
    useAuth.mockReturnValue({
      isAuthenticated: false,
      userType: null
    });

    const { rerender } = renderWithRouter(
      <ProtectedRoute
        path="/"
        component={TestComponent}
      />
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();

    // Change pour authentifié
    useAuth.mockReturnValue({
      isAuthenticated: true,
      userType: 'user'
    });

    rerender(
      <MemoryRouter>
        <ProtectedRoute
          path="/"
          component={TestComponent}
        />
        <Route path="/auth/signin" component={LoginComponent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
