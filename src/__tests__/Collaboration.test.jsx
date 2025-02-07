const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const Dashboard = require('../views/Dashboard/Collaboration').default;

// Mock des composants react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div data-testid="map-container">Map Container</div>,
  TileLayer: () => null,
  Popup: () => null,
  Marker: () => null,
  Circle: () => null,
  useMap: () => ({ setView: jest.fn() })
}));

// Mock de la fonction useIncidentData
jest.mock('Fonctions/Dash_fonction', () => ({
  useIncidentData: () => ({
    onShowIncidentCollaboration: jest.fn(),
    selectedMonth: '2024-03',
    percentageVs: 20,
    countTake: 10,
    _getIncidentsCollabor: jest.fn().mockResolvedValue([]),
    _getCollaboration: jest.fn().mockResolvedValue([]),
    collaboration: []
  })
}));

// Mock de variables/MapsCollabor
jest.mock('variables/MapsCollabor', () => {
  return function MockCarte() {
    return <div data-testid="mock-map">Carte</div>;
  };
});

describe('Collaboration Dashboard', () => {
  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les statistiques de collaboration', async () => {
    renderWithProvider(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pourcentage de collaboration/i)).toBeInTheDocument();
      expect(screen.getByText(/20%/)).toBeInTheDocument(); // percentageVs
    });
  });

  it('affiche la carte interactive', async () => {
    renderWithProvider(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Carte interactive')).toBeInTheDocument();
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });

  it('affiche le nombre d\'incidents pris en charge', async () => {
    renderWithProvider(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // countTake
    });
  });

  it('charge les données au montage du composant', async () => {
    const { _getIncidentsCollabor, _getCollaboration } = require('Fonctions/Dash_fonction').useIncidentData();

    renderWithProvider(<Dashboard />);

    await waitFor(() => {
      expect(_getIncidentsCollabor).toHaveBeenCalled();
      expect(_getCollaboration).toHaveBeenCalled();
    });
  });

  it('affiche correctement le texte descriptif', async () => {
    renderWithProvider(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Carte interactive avec les points reportés par les utilisateurs de l'application mobile/i)).toBeInTheDocument();
    });
  });
});