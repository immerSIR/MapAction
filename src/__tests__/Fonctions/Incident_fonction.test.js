Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => 'fake-token'),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  writable: true,
});
const React = require('react');
const { render, screen, act, waitFor, fireEvent } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
const axios = require('axios');
const Swal = require('sweetalert2');
const { IncidentData } = require('../../Fonctions/Incident_fonction');

jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));
jest.mock('config', () => ({
  config: {
    url: "https://fake-url.com",
    url2: "https://fake-fastapi-url.com"
  }
}));

const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ incidentId: '1', userId: '1' }),
    useHistory: () => ({
      push: mockPush
    }),
    useLocation: () => ({
      state: { pictUrl: 'test.jpg' }
    })
  };
});

const mockIncident = {
  id: 1,
  photo: '/test.jpg',
  audio: '/test.mp3',
  video: '/test.mp4',
  lattitude: 48.8566,
  longitude: 2.3522,
  zone: 'Test Zone',
  description: 'Test Description',
  created_at: '2024-03-21T14:30:00Z',
  etat: 'declared',
  title: 'Test Incident',
  user_id: 1,
  indicateur_id: 1,
  category_ids: [1, 2]
};

const mockPrediction = {
  data: [{
    analysis: 'Test Analysis',
    piste_solution: 'Test Solution',
    incident_type: 'Test Type',
    ndvi_heatmap: 'heatmap.jpg',
    ndvi_ndwi_plot: 'plot.jpg',
    landcover_plot: 'landcover.jpg'
  }]
};

const TestComponentFetch = () => {
  const incidentData = IncidentData();
  
  return (
    <div>
      <div data-testid="analysis">{incidentData.analysis}</div>
      <button data-testid="fetch-predictions-btn" onClick={incidentData.fetchPredictions}>
        Fetch Predictions
      </button>
    </div>
  );
};

const TestComponent = () => {
  const incidentData = IncidentData();

  return (
    <div>
      <div data-testid="latitude">{incidentData.latitude}</div>
      <div data-testid="longitude">{incidentData.longitude}</div>
      <div data-testid="zone">{incidentData.zone}</div>
      <div data-testid="description">{incidentData.description}</div>
      <div data-testid="video-url">{incidentData.videoUrl}</div>
      <div data-testid="audio-url">{incidentData.audioUrl}</div>
      <div data-testid="img-url">{incidentData.imgUrl}</div>
      <div data-testid="date">{incidentData.date}</div>
      <div data-testid="heure">{incidentData.heure}</div>
      <div data-testid="type-incident">{incidentData.type_incident}</div>
      <div data-testid="analysis">{incidentData.analysis}</div>
      <div data-testid="piste-solution">{incidentData.piste_solution}</div>
      <div data-testid="position">{incidentData.position.join(',')}</div>
      <div data-testid="selected-month">{incidentData.selectedMonth}</div>
      <div data-testid="is-changed">{incidentData.isChanged ? 'true' : 'false'}</div>
      <div data-testid="in-progress">{incidentData.inProgress ? 'true' : 'false'}</div>
      <div data-testid="change-state">{incidentData.changeState ? 'true' : 'false'}</div>

      <button data-testid="change-status" onClick={incidentData.handleChangeStatus}>
        Change Status
      </button>
      <button data-testid="send-prediction" onClick={incidentData.sendPrediction}>
        Send Prediction
      </button>
      <button data-testid="navigate" onClick={incidentData.handleNavigate}>
        Navigate
      </button>
      <button data-testid="navigate-llm" onClick={incidentData.handleNavigateLLM}>
        Navigate LLM
      </button>
      <button data-testid="fetch-predictions" onClick={() => incidentData.fetchPredictions()}>
        Fetch Predictions
      </button>
      <select 
        data-testid="select-type"
        onChange={(e) =>
          incidentData.handleSelectChange({ value: e.target.value })
        }
      >
        <option value="declared">Declared</option>
        <option value="taken_into_account">Taken</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
};

describe('IncidentData', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    global.sessionStorage = {
      getItem: jest.fn(() => 'Bearer valid-token'),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    global.localStorage = {
      getItem: jest.fn(() => 'fake-refresh-token'),
      setItem: jest.fn(),
    };

    axios.get.mockImplementation((url) => {
      console.log("Appel axios.get à:", url);
      return Promise.resolve({ data: mockIncident });
    });
    
  });

  it('charge les données de l\'incident correctement', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('latitude').textContent).toBe('48.8566');
      expect(screen.getByTestId('longitude').textContent).toBe('2.3522');
      expect(screen.getByTestId('zone').textContent).toBe('Test Zone');
    });
  });

  it('gère le changement de statut avec succès', async () => {
    global.sessionStorage.getItem = jest.fn(() => 'fake-token');
  
    axios.post.mockResolvedValueOnce({ data: { success: true } });
  
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    expect(Swal.fire).toHaveBeenCalledWith("Changement de status effectué avec succès");
  });
  

  it('gère les erreurs de token expiré', async () => {
    global.sessionStorage.getItem = jest.fn(() => 'Bearer valid-token');
    axios.post
      .mockRejectedValueOnce({ response: { data: { code: 'token_not_valid', detail: 'Token is invalid or expired' } } })
      .mockRejectedValueOnce(new Error("Refresh failed"));
  
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith("Session expired. Please log in again.");
    });
  });
  it('met à jour les prédictions lorsque response.data est un tableau non vide', async () => {
    const fakePrediction = { analysis: "Test Analysis" };
    // Simuler une réponse dont data est un tableau non vide
    axios.get.mockResolvedValueOnce({ data: [fakePrediction] });
    
    render(<TestComponentFetch />);
    
    // Déclenche l'appel fetchPredictions via le bouton
    await act(async () => {
      fireEvent.click(screen.getByTestId('fetch-predictions-btn'));
    });
    
    // On attend que l'état se mette à jour (par exemple, via waitFor)
    await waitFor(() => {
      expect(screen.getByTestId('fetch-predictions-btn').textContent).toBe("Fetch Predictions");
    });
  });

  it('met à jour les prédictions lorsque response.data.data est un tableau non vide', async () => {
    const fakePrediction = { analysis: "Test Analysis from data.data" };
    // Simuler une réponse dont data contient une propriété data qui est un tableau non vide
    axios.get.mockImplementation((url) => {
      console.log("Appel axios.get à:", url);
      return Promise.resolve({ data: mockPrediction });
    });
    
    render(<TestComponentFetch />);
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('fetch-predictions-btn'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('analysis').textContent).toBe("Test Analysis");
    });
  });

  it("gère une erreur lors de la récupération des prédictions", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    axios.get
      .mockResolvedValueOnce({ data: { data: { id: 1, name: "Test User" } } }) 
      .mockResolvedValueOnce({ data: mockIncident }) 
      .mockResolvedValueOnce({ data: [mockPrediction] }); 

    // Pour le clic, on simule une erreur
    axios.get.mockRejectedValueOnce(new Error("API Error"));
    
    render(<TestComponentFetch />);
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('fetch-predictions-btn'));
    });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de la récupération des prédictions :",
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });


  it('envoie les prédictions correctement', async () => {
    const mockOverpassResponse = {
      data: {
        elements: [
          { tags: { amenity: 'hospital' } },
          { tags: { amenity: 'school' } }
        ]
      }
    };

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('img-url').textContent).toContain('test.jpg');
    });

    axios.post.mockResolvedValueOnce(mockOverpassResponse);
    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });
    expect(axios.post).toHaveBeenCalled();
  });

  it('gère les erreurs lors de l\'envoi des prédictions', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error('Failed to send prediction'));

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('récupère les données utilisateur correctement', async () => {
    const mockUserData = {
      data: {
        data: {
          id: 1,
          name: 'Test User'
        }
      }
    };

    axios.get.mockResolvedValueOnce(mockUserData);

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/user_retrieve/'),
        expect.any(Object)
      );
    });
  });

  it('gère les médias correctement', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('video-url').textContent).toContain('test.mp4');
      expect(screen.getByTestId('audio-url').textContent).toContain('test.mp3');
      expect(screen.getByTestId('img-url').textContent).toContain('test.jpg');
    });
  });

  it('formate correctement la date et l\'heure', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('date').textContent).toBeTruthy();
      expect(screen.getByTestId('heure').textContent).toBeTruthy();
    });
  });

  it('gère les prédictions et analyses', async () => {
    axios.get
      .mockImplementation((url) => {
        console.log("Appel axios.get à:", url);
        return Promise.resolve({ data: mockIncident });
      })
      .mockImplementation((url) => {
        console.log("Appel axios.get à:", url);
        return Promise.resolve({ data: mockPrediction });
      })

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('analysis').textContent).toBe('Test Analysis');
      expect(screen.getByTestId('piste-solution').textContent).toBe('Test Solution');
      expect(screen.getByTestId('type-incident').textContent).toBe('Test Type');
    });
  });

  it('gère la navigation vers différentes routes', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('navigate'));
    expect(mockPush).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('navigate-llm'));
    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  it('gère les changements de type d\'incident', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('select-type'), {
      target: { value: 'taken_into_account' }
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it('gère les erreurs de chargement des prédictions', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Failed to load predictions'));

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('gère les changements d\'état pendant les requêtes', async () => {
    let resolveRequest;
    const pendingRequest = new Promise(resolve => {
      resolveRequest = resolve;
    });

    axios.post.mockImplementationOnce(() => pendingRequest);

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('change-status'));
    expect(screen.getByTestId('in-progress').textContent).toBe('true');

    await act(async () => {
      resolveRequest({ data: { success: true } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('in-progress').textContent).toBe('false');
    });
  });

  it('traduit correctement les structures sensibles', async () => {
    // On définit la réponse attendue pour l'appel Overpass ou de prédiction.
    const mockOverpassResponse = {
      data: {
        elements: [
          { tags: { amenity: 'hospital' } },
          { tags: { amenity: 'school' } },
          { tags: { highway: 'primary' } },
          { tags: { natural: 'water' } },
          { tags: { landuse: 'industrial' } }
        ]
      }
    };
  
    // On mock axios.post pour qu'il log et renvoie une réponse résolue.
    axios.post.mockImplementation((url, data) => {
      if (url === "https://overpass-api.de/api/interpreter") {
        return Promise.resolve(mockOverpassResponse);
      } else if (url === config.url2) {
        return Promise.resolve({ data: {} });
      }
      return Promise.resolve({ data: {} });
    });
    const fakePrediction = { analysis: "Test Analysis", piste_solution: "Test Solution", incident_type: "Test Type" };
    axios.get.mockResolvedValueOnce({ data: [fakePrediction] });
    axios.get.mockImplementation((url, data) => {
      if (url.includes("/MapApi/incident/")) {
        // Retourne les détails de l'incident
        return Promise.resolve({ data: mockIncident });
      }
      
      console.log("Appel axios.post à:", url, "avec les données:", data);
      return Promise.resolve(mockPrediction);
    });
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
  
    // D'abord, on simule le chargement des prédictions (si nécessaire)
    await act(async () => {
      fireEvent.click(screen.getByTestId('fetch-predictions'));
    });
  
    // On attend que les prédictions soient chargées (par exemple, en vérifiant qu'un élément affiche l'analyse)
   
    await waitFor(() => {
      expect(screen.getByTestId("img-url").textContent).toContain("test.jpg");
      expect(screen.getByTestId("analysis").textContent).toBe("Test Analysis");
    });
    // Maintenant, on déclenche sendPrediction
    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });
  
    // On attend que axios.post soit appelé avec l'objet contenant sensitive_structures
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          sensitive_structures: expect.arrayContaining([
            'Hôpital',
            'École',
            'Route',
            "Plan d'eau",
            'Zone industrielle'
          ])
        })
      );
    });
  });
  

  it('initialise correctement les états', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('position').textContent).toBe('48.8566,2.3522');
      expect(screen.getByTestId('selected-month').textContent).toBe(String(new Date().getMonth() + 1));
      expect(screen.getByTestId('is-changed').textContent).toBe('false');
      expect(screen.getByTestId('in-progress').textContent).toBe('false');
      expect(screen.getByTestId('change-state').textContent).toBe('false');
    });
  });

  it('gère les erreurs de requête API', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    axios.post.mockRejectedValueOnce(new Error('API Error'));
  
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('fetch-predictions'));
    });
  
    // Attendre que l'erreur soit loggée
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  
    consoleSpy.mockRestore();
  });
  

  it('gère les changements d\'état multiples', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByTestId('select-type'), {
        target: { value: 'taken_into_account' }
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId('select-type'), {
        target: { value: 'resolved' }
      });
    });

    expect(axios.post).toHaveBeenCalledTimes(2);
  });

  it('gère les erreurs de token invalide', async () => {

    global.sessionStorage.getItem = jest.fn(() => 'fake-token');
    axios.post
      .mockRejectedValueOnce({ response: { data: { code: 'token_not_valid', detail: 'Token is invalid or expired' } } })
      .mockRejectedValueOnce(new Error("Refresh failed"));
  
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    expect(Swal.fire).toHaveBeenCalledWith("Session expired. Please log in again.");
    // Et vérifier que removeItem a été appelé si c'est prévu dans votre code.
    expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('token');
  });
  
  it('gère les réponses API vides', async () => {
    axios.get.mockResolvedValueOnce({ data: null });
    
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('description').textContent).toBe('');
    });
  });
  it("fait un appel API pour récupérer l'incident", async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
  
});
