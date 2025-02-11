const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { BrowserRouter } = require('react-router-dom');

// Mock des dépendances problématiques
jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);
jest.mock('react-slick', () => (props) => <div>{props.children}</div>);
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div data-testid="map-container">Map Container</div>,
  TileLayer: () => null,
  Popup: () => null,
  Marker: () => null,
  Circle: () => null,
  useMap: () => ({ setView: jest.fn() })
}));

// Mock de la fonction IncidentData
jest.mock('Fonctions/Incident_fonction', () => ({
  IncidentData: () => ({
    latitude: 48.8566,
    longitude: 2.3522,
    imgUrl: 'test-image.jpg',
    date: '2024-03-21',
    heure: '14:30',
    incident: { title: 'Test Incident' },
    analysis: { 
      context: 'Test context',
      piste_solution: 'Test solution',
      impact_potentiel: 'Test impact'
    },
    type_incident: 'Test type',
    zone: 'Test zone',
    handleNavigateLLM: jest.fn(),
    sendPrediction: jest.fn()
  })
}));


const Analyze = require('../views/Dashboard/analyze').default;

describe('Analyze Component', () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <ChakraProvider>
          {component}
        </ChakraProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche les informations de l\'incident', async () => {
    renderWithProviders(<Analyze />);

    await waitFor(() => {
      expect(screen.getByText('Test Incident')).toBeInTheDocument();
      expect(screen.getByText('Test zone')).toBeInTheDocument();
      expect(screen.getByText('Test type')).toBeInTheDocument();
    });
  });

  it('affiche la carte avec les coordonnées correctes', async () => {
    renderWithProviders(<Analyze />);

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  it('affiche l\'image de l\'incident', async () => {
    renderWithProviders(<Analyze />);

    await waitFor(() => {
      const image = screen.getByAltText('Incident');
      expect(image).toBeInTheDocument();
      expect(image.src).toContain('test-image.jpg');
    });
  });

  it('affiche la date et l\'heure', async () => {
    renderWithProviders(<Analyze />);

    await waitFor(() => {
      expect(screen.getByText('Date : 2024-03-21')).toBeInTheDocument();
      expect(screen.getByText('Heure : 14:30')).toBeInTheDocument();
    });
  });

  it('affiche les analyses et solutions', async () => {
    renderWithProviders(<Analyze />);

    await waitFor(() => {
      expect(screen.getByText('Test context')).toBeInTheDocument();
      expect(screen.getByText('Test solution')).toBeInTheDocument();
      expect(screen.getByText('Test impact')).toBeInTheDocument();
    });
  });
});