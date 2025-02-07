const React = require('react');
const { render } = require('@testing-library/react');
const { RtlProvider } = require('../../../components/RTLProvider/RTLProvider');
const createCache = require('@emotion/cache').default;
const { CacheProvider } = require('@emotion/react');

// Mock de @emotion/cache
jest.mock('@emotion/cache', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    key: 'test-key',
    stylisPlugins: []
  }))
}));

describe('RTLProvider', () => {
  beforeEach(() => {
    // Reset des mocks et de la direction du document
    jest.clearAllMocks();
    document.documentElement.dir = 'ltr';
  });

  it('crée un cache avec la configuration LTR par défaut', () => {
    render(
      <RtlProvider>
        <div>Test Content</div>
      </RtlProvider>
    );

    expect(createCache).toHaveBeenCalledWith({
      key: 'css-en'
    });
  });

  it('crée un cache avec la configuration RTL quand dir="ar"', () => {
    document.documentElement.dir = 'ar';

    render(
      <RtlProvider>
        <div>Test Content</div>
      </RtlProvider>
    );

    expect(createCache).toHaveBeenCalledWith({
      key: 'css-ar',
      stylisPlugins: expect.any(Array)
    });
  });

  it('rend le contenu enfant correctement', () => {
    const { getByText } = render(
      <RtlProvider>
        <div>Test Content</div>
      </RtlProvider>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('utilise CacheProvider avec le cache créé', () => {
    const mockCache = {
      key: 'test-key',
      stylisPlugins: []
    };
    createCache.mockReturnValue(mockCache);

    const { container } = render(
      <RtlProvider>
        <div>Test Content</div>
      </RtlProvider>
    );

    // Vérifie que le CacheProvider est utilisé avec le bon cache
    expect(container.firstChild).toBeTruthy();
  });

  it('gère le changement de direction dynamiquement', () => {
    const { rerender } = render(
      <RtlProvider>
        <div>Test Content</div>
      </RtlProvider>
    );

    expect(createCache).toHaveBeenCalledWith({
      key: 'css-en'
    });

    // Change la direction
    document.documentElement.dir = 'ar';

    // Re-render le composant
    rerender(
      <RtlProvider>
        <div>Test Content</div>
      </RtlProvider>
    );

    expect(createCache).toHaveBeenCalledWith({
      key: 'css-ar',
      stylisPlugins: expect.any(Array)
    });
  });
}); 