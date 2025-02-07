const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const axios = require('axios');
const Swal = require('sweetalert2');
const Tables = require('../views/Dashboard/Tables').default;

// Mock des dépendances
jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  DismissReason: { cancel: 'cancel' }
}));

const mockUsers = {
  results: [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      address: "123 Street",
      user_type: "elu",
      organisation: "Test Org"
    }
  ]
};

describe('Tables Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key) => key === 'user_type' ? 'admin' : 'fake-token'),
        setItem: jest.fn()
      }
    });
    axios.get.mockResolvedValue({ data: mockUsers });
  });

  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('charge et affiche la liste des utilisateurs', async () => {
    renderWithProvider(<Tables />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('ouvre le modal pour ajouter un nouvel utilisateur', async () => {
    renderWithProvider(<Tables />);

    const addButton = screen.getByText('Nouvel utilisateur');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Nouvel Utilisateur')).toBeInTheDocument();
      expect(screen.getByLabelText('Prenom')).toBeInTheDocument();
    });
  });

  it('permet d\'éditer un utilisateur existant', async () => {
    renderWithProvider(<Tables />);

    await waitFor(() => {
      const editButton = screen.getAllByRole('button')[1]; // Premier bouton d'édition
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Modifier Utilisateur')).toBeInTheDocument();
  });

  it('permet de supprimer un utilisateur', async () => {
    axios.delete.mockResolvedValueOnce({});
    renderWithProvider(<Tables />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button')[2]; // Deuxième bouton (suppression)
      fireEvent.click(deleteButton);
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Etes-vous sûr?"
      })
    );
  });

  it('gère les erreurs lors de la suppression', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Delete failed'));
    renderWithProvider(<Tables />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button')[2];
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Erreur",
        "Veuillez réessayer",
        "error"
      );
    });
  });

  it('permet d\'ajouter un nouvel utilisateur', async () => {
    axios.post.mockResolvedValueOnce({ data: mockUsers.results[0] });
    renderWithProvider(<Tables />);

    // Ouvrir le modal
    fireEvent.click(screen.getByText('Nouvel utilisateur'));

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('Prenom'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'john@example.com' } 
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Ajouter'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        "Succès",
        "Utilisateur ajouté avec succès",
        "success"
      );
    });
  });
}); 