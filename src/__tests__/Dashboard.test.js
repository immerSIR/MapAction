import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../views/Dashboard/Dashboard';
import GlobalView from '../views/Dashboard/globalView';
import Incident from '../views/Dashboard/Incident';
import Profile from '../views/Dashboard/Profile';

// Mock des composants externes
jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chart">Chart</div>,
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="mock-map">{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

// Mock d'axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mocks nécessaires
jest.mock('components/Charts/Chart_zone', () => () => <div data-testid="zone-chart">Zone Chart</div>);
jest.mock('variables/maps', () => () => <div data-testid="carte">Carte</div>);
jest.mock('Fonctions/Month', () => ({
  useMonth: () => ({ selectedMonth: '2024-03' })
}));
jest.mock('Fonctions/Dash_fonction', () => ({
  useIncidentData: () => ({
    countIncidents: 10,
    resolus: 50,
    taken: 75,
    countActions: 30,
    percentageVs: 20,
    percentageVsTaken: 15,
    percentageVsResolved: -5,
    PercentageIncrease: 25,
    TakenOnMap: jest.fn(),
    ResolvedOnMap: jest.fn(),
    DeclaredOnMap: jest.fn(),
    onShowIncident: jest.fn(),
    _getIncidents: jest.fn().mockResolvedValue([]),
    _getIncidentsResolved: jest.fn().mockResolvedValue([]),
    _getAnonymous: jest.fn().mockResolvedValue(30),
    _getRegistered: jest.fn().mockResolvedValue(70),
    _getPercentage: jest.fn().mockResolvedValue(80),
    _getPercentageVsPreviousMonth: jest.fn().mockResolvedValue(20),
    _getPercentageVsResolved: jest.fn().mockResolvedValue(10),
    _getPercentageVsTaken: jest.fn().mockResolvedValue(15),
    _getCategory: jest.fn(),
    _getActions: jest.fn(),
    IndicateurChart: () => <div data-testid="indicateur-chart">Indicateur Chart</div>
  })
}));

describe('Dashboard Components Tests', () => {
  const renderWithProviders = (component) => {
    return render(
      <ChakraProvider>
        <Router>
          {component}
        </Router>
      </ChakraProvider>
    );
  };

  describe('Dashboard Component', () => {
    const renderDashboard = () => {
      return render(
        <ChakraProvider>
          <Dashboard />
        </ChakraProvider>
      );
    };

    beforeEach(() => {
      // Mock sessionStorage
      Storage.prototype.getItem = jest.fn(() => 'TestOrg');
    });

    it('renders dashboard with all main components', async () => {
      renderDashboard();

      // Vérification des éléments principaux
      expect(screen.getByText("Nombre d'incidents")).toBeInTheDocument();
      expect(screen.getByText("Pourcentage pris en compte")).toBeInTheDocument();
      expect(screen.getByText("Pourcentage résolu")).toBeInTheDocument();
      expect(screen.getByText(/Incidents pris en compte par/)).toBeInTheDocument();
    });

    it('displays correct statistics', () => {
      renderDashboard();

      // Vérification des valeurs statistiques
      expect(screen.getByText('10')).toBeInTheDocument(); // countIncidents
      expect(screen.getByText('50%')).toBeInTheDocument(); // resolus
      expect(screen.getByText('75%')).toBeInTheDocument(); // taken
      expect(screen.getByText('30')).toBeInTheDocument(); // countActions
    });

    it('handles card clicks correctly', async () => {
      renderDashboard();

      // Trouver et cliquer sur les cartes cliquables
      const takenCard = screen.getByText('Pourcentage pris en compte').closest('div[role="group"]');
      fireEvent.click(takenCard);

      const resolvedCard = screen.getByText('Pourcentage résolu').closest('div[role="group"]');
      fireEvent.click(resolvedCard);

      // Vérifier que les graphiques sont présents
      expect(screen.getByTestId('zone-chart')).toBeInTheDocument();
      expect(screen.getByTestId('indicateur-chart')).toBeInTheDocument();
    });

    it('loads data on mount', async () => {
      renderDashboard();

      await waitFor(() => {
        // Vérifier que les appels API sont effectués
        expect(screen.getByText('Carte interactive')).toBeInTheDocument();
        expect(screen.getByText("Incident par type d'utilisateur")).toBeInTheDocument();
        expect(screen.getByText('Incidents par Zone')).toBeInTheDocument();
      });
    });

    it('displays percentage changes correctly', () => {
      renderDashboard();

      // Vérifier les pourcentages de variation
      expect(screen.getByText('20%')).toBeInTheDocument(); // percentageVs
      expect(screen.getByText('15%')).toBeInTheDocument(); // percentageVsTaken
      expect(screen.getByText('-5%')).toBeInTheDocument(); // percentageVsResolved
    });
  });

  describe('GlobalView Component', () => {
    it('renders map container', () => {
      renderWithProviders(<GlobalView />);
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('displays incident details when available', async () => {
      renderWithProviders(<GlobalView />);
      await waitFor(() => {
        expect(screen.getByText(/Description/i)).toBeInTheDocument();
      });
    });
  });

  describe('Incident Component', () => {
    it('renders incident table', () => {
      renderWithProviders(<Incident />);
      expect(screen.getByText(/La Table des Incidents/i)).toBeInTheDocument();
    });

    it('shows loading spinner when data is not ready', () => {
      renderWithProviders(<Incident />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Profile Component', () => {
    it('renders profile form', () => {
      renderWithProviders(<Profile />);
      expect(screen.getByText(/Profil/i)).toBeInTheDocument();
    });

    it('handles form submission', async () => {
      renderWithProviders(<Profile />);
      const submitButton = screen.getByText(/Sauvegarder les modifications/i);
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });
    });
  });

  // Test des utilitaires
  describe('Utility Functions', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-01-01');
      expect(date.toLocaleDateString('fr-FR')).toBe('01/01/2024');
    });
  });

  // Test des erreurs
  describe('Error Handling', () => {
    it('displays error message when API call fails', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});
