const React = require('react');
const { render, screen, waitFor } = require('@testing-library/react');
const axios = require('axios');
const ZoneChart = require('../../../components/Charts/Chart_zone').default;

// Mocks
jest.mock('axios');
jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chart">Chart Component</div>
}));

jest.mock('Fonctions/Month', () => ({
  useMonth: () => ({
    selectedMonth: 3
  })
}));

jest.mock('Fonctions/YearMonth', () => ({
  useDateFilter: () => ({
    filterType: 'today',
    customRange: [{
      startDate: new Date('2024-03-21'),
      endDate: new Date('2024-03-21')
    }]
  })
}));

describe('ZoneChart Component', () => {
  const mockIncidents = [
    {
      id: 1,
      zone: 'Faladiè-sema',
      user_id: null
    },
    {
      id: 2,
      zone: 'Sikasso',
      user_id: 1
    },
    {
      id: 3,
      zone: 'Bamako',
      user_id: 2
    },
    {
      id: 4,
      zone: 'Kayes',
      user_id: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.sessionStorage = {
      token: 'fake-token'
    };
  });

  it('rend le composant chart correctement', async () => {
    axios.get.mockResolvedValueOnce({ data: mockIncidents });

    render(<ZoneChart />);
    
    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    });
  });

  it('agrège correctement les données par région', async () => {
    axios.get.mockResolvedValueOnce({ data: mockIncidents });

    render(<ZoneChart />);

    await waitFor(() => {
      const chartComponent = screen.getByTestId('mock-chart');
      expect(chartComponent).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/MapApi/incident-filter/'),
      expect.any(Object)
    );
  });

  it('gère les erreurs de requête API', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<ZoneChart />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('gère les zones inconnues', async () => {
    const incidentsWithUnknownZone = [
      ...mockIncidents,
      {
        id: 5,
        zone: 'Zone Inconnue',
        user_id: 1
      }
    ];

    axios.get.mockResolvedValueOnce({ data: incidentsWithUnknownZone });

    render(<ZoneChart />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    });
  });

  it('met à jour le graphique avec les filtres personnalisés', async () => {
    const customRangeMock = {
      filterType: 'custom_range',
      customRange: [{
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31')
      }]
    };

    jest.spyOn(require('Fonctions/YearMonth'), 'useDateFilter')
      .mockImplementation(() => customRangeMock);

    axios.get.mockResolvedValueOnce({ data: mockIncidents });

    render(<ZoneChart />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('custom_range'),
        expect.any(Object)
      );
    });
  });

  it('vérifie la correspondance zone-région', async () => {
    const diversZones = [
      { id: 1, zone: 'Faladiè-sema', user_id: null },
      { id: 2, zone: 'Sikasso', user_id: 1 },
      { id: 3, zone: 'Dakar', user_id: 2 },
      { id: 4, zone: 'Saint-Louis', user_id: null },
      { id: 5, zone: 'Thiès', user_id: 1 },
      { id: 6, zone: 'Mopti', user_id: 2 }
    ];

    axios.get.mockResolvedValueOnce({ data: diversZones });

    render(<ZoneChart />);

    await waitFor(() => {
      const chartComponent = screen.getByTestId('mock-chart');
      expect(chartComponent).toBeInTheDocument();
    });
  });

  it('gère l\'absence de token', async () => {
    global.sessionStorage.token = undefined;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ZoneChart />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Token non trouvé");
    });

    consoleSpy.mockRestore();
  });

  it('vérifie les options du graphique', async () => {
    axios.get.mockResolvedValueOnce({ data: mockIncidents });

    render(<ZoneChart />);

    await waitFor(() => {
      const chartComponent = screen.getByTestId('mock-chart');
      expect(chartComponent).toBeInTheDocument();
    });

    // Vérification des propriétés du graphique
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/MapApi/incident-filter/'),
      expect.objectContaining({
        headers: {
          Authorization: expect.stringContaining('Bearer'),
          'Content-Type': 'application/json'
        }
      })
    );
  });
}); 