const React = require('react');
const { render, act } = require('@testing-library/react');
const { AuthProvider, useAuth } = require('../../context/AuthContext');

describe('AuthContext', () => {
  beforeEach(() => {
    // Nettoyer le sessionStorage avant chaque test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { isAuthenticated, login, logout, userType } = useAuth();
    return (
      <div>
        <div data-testid="auth-status">{isAuthenticated.toString()}</div>
        <div data-testid="user-type">{userType || 'no-type'}</div>
        <button data-testid="login-btn" onClick={login}>Login</button>
        <button data-testid="logout-btn" onClick={logout}>Logout</button>
      </div>
    );
  };

  it('fournit l\'état d\'authentification initial', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('auth-status')).toHaveTextContent('false');
  });

  it('gère correctement le login', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByTestId('login-btn').click();
    });

    expect(getByTestId('auth-status')).toHaveTextContent('true');
  });

  it('gère correctement le logout', () => {
    // Simuler un utilisateur connecté
    sessionStorage.setItem('token', 'test-token');
    sessionStorage.setItem('user', 'test-user');
    sessionStorage.setItem('user_id', '123');
    sessionStorage.setItem('first_name', 'John');
    sessionStorage.setItem('zone', 'test-zone');
    sessionStorage.setItem('user_type', 'admin');

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByTestId('logout-btn').click();
    });

    expect(getByTestId('auth-status')).toHaveTextContent('false');
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
    expect(sessionStorage.getItem('user_id')).toBeNull();
    expect(sessionStorage.getItem('first_name')).toBeNull();
    expect(sessionStorage.getItem('zone')).toBeNull();
    expect(sessionStorage.getItem('user_type')).toBeNull();
  });

  it('récupère correctement le user_type du sessionStorage', () => {
    sessionStorage.setItem('user_type', 'admin');

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('user-type')).toHaveTextContent('admin');
  });
}); 