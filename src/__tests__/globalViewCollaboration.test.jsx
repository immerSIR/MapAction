const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter } = require('react-router-dom');
const axios = require('axios');
const Swal = require('sweetalert2');
const GlobalViewCollaboration = require('../views/Dashboard/globalViewCollaboration').default;

// Mock complet de leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn()
  })),
  marker: jest.fn(() => ({
    setLatLng: jest.fn(),
    setIcon: jest.fn(),
    addTo: jest.fn(),
    bindPopup: jest.fn()
  })),
  icon: jest.fn(() => ({})),
  divIcon: jest.fn(),
  point: jest.fn(),
  latLng: jest.fn()
}));

// Mock de react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }) => (
    <div data-testid="map" {...props}>
      {children}
    </div>
  ),
  TileLayer: () => null,
  Marker: () => <div data-testid="marker">Marker</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Circle: () => null,
  useMap: () => ({
    setView: jest.fn()
  })
}));

// Autres mocks
jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

jest.mock('Fonctions/Incident_fonction', () => ({
  IncidentData: () => ({
    latitude: 48.8566,
    longitude: 2.3522,
    imgUrl: 'test-image.jpg',
    position: [48.8566, 2.3522],
    date: '2024-03-21',
    heure: '14:30',
    incident: {
      title: 'Test Incident',
      etat: 'declared'
    }
  })
}));

describe('GlobalViewCollaboration Component', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    phone: '1234567890',
    organisation: 'Test Org',
    avatar: '/test-avatar.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock sessionStorage
    global.sessionStorage = {
      getItem: jest.fn((key) => {
        if (key === 'user_id') return '1';
        if (key === 'token') return 'fake-token';
        return null;
      }),
      setItem: jest.fn()
    };

    // Mock des réponses axios
    axios.get.mockImplementation((url) => {
      if (url.includes('/MapApi/user/')) {
        return Promise.resolve({ data: mockUser });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <MemoryRouter>
        <ChakraProvider>
          {component}
        </ChakraProvider>
      </MemoryRouter>
    );
  };

  it('affiche les informations de base', async () => {
    renderWithProviders(<GlobalViewCollaboration />);
    
    await waitFor(() => {
      expect(screen.getByTestId('map')).toBeInTheDocument();
      expect(screen.getByText(/Faire une demande de collaboration/i)).toBeInTheDocument();
    });
  });

  it('permet de sélectionner des motivations', async () => {
    renderWithProviders(<GlobalViewCollaboration />);
    
    const checkbox = screen.getByLabelText(/Avoir plus d'informations sur l'incident/i);
    fireEvent.click(checkbox);
    
    expect(checkbox).toBeChecked();
  });

  it('affiche le champ de texte pour "Autres"', async () => {
    renderWithProviders(<GlobalViewCollaboration />);
    
    const autresCheckbox = screen.getByLabelText(/Autres/i);
    fireEvent.click(autresCheckbox);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Veuillez spécifier')).toBeInTheDocument();
    });
  });

  it('envoie une demande de collaboration', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 1 } });
    renderWithProviders(<GlobalViewCollaboration />);
    
    const checkbox = screen.getByLabelText(/Avoir plus d'informations sur l'incident/i);
    fireEvent.click(checkbox);
    
    const submitButton = screen.getByText('Envoyer');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        "Succès",
        "La demande de collaboration a été envoyée !"
      );
    });
  });

  it('affiche les détails de l\'organisation', async () => {
    renderWithProviders(<GlobalViewCollaboration />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Org')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('affiche l\'image de l\'incident', async () => {
    renderWithProviders(<GlobalViewCollaboration />);
    
    await waitFor(() => {
      const image = screen.getByAltText('Incident');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test-image.jpg');
    });
  });

  it('gère les erreurs de création de collaboration', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to create'));
    renderWithProviders(<GlobalViewCollaboration />);
    
    const submitButton = screen.getByText('Envoyer');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur s'est produite lors de l'envoi de la demande de collaboration. Veuillez réessayer plus tard."
      );
    });
  });
}); 