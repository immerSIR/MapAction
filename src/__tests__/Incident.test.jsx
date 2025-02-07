const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { createMemoryHistory } = require('history');
const { Router } = require('react-router-dom');
const axios = require('axios');
const Swal = require('sweetalert2');
const Incident = require('../views/Dashboard/Incident').default;

// Mock des dépendances
jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

const mockIncidents = {
  results: [
    {
      id: 1,
      title: "Test Incident",
      zone: "Zone Test",
      description: "Description test",
      user_id: {
        first_name: "John",
        last_name: "Doe"
      },
      etat: "declared",
      created_at: "2024-03-21T10:00:00Z"
    }
  ]
};

describe('Incident Component', () => {
  const history = createMemoryHistory();
  
  const renderWithProviders = (component) => {
    return render(
      <Router history={history}>
        <ChakraProvider>
          {component}
        </ChakraProvider>
      </Router>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key) => key === 'user_type' ? 'admin' : 'fake-token'),
        setItem: jest.fn()
      }
    });
    axios.get.mockResolvedValue({ data: mockIncidents });
  });

  it('charge et affiche la liste des incidents', async () => {
    renderWithProviders(<Incident />);

    await waitFor(() => {
      expect(screen.getByText('Test Incident')).toBeInTheDocument();
      expect(screen.getByText('Zone Test')).toBeInTheDocument();
      expect(screen.getByText('Description test')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('affiche le spinner pendant le chargement', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    renderWithProviders(<Incident />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('permet de supprimer un incident', async () => {
    axios.delete.mockResolvedValueOnce({});
    renderWithProviders(<Incident />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button')[1]; // Second button is delete
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/incident/1'),
        expect.any(Object)
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        'Succès',
        'Incident supprimé',
        'success'
      );
    });
  });

  it('navigue vers la vue détaillée lors du clic sur voir', async () => {
    renderWithProviders(<Incident />);

    await waitFor(() => {
      const viewButton = screen.getAllByRole('button')[0]; // First button is view
      fireEvent.click(viewButton);
    });

    expect(history.location.pathname).toBe('/admin/incident_view/1');
  });

  it('gère les erreurs de suppression', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Delete failed'));
    renderWithProviders(<Incident />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button')[1];
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Erreur',
        'Veuillez réessayer',
        'error'
      );
    });
  });
}); 