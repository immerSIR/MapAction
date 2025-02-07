const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { SearchBar } = require('../../../components/Navbars/SearchBar/SearchBar');

describe('SearchBar Component', () => {
  const mockProps = {
    onChange: jest.fn(),
    value: '',
    onSearch: jest.fn()
  };

  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement avec le placeholder', () => {
    renderWithChakra(<SearchBar {...mockProps} />);
    
    expect(screen.getByPlaceholderText('Recherche...')).toBeInTheDocument();
  });

  it('appelle onChange lors de la saisie', () => {
    renderWithChakra(<SearchBar {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Recherche...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('affiche l\'icône de recherche', () => {
    renderWithChakra(<SearchBar {...mockProps} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applique les styles corrects', () => {
    renderWithChakra(<SearchBar {...mockProps} />);
    
    const inputGroup = screen.getByRole('group');
    expect(inputGroup).toHaveStyle({ borderRadius: '8px' });
  });

  it('gère le focus correctement', () => {
    renderWithChakra(<SearchBar {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Recherche...');
    fireEvent.focus(input);
    
    expect(input).toHaveFocus();
  });
}); 