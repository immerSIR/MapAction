const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { ItemContent } = require('../../../components/Menu/ItemContent');

describe('ItemContent Component', () => {
  const mockProps = {
    aName: 'John Doe',
    aSrc: 'path/to/avatar.jpg',
    boldInfo: 'Important',
    info: 'Notification message',
    time: '2 minutes ago'
  };

  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement avec tous les props', () => {
    renderWithChakra(<ItemContent {...mockProps} />);
    
    expect(screen.getByText('Important')).toBeInTheDocument();
    expect(screen.getByText('Notification message')).toBeInTheDocument();
    expect(screen.getByText('2 minutes ago')).toBeInTheDocument();
  });

  it('affiche correctement l\'avatar', () => {
    renderWithChakra(<ItemContent {...mockProps} />);
    
    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toHaveAttribute('src', 'path/to/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'John Doe');
  });

  it('gère l\'absence de certains props', () => {
    const minimalProps = {
      aName: 'John Doe',
      time: 'now'
    };

    renderWithChakra(<ItemContent {...minimalProps} />);
    
    expect(screen.getByText('now')).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('applique les styles corrects', () => {
    renderWithChakra(<ItemContent {...mockProps} />);
    
    const boldText = screen.getByText('Important');
    expect(boldText).toHaveStyle({ fontWeight: 'bold' });
  });
}); 