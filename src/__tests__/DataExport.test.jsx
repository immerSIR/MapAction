const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const DataExport = require('../views/Dashboard/DataExport').default;
const axios = require('axios');

jest.mock('axios');

// Mock de sessionStorage
const mockSessionStorage = {
  token: 'fake-token'
};

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(key => mockSessionStorage[key]),
    setItem: jest.fn()
  }
});

describe('DataExport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de la création d'URL pour le téléchargement
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
  });

  const renderWithProvider = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('affiche le formulaire d\'export', () => {
    renderWithProvider(<DataExport />);

    expect(screen.getByText('Exportation des données')).toBeInTheDocument();
    expect(screen.getByText('Par Jour')).toBeInTheDocument();
    expect(screen.getByText('Par Mois')).toBeInTheDocument();
  });

  it('permet de changer entre export par jour et par mois', () => {
    renderWithProvider(<DataExport />);

    const monthRadio = screen.getByLabelText('Par Mois');
    fireEvent.click(monthRadio);

    expect(screen.getByLabelText('Sélectionnez un Mois:')).toBeInTheDocument();

    const dayRadio = screen.getByLabelText('Par Jour');
    fireEvent.click(dayRadio);

    expect(screen.getByLabelText('Sélectionnez une Date:')).toBeInTheDocument();
  });

  it('exporte les données par jour', async () => {
    const mockData = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ];

    axios.get.mockResolvedValueOnce({ data: mockData });

    renderWithProvider(<DataExport />);

    const exportButton = screen.getByText('Exporter les Données');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/incident-filter/'),
        expect.any(Object)
      );
    });
  });

  it('exporte les données par mois', async () => {
    const mockData = {
      data: [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' }
      ]
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

    renderWithProvider(<DataExport />);

    const monthRadio = screen.getByLabelText('Par Mois');
    fireEvent.click(monthRadio);

    const exportButton = screen.getByText('Exporter les Données');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/incidentByMonth/'),
        expect.any(Object)
      );
    });
  });

  it('gère les erreurs d\'export', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Export failed'));

    renderWithProvider(<DataExport />);

    const exportButton = screen.getByText('Exporter les Données');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
}); 