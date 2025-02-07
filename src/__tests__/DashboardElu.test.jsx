const React = require('react');
const { render, screen, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const EluDashboard = require('../views/Dashboard/DashboardElu').default;

// Mock de useMonth
jest.mock('Fonctions/Month', () => ({
  useMonth: () => ({
    selectedMonth: '2024-03',
    handleMonthChange: jest.fn()
  })
}));

// Mock des dépendances
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div data-testid="map-container">Map Container</div>,
  TileLayer: () => null,
  Popup: () => null,
  Marker: () => null,
  Circle: () => null,
  useMap: () => ({ setView: jest.fn() })
}));

// Mock de useIncidentData avec toutes les propriétés nécessaires
jest.mock('Fonctions/Dash_fonction', () => ({
  useIncidentData: () => ({
    onShowIncident: jest.fn(),
    countIncidents: 100,
    taken: 75,
    resolus: 50,
    countActions: 25,
    percentageVs: 10,
    percentageVsTaken: 15,
    percentageVsResolved: -5,
    PercentageIncrease: 20,
    _getIncidents: jest.fn().mockResolvedValue(),
    _getIncidentsResolved: jest.fn().mockResolvedValue(),
    _getAnonymous: jest.fn().mockResolvedValue(),
    _getRegistered: jest.fn().mockResolvedValue(),
    _getPercentage: jest.fn().mockResolvedValue(),
    _getPercentageVsPreviousMonth: jest.fn().mockResolvedValue(),
    _getPercentageVsResolved: jest.fn().mockResolvedValue(),
    _getPercentageVsTaken: jest.fn().mockResolvedValue(),
    _getCategory: jest.fn().mockResolvedValue(),
    _getActions: jest.fn().mockResolvedValue(),
    IndicateurChart: () => <div data-testid="indicateur-chart">Indicateur Chart</div>,
    TakenOnMap: jest.fn(),
    DeclaredOnMap: jest.fn(),
    ResolvedOnMap: jest.fn()
  })
}));

// Mock de ZoneChart
jest.mock('components/Charts/Chart_zone', () => {
  return function MockZoneChart() {
    return <div data-testid="zone-chart">Zone Chart</div>;
  };
});

// Mock de Carte
jest.mock('variables/maps', () => {
  return function MockCarte() {
    return <div data-testid="carte">Carte</div>;
  };
});

// Mock de sessionStorage
const mockSessionStorage = {
  organisation: 'Test Organisation',
  token: 'fake-token'
};

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(key => mockSessionStorage[key]),
    setItem: jest.fn()
  }
});

describe('EluDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('affiche les statistiques principales', async () => {
    renderWithProvider(<EluDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Nombre d'incidents")).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  it('affiche les pourcentages de variation', async () => {
    renderWithProvider(<EluDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/10%/)).toBeInTheDocument();
      expect(screen.getByText(/15%/)).toBeInTheDocument();
      expect(screen.getByText(/-5%/)).toBeInTheDocument();
      expect(screen.getByText(/20%/)).toBeInTheDocument();
    });
  });

  it('affiche la carte et les graphiques', async () => {
    renderWithProvider(<EluDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('carte')).toBeInTheDocument();
      expect(screen.getByTestId('indicateur-chart')).toBeInTheDocument();
      expect(screen.getByTestId('zone-chart')).toBeInTheDocument();
    });
  });

  it('appelle les fonctions de chargement au montage', async () => {
    const { _getIncidents, _getIncidentsResolved } = require('Fonctions/Dash_fonction').useIncidentData();
    
    renderWithProvider(<EluDashboard />);

    await waitFor(() => {
      expect(_getIncidents).toHaveBeenCalled();
      expect(_getIncidentsResolved).toHaveBeenCalled();
    });
  });
}); 