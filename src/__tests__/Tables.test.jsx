// const React = require('react');
// const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
// const { ChakraProvider } = require('@chakra-ui/react');
// const axios = require('axios');
// const Swal = require('sweetalert2');
// const Tables = require('../views/Dashboard/Tables').default;

// // Mock des dépendances
// jest.mock('axios');
// jest.mock('sweetalert2', () => ({
//   fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
//   DismissReason: { cancel: 'cancel' }
// }));

// const mockUsers = {
//   results: [
//     {
//       id: 1,
//       first_name: "John",
//       last_name: "Doe",
//       email: "john@example.com",
//       phone: "1234567890",
//       address: "123 Street",
//       user_type: "elu",
//       organisation: "Test Org"
//     }
//   ]
// };

// describe('Tables Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     Object.defineProperty(window, 'sessionStorage', {
//       value: {
//         getItem: jest.fn((key) => key === 'user_type' ? 'admin' : 'fake-token'),
//         setItem: jest.fn()
//       }
//     });
//     axios.get.mockResolvedValue({ data: mockUsers });
//   });

//   const renderWithProvider = (component) => {
//     return render(
//       <ChakraProvider>
//         {component}
//       </ChakraProvider>
//     );
//   };

//   it('charge et affiche la liste des utilisateurs', async () => {
//     renderWithProvider(<Tables />);

//     await waitFor(() => {
//       expect(screen.getByText('John')).toBeInTheDocument();
//       expect(screen.getByText('Doe')).toBeInTheDocument();
//       expect(screen.getByText('john@example.com')).toBeInTheDocument();
//     });
//   });

//   it('ouvre le modal pour ajouter un nouvel utilisateur', async () => {
//     renderWithProvider(<Tables />);

//     const addButton = screen.getByText('Nouvel utilisateur');
//     fireEvent.click(addButton);

//     await waitFor(() => {
//       expect(screen.getByText('Nouvel Utilisateur')).toBeInTheDocument();
//       expect(screen.getByLabelText('Prenom')).toBeInTheDocument();
//     });
//   });

//   it('permet d\'éditer un utilisateur existant', async () => {
//     renderWithProvider(<Tables />);

//     await waitFor(() => {
//       const editButton = screen.getAllByRole('button')[1]; // Premier bouton d'édition
//       fireEvent.click(editButton);
//     });

//     expect(screen.getByText('Modifier Utilisateur')).toBeInTheDocument();
//   });

//   it('permet de supprimer un utilisateur', async () => {
//     axios.delete.mockResolvedValueOnce({});
//     renderWithProvider(<Tables />);

//     await waitFor(() => {
//       const deleteButton = screen.getAllByRole('button')[2]; // Deuxième bouton (suppression)
//       fireEvent.click(deleteButton);
//     });

//     expect(Swal.fire).toHaveBeenCalledWith(
//       expect.objectContaining({
//         title: "Etes-vous sûr?"
//       })
//     );
//   });

//   it('gère les erreurs lors de la suppression', async () => {
//     axios.delete.mockRejectedValueOnce(new Error('Delete failed'));
//     renderWithProvider(<Tables />);

//     await waitFor(() => {
//       const deleteButton = screen.getAllByRole('button')[2];
//       fireEvent.click(deleteButton);
//     });

//     await waitFor(() => {
//       expect(Swal.fire).toHaveBeenCalledWith(
//         "Erreur",
//         "Veuillez réessayer",
//         "error"
//       );
//     });
//   });

//   it('permet d\'ajouter un nouvel utilisateur', async () => {
//     axios.post.mockResolvedValueOnce({ data: mockUsers.results[0] });
//     renderWithProvider(<Tables />);

//     // Ouvrir le modal
//     fireEvent.click(screen.getByText('Nouvel utilisateur'));

//     // Remplir le formulaire
//     fireEvent.change(screen.getByLabelText('Prenom'), { 
//       target: { value: 'John' } 
//     });
//     fireEvent.change(screen.getByLabelText('Email'), { 
//       target: { value: 'john@example.com' } 
//     });

//     // Soumettre le formulaire
//     fireEvent.click(screen.getByText('Ajouter'));

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalled();
//       expect(Swal.fire).toHaveBeenCalledWith(
//         "Succès",
//         "Utilisateur ajouté avec succès",
//         "success"
//       );
//     });
//   });
// }); 

const React = require('react');
const { render, screen, fireEvent, waitFor, within } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const axios = require('axios');
const Swal = require('sweetalert2');
const Tables = require('../views/Dashboard/Tables').default;

// Mock des dépendances
jest.mock('axios');

// Mock plus détaillé de Swal pour gérer la confirmation/annulation
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  DismissReason: { cancel: 'cancel' }
}));

// Mock react-select
jest.mock('react-select', () => ({ options, value, onChange, isMulti, placeholder }) => {
  function handleChange(event) {
    const newValue = options.find(option => option.value === event.currentTarget.value);
    if (isMulti) {
      // Simuler l'ajout/suppression pour le multi-select
      const currentValues = Array.isArray(value) ? value.map(v => v.value) : [];
      if (currentValues.includes(newValue.value)) {
        onChange(value.filter(v => v.value !== newValue.value));
      } else {
        onChange([...(value || []), newValue]);
      }
    } else {
      onChange(newValue);
    }
  }
  return (
    <select 
      data-testid={isMulti ? "multi-select" : "select"} 
      value={isMulti ? (value ? value.map(v => v.value) : []) : (value ? value.value : '')} 
      onChange={handleChange} 
      multiple={isMulti}
    >
      {!isMulti && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

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
      organisation: "Test Org 1"
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      phone: "0987654321",
      address: "456 Avenue",
      user_type: "citizen", // Pour tester le filtre
      organisation: "Test Org 2"
    },
     {
      id: 3,
      first_name: "Alice",
      last_name: "Brown",
      email: "alice@example.com",
      phone: "1122334455",
      address: "789 Boulevard",
      user_type: "elu", 
      organisation: "Test Org 3"
    }
  ]
};

describe('Tables Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key) => key === 'user_type' ? 'admin' : 'fake-token'),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
    // Mock initial GET request
    axios.get.mockResolvedValue({ data: mockUsers });
    // Réinitialiser Swal mock pour chaque test
    Swal.fire.mockClear();
    Swal.fire.mockResolvedValue({ isConfirmed: true }); // Comportement par défaut
  });

  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  // --- Tests Existants (légèrement modifiés pour robustesse) ---

  it('charge et affiche uniquement les utilisateurs de type "elu"', async () => {
    renderWithProvider(<Tables />);

    await waitFor(() => {
      // Vérifie que John (elu) est affiché
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      // Vérifie qu'Alice (elu) est affichée
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Brown')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      // Vérifie que Jane (citizen) N'EST PAS affichée
      expect(screen.queryByText('Jane')).not.toBeInTheDocument();
      expect(screen.queryByText('Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
    });
    // Vérifie que axios.get a été appelé correctement
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/MapApi/user/?limit=1000'),
      expect.any(Object)
    );
  });

  it('ouvre le modal pour ajouter un nouvel utilisateur et le ferme avec Annuler', async () => {
    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled()); // Attendre le chargement initial

    const addButton = screen.getByRole('button', { name: /Nouvel utilisateur/i });
    fireEvent.click(addButton);

    // Vérifier l'ouverture du modal
    let modalTitle;
    await waitFor(() => {
      modalTitle = screen.getByText('Nouvel Utilisateur');
      expect(modalTitle).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Prenom')).toBeInTheDocument();

    // Cliquer sur Annuler
    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(cancelButton);

    // Vérifier la fermeture du modal
    await waitFor(() => {
      expect(modalTitle).not.toBeInTheDocument();
    });
  });

  // --- Nouveaux Tests --- 

  it('affiche une erreur Swal si l\'ajout d\'utilisateur échoue', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: 'Server Error' } });
    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Nouvel utilisateur/i }));
    await screen.findByText('Nouvel Utilisateur');

    // Remplir un champ pour activer le bouton (même si l'API échoue)
    fireEvent.change(screen.getByLabelText('Prenom'), { target: { value: 'Test' } });

    // Cliquer sur Ajouter
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    // Vérifier l'appel à Swal.fire pour l'erreur
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith("Erreur", "Veuillez réessayer", "error");
    });
    // Vérifier que le modal est toujours ouvert
    expect(screen.getByText('Nouvel Utilisateur')).toBeInTheDocument();
  });

  it('affiche l\'état de chargement sur le bouton Ajouter pendant la soumission', async () => {
    // Simuler une réponse lente de l'API
    let resolvePost;
    axios.post.mockImplementationOnce(() => new Promise(resolve => { resolvePost = resolve; }));
    
    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Nouvel utilisateur/i }));
    await screen.findByText('Nouvel Utilisateur');

    // Remplir les champs nécessaires
    fireEvent.change(screen.getByLabelText('Prenom'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });

    // Cliquer sur Ajouter
    const addButton = screen.getByRole('button', { name: 'Ajouter' });
    fireEvent.click(addButton);

    // Vérifier que le bouton est en état de chargement (attribut `isLoading` ou classe CSS spécifique)
    // Note: @testing-library/jest-dom ne vérifie pas directement `isLoading`. On peut vérifier si le bouton est désactivé ou a un spinner.
    await waitFor(() => {
        expect(addButton).toBeDisabled(); // Chakra UI désactive souvent les boutons en chargement
        // Optionnel: vérifier la présence d'un spinner dans le bouton si Chakra l'ajoute
        // expect(within(addButton).getByRole('status')).toBeInTheDocument(); 
    });

    // Résoudre la promesse pour terminer le test proprement
    resolvePost({ data: { id: 99, first_name: 'Test', user_type: 'elu' } }); 
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith("Succès", "Utilisateur ajouté avec succès", "success"));
  });

  it('permet de remplir tous les champs du formulaire d\'ajout, y compris les selects et le fichier', async () => {
    const newUser = {
      id: 4,
      first_name: "Test",
      last_name: "User",
      email: "test.user@example.com",
      phone: "111222333",
      address: "Test Address",
      user_type: "elu",
      organisation: "New Org",
      avatar: null // Le fichier sera ajouté séparément
    };
    axios.post.mockResolvedValueOnce({ data: newUser });
    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /Nouvel utilisateur/i }));
    await screen.findByText('Nouvel Utilisateur');

    // Remplir les champs texte
    fireEvent.change(screen.getByLabelText('Prenom'), { target: { value: newUser.first_name } });
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: newUser.last_name } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: newUser.email } });
    fireEvent.change(screen.getByLabelText('Téléphone'), { target: { value: newUser.phone } });
    fireEvent.change(screen.getByLabelText('Adresse'), { target: { value: newUser.address } });
    fireEvent.change(screen.getByLabelText('Organisation'), { target: { value: newUser.organisation } });

    // Sélectionner le type d'utilisateur (utilisation du mock react-select)
    fireEvent.change(screen.getByTestId('select'), { target: { value: 'elu' } });

    // Sélectionner des préférences d'incident (utilisation du mock react-select multi)
    const multiSelect = screen.getByTestId('multi-select');
    fireEvent.change(multiSelect, { target: { value: 'Puits abîmé' } });
    fireEvent.change(multiSelect, { target: { value: 'Fosse pleine' } });

    // Simuler l'ajout d'un fichier
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Logo de l'organisation/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Soumettre
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    // Vérifier l'appel à axios.post avec FormData
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/user/'),
        expect.any(FormData), // Vérifie que c'est bien un FormData
        expect.any(Object)
      );
      // Vérifier le contenu du FormData (plus complexe, nécessite d'inspecter l'appel mocké)
      const formDataEntries = Object.fromEntries(axios.post.mock.calls[0][1].entries());
      expect(formDataEntries.first_name).toBe(newUser.first_name);
      expect(formDataEntries.email).toBe(newUser.email);
      expect(formDataEntries.user_type).toBe('elu');
      expect(formDataEntries.avatar).toBe(file);
      // Note: La vérification des préférences d'incident dépend de comment elles sont envoyées (probablement pas dans ce FormData)
    });
    expect(Swal.fire).toHaveBeenCalledWith("Succès", "Utilisateur ajouté avec succès", "success");
  });

  it('pré-remplit le formulaire de modification et permet la mise à jour', async () => {
    const userToEdit = mockUsers.results.find(u => u.id === 1);
    const updatedUser = { ...userToEdit, first_name: "Johnny", organisation: "Updated Org" };
    axios.put.mockResolvedValueOnce({ data: updatedUser });

    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    // Trouver la ligne de l'utilisateur John Doe et cliquer sur Editer
    const userRow = screen.getByText(userToEdit.email).closest('tr');
    const editButton = within(userRow).getByRole('button', { name: /modifier l'organisation/i });
    fireEvent.click(editButton);

    // Vérifier l'ouverture et le pré-remplissage du modal
    await screen.findByText('Modifier Utilisateur');
    expect(screen.getByLabelText('Prenom')).toHaveValue(userToEdit.first_name);
    expect(screen.getByLabelText('Nom')).toHaveValue(userToEdit.last_name);
    expect(screen.getByLabelText('Email')).toHaveValue(userToEdit.email);
    expect(screen.getByLabelText('Organisation')).toHaveValue(userToEdit.organisation);
    // Vérifier le select (plus complexe avec le mock, on vérifie la valeur sélectionnée)
    expect(screen.getByTestId('select')).toHaveValue(userToEdit.user_type);

    // Modifier des champs
    fireEvent.change(screen.getByLabelText('Prenom'), { target: { value: updatedUser.first_name } });
    fireEvent.change(screen.getByLabelText('Organisation'), { target: { value: updatedUser.organisation } });

    // Cliquer sur Modifier
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));

    // Vérifier l'appel PUT et le succès
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/MapApi/user/${userToEdit.id}/`),
        expect.any(FormData),
        expect.any(Object)
      );
      const formDataEntries = Object.fromEntries(axios.put.mock.calls[0][1].entries());
      expect(formDataEntries.first_name).toBe(updatedUser.first_name);
      expect(formDataEntries.organisation).toBe(updatedUser.organisation);
    });
    expect(Swal.fire).toHaveBeenCalledWith("Succès", "Utilisateur mis à jour avec succès", "success");
    // Vérifier que fetchUserData est appelé après la mise à jour
    expect(axios.get).toHaveBeenCalledTimes(2); // Initial + Refresh
  });

  it('affiche une erreur Swal si la modification d\'utilisateur échoue', async () => {
    axios.put.mockRejectedValueOnce({ response: { status: 400, data: 'Bad Request' } });
    const userToEdit = mockUsers.results.find(u => u.id === 1);

    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const userRow = screen.getByText(userToEdit.email).closest('tr');
    const editButton = within(userRow).getByRole('button', { name: /modifier l'organisation/i });
    fireEvent.click(editButton);

    await screen.findByText('Modifier Utilisateur');
    fireEvent.change(screen.getByLabelText('Prenom'), { target: { value: 'Nouveau Prenom' } });
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith("Erreur", "Veuillez réessayer", "error");
    });
    expect(screen.getByText('Modifier Utilisateur')).toBeInTheDocument(); // Le modal reste ouvert
  });

  it('annule la suppression si l\'utilisateur clique sur Annuler dans Swal', async () => {
    // Configurer Swal pour simuler une annulation
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false, dismiss: Swal.DismissReason.cancel });
    const userToDelete = mockUsers.results.find(u => u.id === 1);

    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const userRow = screen.getByText(userToDelete.email).closest('tr');
    // Utiliser un data-testid plus robuste
    const deleteButton = within(userRow).getByTestId(`delete-icon-${userToDelete.id}`); 
    fireEvent.click(deleteButton);

    // Attendre l'appel à Swal.fire pour la confirmation
    await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "Etes-vous sûr?" }));
    });

    // Vérifier l'appel à Swal.fire pour l'annulation
    expect(Swal.fire).toHaveBeenCalledWith("Annulé", "La suppression a été annulée", "error");
    // Vérifier qu'axios.delete n'a PAS été appelé
    expect(axios.delete).not.toHaveBeenCalled();
  });

  it('supprime l\'utilisateur après confirmation et rafraîchit les données', async () => {
    axios.delete.mockResolvedValueOnce({}); // Simuler la suppression réussie
    const userToDelete = mockUsers.results.find(u => u.id === 1);

    renderWithProvider(<Tables />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const userRow = screen.getByText(userToDelete.email).closest('tr');
    const deleteButton = within(userRow).getByTestId(`delete-icon-${userToDelete.id}`);
    fireEvent.click(deleteButton);

    // Attendre la confirmation (par défaut isConfirmed: true)
    await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "Etes-vous sûr?" }));
    });

    // Vérifier l'appel delete et le message de succès
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/MapApi/user/${userToDelete.id}/`),
        expect.any(Object)
      );
    });
    expect(Swal.fire).toHaveBeenCalledWith("Supprimé!", "L'utilisateur a été supprimé.", "success");
    // Vérifier que fetchUserData est appelé pour rafraîchir
    expect(axios.get).toHaveBeenCalledTimes(2); // Initial + Refresh
  });

});

