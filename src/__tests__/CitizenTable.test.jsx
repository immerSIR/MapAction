const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const axios = require('axios');
const Swal = require('sweetalert2');
const CitizenTable = require('../views/Dashboard/CitizenTable').default;

jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  DismissReason: { cancel: 'cancel' }
}));

describe('CitizenTable Component', () => {
  const mockCitizens = {
    results: [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        user_type: "citizen",
        organisation: "Test Org"
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        token: 'fake-token',
        getItem: jest.fn(() => 'fake-token'),
        setItem: jest.fn()
      }
    });
    axios.get.mockResolvedValue({ data: mockCitizens });
  });

  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('charge et filtre les citoyens correctement', async () => {
    renderWithProvider(<CitizenTable />);
    
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
  });

  it('gère les erreurs de chargement', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to load'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithProvider(<CitizenTable />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  it('permet d\'ajouter un nouveau citoyen', async () => {
    const newCitizen = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      phone: "0987654321",
      user_type: "citizen"
    };

    axios.post.mockResolvedValueOnce({ data: newCitizen });
    renderWithProvider(<CitizenTable />);

    fireEvent.click(screen.getByText('Nouvel utilisateur'));
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: newCitizen.first_name } });
    fireEvent.change(inputs[1], { target: { value: newCitizen.last_name } });
    fireEvent.change(inputs[2], { target: { value: newCitizen.email } });
    
    const submitButton = screen.getByText('Ajouter');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        "Succès",
        "Utilisateur ajouté avec succès",
        "success"
      );
    });
  });

  it('gère la modification d\'un citoyen', async () => {
    // Préparez la réponse simulée pour axios.put
    const updatedCitizen = {
      id: 1,
      first_name: "Jane Updated",
      last_name: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      user_type: "citizen",
      organisation: "Test Org"
    };
    axios.put.mockResolvedValueOnce({ data: updatedCitizen });
  
    renderWithProvider(<CitizenTable />);
  
    await waitFor(() => {
      const editButton = screen.getByTestId('edit');
      fireEvent.click(editButton);
    });
  
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'Jane Updated' } });
  
    const updateButton = screen.getByText('Modifier');
    fireEvent.click(updateButton);
  
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });
  });
  

  it('gère la suppression d\'un citoyen', async () => {
    axios.delete.mockResolvedValueOnce({});
    renderWithProvider(<CitizenTable />);
  
    const deleteButton = await screen.findByTestId('delete-icon-1');
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Etes-vous sûr?",
        })
      );
    });
  
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
    });
  });
  
  

  it('gère le changement de fichier avatar', () => {
    renderWithProvider(<CitizenTable />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Logo de l'organisation/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  it('gère les erreurs lors de la mise à jour', async () => {
    axios.put.mockRejectedValueOnce(new Error('Update failed'));
    renderWithProvider(<CitizenTable />);

    await waitFor(() => {
      const editButton = screen.getByTestId('edit');
      fireEvent.click(editButton);
    });

    const updateButton = screen.getByText('Modifier');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Erreur",
        "Veuillez réessayer",
        "error"
      );
    });
  });
}); 