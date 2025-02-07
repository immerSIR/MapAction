import { render, screen } from '@testing-library/react';
import { SidebarHelp } from '../../../components/Sidebar/SidebarHelp';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Wrapper pour ChakraProvider et Router
const Wrapper = ({ children }) => (
  <ChakraProvider>
    <Router>
      {children}
    </Router>
  </ChakraProvider>
);

describe('SidebarHelp Component', () => {
  test('renders the SidebarHelp component correctly', () => {
    render(<SidebarHelp />, { wrapper: Wrapper });

    // Vérifier si l'image est présente
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();

    // Vérifier les textes
    expect(screen.getByText(/Need help?/i)).toBeInTheDocument();
    expect(screen.getByText(/Please check our docs./i)).toBeInTheDocument();

    // Vérifier les boutons
    const documentationButton = screen.getByText(/DOCUMENTATION/i);
    expect(documentationButton).toBeInTheDocument();
    expect(documentationButton.closest('a')).toHaveAttribute('href', 'https://demos.creative-tim.com/docs-argon-dashboard-chakra');

    const upgradeButton = screen.getByText(/UPGRADE TO PRO/i);
    expect(upgradeButton).toBeInTheDocument();
    expect(upgradeButton.closest('a')).toHaveAttribute('href', 'https://www.creative-tim.com/product/argon-dashboard-chakra-pro');
  });


  
});
