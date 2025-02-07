const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const Footer = require('../../../components/Footer/Footer').default;

describe('Footer Component', () => {
  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement le footer avec l\'année actuelle', () => {
    renderWithChakra(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(currentYear.toString(), { exact: false })).toBeInTheDocument();
  });

  it('affiche le lien Map Action', () => {
    renderWithChakra(<Footer />);
    
    const link = screen.getByText('Map Action');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://www.map-action.com');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('gère correctement le mode RTL', () => {
    // Simuler le mode RTL
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';

    renderWithChakra(<Footer />);
    
    expect(screen.getByText('مصنوع من ❤️ بواسطة')).toBeInTheDocument();

    // Restaurer la direction originale
    document.documentElement.dir = originalDir;
  });

  it('gère correctement le mode LTR', () => {
    // Simuler le mode LTR
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'ltr';

    renderWithChakra(<Footer />);
    
    expect(screen.getByText('Made with ❤️ by')).toBeInTheDocument();

    // Restaurer la direction originale
    document.documentElement.dir = originalDir;
  });

  it('applique les styles de base correctement', () => {
    renderWithChakra(<Footer />);
    
    const footerContainer = screen.getByText(/Made with/i).closest('div');
    expect(footerContainer).toHaveStyle({
      paddingLeft: '30px',
      paddingRight: '30px',
      paddingBottom: '20px'
    });
  });

  it('vérifie la présence du symbole de copyright', () => {
    renderWithChakra(<Footer />);
    
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });

  it('vérifie que le lien est de la bonne couleur', () => {
    renderWithChakra(<Footer />);
    
    const link = screen.getByText('Map Action');
    expect(link.closest('a')).toHaveClass('chakra-link');
    expect(link.closest('a')).toHaveStyle({ color: 'blue.400' });
  });

  it('vérifie la structure responsive', () => {
    renderWithChakra(<Footer />);
    
    const footerContainer = screen.getByText(/Made with/i).closest('div');
    expect(footerContainer).toHaveStyle({
      display: 'flex'
    });
  });
}); 