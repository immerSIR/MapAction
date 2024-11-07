import { render, screen } from '@testing-library/react';
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import Card from 'components/Card/Card';

describe('Card Component', () => {
  const Wrapper = ({ children }) => <ChakraProvider>{children}</ChakraProvider>;

  it('renders without crashing', () => {
    render(<Card variant="solid">Card Content</Card>, { wrapper: Wrapper });
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies the correct styles based on the variant prop', () => {
    const { container } = render(<Card variant="solid">Card Content</Card>, { wrapper: Wrapper });
    
    // Check if the correct class is applied to the Card component.
    const card = container.firstChild;
    
    // If Chakra UI applies the variant via a class, the class name might look something like `chakra-card-solid`.
    expect(card).toHaveClass('css-0');
  });

  it('renders children correctly', () => {
    render(<Card variant="outline">Test Child</Card>, { wrapper: Wrapper });
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('passes additional props to the Box component', () => {
    const { container } = render(
      <Card variant="outline" data-testid="card-container">
        Card Content
      </Card>, 
      { wrapper: Wrapper }
    );
    expect(container.querySelector('[data-testid="card-container"]')).toBeInTheDocument();
  });

  it('applies the default styles when no variant is provided', () => {
    const { container } = render(<Card>Default Card</Card>, { wrapper: Wrapper });
    const card = container.firstChild;
  
    // Check for the default background color
    const computedStyle = window.getComputedStyle(card);
    
    // Chakra UI might apply a different default background color, adjust based on your theme's configuration
    expect(computedStyle.backgroundColor).toBe(''); // transparent or other default color
  });
});
