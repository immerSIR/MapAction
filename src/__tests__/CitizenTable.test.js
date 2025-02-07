const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const CitizenTable = require('../views/Dashboard/CitizenTable').default;
const axios = require('axios');
const { config } = require('../config');
const Swal = require('sweetalert2');

// Mocks
jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  DismissReason: { cancel: 'cancel' }
}));

// Mock de sessionStorage
const mockSessionStorage = {
  token: 'fake-token',
  user_type: 'admin'
};

global.sessionStorage = {
  getItem: jest.fn(key => mockSessionStorage[key]),
  setItem: jest.fn()
};

describe('CitizenTable', () => {
  const mockData = {
    results: [
      {
        id: 1,
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@test.com',
        phone: '0123456789',
        user_type: 'citizen'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockData });
    // Mock de Swal.fire pour retourner une promesse
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('charge et affiche la liste des citoyens', async () => {
    renderWithProvider(<CitizenTable />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${config.url}/MapApi/user/`,
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Jean')).toBeInTheDocument();
      expect(screen.getByText('Dupont')).toBeInTheDocument();
    });
  });

  it('permet de supprimer un citoyen', async () => {
    renderWithProvider(<CitizenTable />);

    await waitFor(() => {
      expect(screen.getByText('Jean')).toBeInTheDocument();
    });

    const deleteIcon = screen.getByTestId('delete-icon-1');
    fireEvent.click(deleteIcon);

    // Attendre que Swal.fire soit appelé
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    // Vérifier que la suppression a été effectuée
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `${config.url}/MapApi/user/1/`,
        expect.any(Object)
      );
    });
  });

  it('affiche le spinner pendant le chargement', async () => {
    renderWithProvider(<CitizenTable />);
    
    // Vérifier que le spinner est présent
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('affiche les en-têtes corrects', async () => {
    renderWithProvider(<CitizenTable />);
    
    // Vérifier les en-têtes exacts du composant
    expect(screen.getByText('Prenom')).toBeInTheDocument();
    expect(screen.getByText('Nom')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Téléphone')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
