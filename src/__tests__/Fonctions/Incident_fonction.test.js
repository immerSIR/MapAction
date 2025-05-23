// Object.defineProperty(window, 'sessionStorage', {
//   value: {
//     getItem: jest.fn(() => 'fake-token'),
//     setItem: jest.fn(),
//     removeItem: jest.fn()
//   },
//   writable: true,
// });
// const React = require('react');
// const { render, screen, act, waitFor, fireEvent } = require('@testing-library/react');
// const { MemoryRouter } = require('react-router-dom');
// const axios = require('axios');
// const Swal = require('sweetalert2');
// const { IncidentData } = require('../../Fonctions/Incident_fonction');

// jest.mock('axios');
// jest.mock('sweetalert2', () => ({
//   fire: jest.fn().mockResolvedValue({ isConfirmed: true })
// }));
// jest.mock('config', () => ({
//   config: {
//     url: "https://fake-url.com",
//     url2: "https://fake-fastapi-url.com"
//   }
// }));

// const mockPush = jest.fn();
// jest.mock('react-router-dom', () => {
//   const actual = jest.requireActual('react-router-dom');
//   return {
//     ...actual,
//     useParams: () => ({ incidentId: '1', userId: '1' }),
//     useHistory: () => ({
//       push: mockPush
//     }),
//     useLocation: () => ({
//       state: { pictUrl: 'test.jpg' }
//     })
//   };
// });

// const mockIncident = {
//   id: 1,
//   photo: '/test.jpg',
//   audio: '/test.mp3',
//   video: '/test.mp4',
//   lattitude: 48.8566,
//   longitude: 2.3522,
//   zone: 'Test Zone',
//   description: 'Test Description',
//   created_at: '2024-03-21T14:30:00Z',
//   etat: 'declared',
//   title: 'Test Incident',
//   user_id: 1,
//   indicateur_id: 1,
//   category_ids: [1, 2]
// };

// const mockPrediction = {
//   data: [{
//     analysis: 'Test Analysis',
//     piste_solution: 'Test Solution',
//     incident_type: 'Test Type',
//     ndvi_heatmap: 'heatmap.jpg',
//     ndvi_ndwi_plot: 'plot.jpg',
//     landcover_plot: 'landcover.jpg'
//   }]
// };

// const TestComponentFetch = () => {
//   const incidentData = IncidentData();
  
//   return (
//     <div>
//       <div data-testid="analysis">{incidentData.analysis}</div>
//       <button data-testid="fetch-predictions-btn" onClick={incidentData.fetchPredictions}>
//         Fetch Predictions
//       </button>
//     </div>
//   );
// };

// const TestComponent = () => {
//   const incidentData = IncidentData();

//   return (
//     <div>
//       <div data-testid="latitude">{incidentData.latitude}</div>
//       <div data-testid="longitude">{incidentData.longitude}</div>
//       <div data-testid="zone">{incidentData.zone}</div>
//       <div data-testid="description">{incidentData.description}</div>
//       <div data-testid="video-url">{incidentData.videoUrl}</div>
//       <div data-testid="audio-url">{incidentData.audioUrl}</div>
//       <div data-testid="img-url">{incidentData.imgUrl}</div>
//       <div data-testid="date">{incidentData.date}</div>
//       <div data-testid="heure">{incidentData.heure}</div>
//       <div data-testid="type-incident">{incidentData.type_incident}</div>
//       <div data-testid="analysis">{incidentData.analysis}</div>
//       <div data-testid="piste-solution">{incidentData.piste_solution}</div>
//       <div data-testid="position">{incidentData.position.join(',')}</div>
//       <div data-testid="selected-month">{incidentData.selectedMonth}</div>
//       <div data-testid="is-changed">{incidentData.isChanged ? 'true' : 'false'}</div>
//       <div data-testid="in-progress">{incidentData.inProgress ? 'true' : 'false'}</div>
//       <div data-testid="change-state">{incidentData.changeState ? 'true' : 'false'}</div>

//       <button data-testid="change-status" onClick={incidentData.handleChangeStatus}>
//         Change Status
//       </button>
//       <button data-testid="send-prediction" onClick={incidentData.sendPrediction}>
//         Send Prediction
//       </button>
//       <button data-testid="navigate" onClick={incidentData.handleNavigate}>
//         Navigate
//       </button>
//       <button data-testid="navigate-llm" onClick={incidentData.handleNavigateLLM}>
//         Navigate LLM
//       </button>
//       <button data-testid="fetch-predictions" onClick={() => incidentData.fetchPredictions()}>
//         Fetch Predictions
//       </button>
//       <select 
//         data-testid="select-type"
//         onChange={(e) =>
//           incidentData.handleSelectChange({ value: e.target.value })
//         }
//       >
//         <option value="declared">Declared</option>
//         <option value="taken_into_account">Taken</option>
//         <option value="resolved">Resolved</option>
//       </select>
//     </div>
//   );
// };

// describe('IncidentData', () => {

//   beforeEach(() => {
//     jest.clearAllMocks();
//     global.sessionStorage = {
//       getItem: jest.fn(() => 'Bearer valid-token'),
//       setItem: jest.fn(),
//       removeItem: jest.fn()
//     };
//     global.localStorage = {
//       getItem: jest.fn(() => 'fake-refresh-token'),
//       setItem: jest.fn(),
//     };

//     axios.get.mockImplementation((url) => {
//       console.log("Appel axios.get à:", url);
//       return Promise.resolve({ data: mockIncident });
//     });
    
//   });

//   it('charge les données de l\'incident correctement', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('latitude').textContent).toBe('48.8566');
//       expect(screen.getByTestId('longitude').textContent).toBe('2.3522');
//       expect(screen.getByTestId('zone').textContent).toBe('Test Zone');
//     });
//   });

//   it('gère le changement de statut avec succès', async () => {
//     global.sessionStorage.getItem = jest.fn(() => 'fake-token');
  
//     axios.post.mockResolvedValueOnce({ data: { success: true } });
  
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );
  
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('change-status'));
//     });

//     expect(Swal.fire).toHaveBeenCalledWith("Changement de status effectué avec succès");
//   });
  

//   it('gère les erreurs de token expiré', async () => {
//     global.sessionStorage.getItem = jest.fn(() => 'Bearer valid-token');
//     axios.post
//       .mockRejectedValueOnce({ response: { data: { code: 'token_not_valid', detail: 'Token is invalid or expired' } } })
//       .mockRejectedValueOnce(new Error("Refresh failed"));
  
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );
  
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('change-status'));
//     });
  
//     await waitFor(() => {
//       expect(Swal.fire).toHaveBeenCalledWith("Session expired. Please log in again.");
//     });
//   });
//   it('met à jour les prédictions lorsque response.data est un tableau non vide', async () => {
//     const fakePrediction = { analysis: "Test Analysis" };
//     // Simuler une réponse dont data est un tableau non vide
//     axios.get.mockResolvedValueOnce({ data: [fakePrediction] });
    
//     render(<TestComponentFetch />);
    
//     // Déclenche l'appel fetchPredictions via le bouton
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('fetch-predictions-btn'));
//     });
    
//     // On attend que l'état se mette à jour (par exemple, via waitFor)
//     await waitFor(() => {
//       expect(screen.getByTestId('fetch-predictions-btn').textContent).toBe("Fetch Predictions");
//     });
//   });

//   it('met à jour les prédictions lorsque response.data.data est un tableau non vide', async () => {
//     const fakePrediction = { analysis: "Test Analysis from data.data" };
//     // Simuler une réponse dont data contient une propriété data qui est un tableau non vide
//     axios.get.mockImplementation((url) => {
//       console.log("Appel axios.get à:", url);
//       return Promise.resolve({ data: mockPrediction });
//     });
    
//     render(<TestComponentFetch />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('fetch-predictions-btn'));
//     });
    
//     await waitFor(() => {
//       expect(screen.getByTestId('analysis').textContent).toBe("Test Analysis");
//     });
//   });

//   it("gère une erreur lors de la récupération des prédictions", async () => {
//     const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

//     axios.get
//       .mockResolvedValueOnce({ data: { data: { id: 1, name: "Test User" } } }) 
//       .mockResolvedValueOnce({ data: mockIncident }) 
//       .mockResolvedValueOnce({ data: [mockPrediction] }); 

//     // Pour le clic, on simule une erreur
//     axios.get.mockRejectedValueOnce(new Error("API Error"));
    
//     render(<TestComponentFetch />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('fetch-predictions-btn'));
//     });
    
//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalledWith(
//         "Erreur lors de la récupération des prédictions :",
//         expect.any(Error)
//       );
//     });
//     consoleSpy.mockRestore();
//   });


//   it('envoie les prédictions correctement', async () => {
//     const mockOverpassResponse = {
//       data: {
//         elements: [
//           { tags: { amenity: 'hospital' } },
//           { tags: { amenity: 'school' } }
//         ]
//       }
//     };

//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('img-url').textContent).toContain('test.jpg');
//     });

//     axios.post.mockResolvedValueOnce(mockOverpassResponse);
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('send-prediction'));
//     });
//     expect(axios.post).toHaveBeenCalled();
//   });

//   it('gère les erreurs lors de l\'envoi des prédictions', async () => {
//     const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//     axios.post.mockRejectedValueOnce(new Error('Failed to send prediction'));

//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await act(async () => {
//       fireEvent.click(screen.getByTestId('send-prediction'));
//     });

//     expect(consoleSpy).toHaveBeenCalled();
//     consoleSpy.mockRestore();
//   });

//   it('récupère les données utilisateur correctement', async () => {
//     const mockUserData = {
//       data: {
//         data: {
//           id: 1,
//           name: 'Test User'
//         }
//       }
//     };

//     axios.get.mockResolvedValueOnce(mockUserData);

//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(axios.get).toHaveBeenCalledWith(
//         expect.stringContaining('/MapApi/user_retrieve/'),
//         expect.any(Object)
//       );
//     });
//   });

//   it('gère les médias correctement', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('video-url').textContent).toContain('test.mp4');
//       expect(screen.getByTestId('audio-url').textContent).toContain('test.mp3');
//       expect(screen.getByTestId('img-url').textContent).toContain('test.jpg');
//     });
//   });

//   it('formate correctement la date et l\'heure', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('date').textContent).toBeTruthy();
//       expect(screen.getByTestId('heure').textContent).toBeTruthy();
//     });
//   });

//   it('gère les prédictions et analyses', async () => {
//     axios.get
//       .mockImplementation((url) => {
//         console.log("Appel axios.get à:", url);
//         return Promise.resolve({ data: mockIncident });
//       })
//       .mockImplementation((url) => {
//         console.log("Appel axios.get à:", url);
//         return Promise.resolve({ data: mockPrediction });
//       })

//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('analysis').textContent).toBe('Test Analysis');
//       expect(screen.getByTestId('piste-solution').textContent).toBe('Test Solution');
//       expect(screen.getByTestId('type-incident').textContent).toBe('Test Type');
//     });
//   });

//   it('gère la navigation vers différentes routes', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByTestId('navigate'));
//     expect(mockPush).toHaveBeenCalled();

//     fireEvent.click(screen.getByTestId('navigate-llm'));
//     expect(mockPush).toHaveBeenCalledTimes(2);
//   });

//   it('gère les changements de type d\'incident', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     fireEvent.change(screen.getByTestId('select-type'), {
//       target: { value: 'taken_into_account' }
//     });

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalled();
//     });
//   });

//   it('gère les erreurs de chargement des prédictions', async () => {
//     const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//     axios.get.mockRejectedValueOnce(new Error('Failed to load predictions'));

//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalled();
//     });

//     consoleSpy.mockRestore();
//   });

//   it('gère les changements d\'état pendant les requêtes', async () => {
//     let resolveRequest;
//     const pendingRequest = new Promise(resolve => {
//       resolveRequest = resolve;
//     });

//     axios.post.mockImplementationOnce(() => pendingRequest);

//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByTestId('change-status'));
//     expect(screen.getByTestId('in-progress').textContent).toBe('true');

//     await act(async () => {
//       resolveRequest({ data: { success: true } });
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId('in-progress').textContent).toBe('false');
//     });
//   });

//   it('traduit correctement les structures sensibles', async () => {
//     // On définit la réponse attendue pour l'appel Overpass ou de prédiction.
//     const mockOverpassResponse = {
//       data: {
//         elements: [
//           { tags: { amenity: 'hospital' } },
//           { tags: { amenity: 'school' } },
//           { tags: { highway: 'primary' } },
//           { tags: { natural: 'water' } },
//           { tags: { landuse: 'industrial' } }
//         ]
//       }
//     };
  
//     // On mock axios.post pour qu'il log et renvoie une réponse résolue.
//     axios.post.mockImplementation((url, data) => {
//       if (url === "https://overpass-api.de/api/interpreter") {
//         return Promise.resolve(mockOverpassResponse);
//       } else if (url === config.url2) {
//         return Promise.resolve({ data: {} });
//       }
//       return Promise.resolve({ data: {} });
//     });
//     const fakePrediction = { analysis: "Test Analysis", piste_solution: "Test Solution", incident_type: "Test Type" };
//     axios.get.mockResolvedValueOnce({ data: [fakePrediction] });
//     axios.get.mockImplementation((url, data) => {
//       if (url.includes("/MapApi/incident/")) {
//         // Retourne les détails de l'incident
//         return Promise.resolve({ data: mockIncident });
//       }
      
//       console.log("Appel axios.post à:", url, "avec les données:", data);
//       return Promise.resolve(mockPrediction);
//     });
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );
  
//     // D'abord, on simule le chargement des prédictions (si nécessaire)
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('fetch-predictions'));
//     });
  
//     // On attend que les prédictions soient chargées (par exemple, en vérifiant qu'un élément affiche l'analyse)
   
//     await waitFor(() => {
//       expect(screen.getByTestId("img-url").textContent).toContain("test.jpg");
//       expect(screen.getByTestId("analysis").textContent).toBe("Test Analysis");
//     });
//     // Maintenant, on déclenche sendPrediction
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('send-prediction'));
//     });
  
//     // On attend que axios.post soit appelé avec l'objet contenant sensitive_structures
//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(
//         expect.any(String),
//         expect.objectContaining({
//           sensitive_structures: expect.arrayContaining([
//             'Hôpital',
//             'École',
//             'Route',
//             "Plan d'eau",
//             'Zone industrielle'
//           ])
//         })
//       );
//     });
//   });
  

//   it('initialise correctement les états', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('position').textContent).toBe('48.8566,2.3522');
//       expect(screen.getByTestId('selected-month').textContent).toBe(String(new Date().getMonth() + 1));
//       expect(screen.getByTestId('is-changed').textContent).toBe('false');
//       expect(screen.getByTestId('in-progress').textContent).toBe('false');
//       expect(screen.getByTestId('change-state').textContent).toBe('false');
//     });
//   });

//   it('gère les erreurs de requête API', async () => {
//     const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
//     axios.get.mockRejectedValueOnce(new Error('API Error'));
//     axios.post.mockRejectedValueOnce(new Error('API Error'));
  
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );
  
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('fetch-predictions'));
//     });
  
//     // Attendre que l'erreur soit loggée
//     await waitFor(() => {
//       expect(console.error).toHaveBeenCalled();
//     });
  
//     consoleSpy.mockRestore();
//   });
  

//   it('gère les changements d\'état multiples', async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await act(async () => {
//       fireEvent.change(screen.getByTestId('select-type'), {
//         target: { value: 'taken_into_account' }
//       });
//     });

//     await act(async () => {
//       fireEvent.change(screen.getByTestId('select-type'), {
//         target: { value: 'resolved' }
//       });
//     });

//     expect(axios.post).toHaveBeenCalledTimes(2);
//   });

//   it('gère les erreurs de token invalide', async () => {

//     global.sessionStorage.getItem = jest.fn(() => 'fake-token');
//     axios.post
//       .mockRejectedValueOnce({ response: { data: { code: 'token_not_valid', detail: 'Token is invalid or expired' } } })
//       .mockRejectedValueOnce(new Error("Refresh failed"));
  
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );
  
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('change-status'));
//     });

//     expect(Swal.fire).toHaveBeenCalledWith("Session expired. Please log in again.");
//     // Et vérifier que removeItem a été appelé si c'est prévu dans votre code.
//     expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('token');
//   });
  
//   it('gère les réponses API vides', async () => {
//     axios.get.mockResolvedValueOnce({ data: null });
    
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );

//     await waitFor(() => {
//       expect(screen.getByTestId('description').textContent).toBe('');
//     });
//   });
//   it("fait un appel API pour récupérer l'incident", async () => {
//     render(
//       <MemoryRouter>
//         <TestComponent />
//       </MemoryRouter>
//     );
  
//     await waitFor(() => {
//       expect(axios.get).toHaveBeenCalled();
//     });
//   });
  
// });

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
const { IncidentData } = require('../../Fonctions/Incident_fonction'); // Ajuster le chemin
const { config } = require('config'); // Assurer que le mock de config est bien importé

// --- Mocks --- 

jest.mock('axios');
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

// Mock config (déjà fait dans le fichier original, mais on le garde ici pour clarté)
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
    useParams: () => ({ incidentId: '1', userId: '1' }), // Utiliser des IDs constants pour les tests
    useHistory: () => ({
      push: mockPush
    }),
    useLocation: () => ({
      state: { pictUrl: 'test.jpg' } // Simuler un état de location si nécessaire
    })
  };
});

// --- Données Mock --- 

const mockIncidentBase = {
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

const mockPredictionBase = {
    analysis: 'Test Analysis',
    piste_solution: 'Test Solution',
    incident_type: 'Test Type',
    ndvi_heatmap: 'heatmap.jpg',
    ndvi_ndwi_plot: 'plot.jpg',
    landcover_plot: 'landcover.jpg'
};

const mockUserDataBase = {
    id: 1,
    name: 'Test User'
};

const mockOverpassResponseBase = {
    data: {
      elements: [
        { tags: { amenity: 'hospital' } },
        { tags: { amenity: 'school' } },
        { tags: { highway: 'primary' } },
        { tags: { natural: 'water' } },
        { tags: { landuse: 'industrial' } },
        { tags: { amenity: 'unknown_amenity' } }, // Structure inconnue
        { tags: { leisure: 'park' } } // Autre structure connue
      ]
    }
};

// --- Helper Component --- 

// Helper pour rendre le hook dans un composant de test
const TestHookWrapper = ({ hook }) => {
  const data = hook();
  return <div data-testid="hook-output">{JSON.stringify(data)}</div>;
};

// Composant de test principal pour les interactions
const TestComponent = () => {
  const incidentData = IncidentData();

  return (
    <div>
      {/* Afficher les états clés pour les assertions */}
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
      <div data-testid="position">{incidentData.position ? incidentData.position.join(',') : ''}</div>
      <div data-testid="selected-month">{incidentData.selectedMonth}</div>
      <div data-testid="is-changed">{incidentData.isChanged ? 'true' : 'false'}</div>
      <div data-testid="in-progress">{incidentData.inProgress ? 'true' : 'false'}</div>
      <div data-testid="change-state">{incidentData.changeState ? 'true' : 'false'}</div>
      <div data-testid="user-id">{incidentData.user?.id}</div>
      <div data-testid="incident-etat">{incidentData.incident?.etat}</div>
      {/* Ajouter un affichage pour EditIncident.etat pour vérifier son changement */}
      <div data-testid="edit-incident-etat">{incidentData.EditIncident?.etat}</div>

      {/* Boutons et select pour déclencher les actions */}
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
      <button data-testid="fetch-predictions" onClick={incidentData.fetchPredictions}>
        Fetch Predictions
      </button>
      <select 
        data-testid="select-type"
        value={incidentData.EditIncident?.etat || ''} // Lier la valeur au state
        onChange={(e) => incidentData.handleSelectChange({ value: e.target.value })}
      >
        <option value="">Select...</option> {/* Option par défaut */}
        <option value="declared">Declared</option>
        <option value="taken_into_account">Taken</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
};

// --- Suite de Tests --- 

describe('IncidentData Hook Enhanced Coverage', () => {

  // Mocker console.error AVANT chaque test
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {}); // Mocker aussi console.log si besoin
    jest.clearAllMocks(); // Assure que les mocks sont propres

    // Configurer les mocks axios par défaut pour les appels initiaux
    axios.get.mockImplementation((url) => {
      if (url.includes('/MapApi/user_retrieve/')) {
        return Promise.resolve({ data: { data: mockUserDataBase } });
      }
      if (url.includes(`/MapApi/incident/${mockIncidentBase.id}`)) {
        return Promise.resolve({ data: mockIncidentBase });
      }
      if (url.includes(`/MapApi/Incidentprediction/${mockIncidentBase.id}`)) {
        return Promise.resolve({ data: [mockPredictionBase] }); // Retourner un tableau
      }
      return Promise.reject(new Error(`Unhandled GET request: ${url}`));
    });
    // Mock POST par défaut
    axios.post.mockResolvedValue({ data: { success: true } });
    // Mock sessionStorage/localStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => 'fake-token'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true,
    });
     Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'fake-refresh-token'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true,
    });
  });

  // Restaurer les mocks APRÈS chaque test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Tests Existants (vérifiés et potentiellement ajustés) --- 

  it('charge les données initiales (incident, user, predictions) correctement', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => {
      // Vérifier les appels API initiaux
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/MapApi/user_retrieve/'), expect.any(Object));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/MapApi/incident/${mockIncidentBase.id}`));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/MapApi/Incidentprediction/${mockIncidentBase.id}`));
      // Vérifier quelques données affichées
      expect(screen.getByTestId('latitude').textContent).toBe(String(mockIncidentBase.lattitude));
      expect(screen.getByTestId('longitude').textContent).toBe(String(mockIncidentBase.longitude));
      expect(screen.getByTestId('zone').textContent).toBe(mockIncidentBase.zone);
      expect(screen.getByTestId('analysis').textContent).toBe(mockPredictionBase.analysis);
      expect(screen.getByTestId('user-id').textContent).toBe(String(mockUserDataBase.id));
    });
  });

  it('gère le changement de statut avec succès', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3)); // Attendre chargement initial

    // Sélectionner un état avant de cliquer
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'taken_into_account' } });
    await waitFor(() => expect(screen.getByTestId('edit-incident-etat').textContent).toBe('taken_into_account'));

    // Cliquer sur le bouton
    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    // Vérifier l'appel POST et Swal
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining(`/MapApi/hadleIncident/${mockIncidentBase.id}`),
      { action: 'taken_into_account' }, // Vérifier que l'action est bien l'état sélectionné
      expect.any(Object)
    );
    expect(Swal.fire).toHaveBeenCalledWith("Changement de status effectué avec succès");
    // Vérifier la réinitialisation de EditIncident.etat
    expect(screen.getByTestId('edit-incident-etat').textContent).toBe('');
  });

  it('gère l\'erreur token_not_valid et l\'échec du refresh token', async () => {
    axios.post
      .mockRejectedValueOnce({ response: { data: { code: 'token_not_valid' } } }) // Premier appel échoue
      .mockRejectedValueOnce(new Error("Refresh failed")); // Appel refresh échoue

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'resolved' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    // Vérifier les appels
    expect(axios.post).toHaveBeenCalledTimes(2); // 1 pour status, 1 pour refresh
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/token/refresh/'), expect.any(Object));
    expect(Swal.fire).toHaveBeenCalledWith("Session expired. Please log in again.");
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
  });

  // --- Nouveaux Tests pour Couverture Renforcée --- 

  it('affiche les valeurs par défaut si l\'incident chargé est incomplet', async () => {
    const incompleteIncident = { id: 1, created_at: '2024-01-01T00:00:00Z' }; // Pas de lat/lon/zone etc.
    axios.get.mockImplementation((url) => {
      if (url.includes(`/MapApi/incident/${mockIncidentBase.id}`)) {
        return Promise.resolve({ data: incompleteIncident });
      }
      if (url.includes('/MapApi/user_retrieve/')) return Promise.resolve({ data: { data: mockUserDataBase } });
      if (url.includes(`/MapApi/Incidentprediction/${mockIncidentBase.id}`)) return Promise.resolve({ data: [] });
      return Promise.reject(new Error(`Unhandled GET: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('latitude').textContent).toBe('0'); // Valeur par défaut
      expect(screen.getByTestId('longitude').textContent).toBe('0'); // Valeur par défaut
      expect(screen.getByTestId('zone').textContent).toBe(''); // Valeur par défaut
      expect(screen.getByTestId('img-url').textContent).toBe(''); // Pas de photo
      expect(screen.getByTestId('analysis').textContent).toBe(''); // Pas de prédiction
    });
  });

  it('gère une erreur lors du chargement initial des données utilisateur', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/MapApi/user_retrieve/')) {
        return Promise.reject(new Error('Failed to fetch user'));
      }
      // Les autres appels réussissent pour isoler l'erreur
      if (url.includes(`/MapApi/incident/${mockIncidentBase.id}`)) return Promise.resolve({ data: mockIncidentBase });
      if (url.includes(`/MapApi/Incidentprediction/${mockIncidentBase.id}`)) return Promise.resolve({ data: [mockPredictionBase] });
      return Promise.reject(new Error(`Unhandled GET: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Erreur lors de la récupération des informations utilisateur :", "Failed to fetch user");
      // Vérifier qu'un état dépendant de l'utilisateur n'est pas défini (ou a une valeur par défaut)
      expect(screen.getByTestId('user-id').textContent).toBe('');
    });
  });

  it('gère une erreur lors du chargement initial des détails de l\'incident', async () => {
     axios.get.mockImplementation((url) => {
      if (url.includes(`/MapApi/incident/${mockIncidentBase.id}`)) {
        return Promise.reject(new Error('Failed to fetch incident'));
      }
      if (url.includes('/MapApi/user_retrieve/')) return Promise.resolve({ data: { data: mockUserDataBase } });
      if (url.includes(`/MapApi/Incidentprediction/${mockIncidentBase.id}`)) return Promise.resolve({ data: [mockPredictionBase] });
      return Promise.reject(new Error(`Unhandled GET: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Erreur lors de la récupération des détails de l'incident :", expect.any(Error));
      // Vérifier qu'un état dépendant de l'incident n'est pas défini
      expect(screen.getByTestId('latitude').textContent).toBe('0'); 
    });
  });

  it('gère une erreur lors du chargement initial des prédictions', async () => {
     axios.get.mockImplementation((url) => {
      if (url.includes(`/MapApi/Incidentprediction/${mockIncidentBase.id}`)) {
        return Promise.reject(new Error('Failed to fetch predictions'));
      }
      if (url.includes('/MapApi/user_retrieve/')) return Promise.resolve({ data: { data: mockUserDataBase } });
      if (url.includes(`/MapApi/incident/${mockIncidentBase.id}`)) return Promise.resolve({ data: mockIncidentBase });
      return Promise.reject(new Error(`Unhandled GET: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Erreur lors de la récupération des prédictions :", expect.any(Error));
      // Vérifier qu'un état dépendant des prédictions n'est pas défini
      expect(screen.getByTestId('analysis').textContent).toBe(''); 
    });
  });

  it('gère une erreur lors du changement de type d\'incident (handleSelectChange)', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to change type'));
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    await act(async () => {
        fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'resolved' } });
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining(`/MapApi/changeIncidentType/${mockIncidentBase.id}`),
            { etat: 'resolved' },
            expect.any(Object)
        );
        expect(console.error).toHaveBeenCalledWith("Erreur lors du changement de type d'incident :", expect.any(Error));
    });
  });

  it('gère une erreur serveur générique lors du changement de statut (handleChangeStatus)', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: 'Server Error' } }); // Erreur générique
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'taken_into_account' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1); // Pas de tentative de refresh
        expect(Swal.fire).toHaveBeenCalledWith("Désolé", "Cet incident est déjà pris en compte."); // Message d'erreur générique du code
        expect(screen.getByTestId('in-progress').textContent).toBe('false'); // Vérifier que l'état inProgress est bien repassé à false
    });
  });

   it('gère une erreur réseau lors du changement de statut (handleChangeStatus)', async () => {
    axios.post.mockRejectedValueOnce({ request: {} }); // Simule une erreur réseau (pas de réponse)
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'taken_into_account' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith({}); // Log de error.request
        expect(Swal.fire).not.toHaveBeenCalled(); // Pas d'alerte dans ce cas
        expect(screen.getByTestId('in-progress').textContent).toBe('false');
    });
  });

  it('gère une erreur inattendue lors du changement de statut (handleChangeStatus)', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unexpected error')); // Erreur autre
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'taken_into_account' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('Unexpected error'); // Log de error.message
        expect(Swal.fire).not.toHaveBeenCalled();
        expect(screen.getByTestId('in-progress').textContent).toBe('false');
    });
  });

  it('réussit le changement de statut après un refresh token réussi', async () => {
    axios.post
      .mockRejectedValueOnce({ response: { data: { code: 'token_not_valid' } } }) // 1er appel échoue
      .mockResolvedValueOnce({ data: { access: 'new-fake-token' } }) // Refresh réussit
      .mockResolvedValueOnce({ data: { success: true } }); // 2ème appel status réussit

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));
    fireEvent.change(screen.getByTestId('select-type'), { target: { value: 'resolved' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('change-status'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(3); // status + refresh + status retry
        // Vérifier l'appel retry avec le nouveau token
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining(`/MapApi/hadleIncident/${mockIncidentBase.id}`),
            { action: 'resolved' },
            { headers: { Authorization: 'Bearer new-fake-token' } }
        );
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new-fake-token');
        expect(Swal.fire).toHaveBeenCalledWith("Changement de status effectué avec succès");
        // Vérifier la réinitialisation de EditIncident.etat
        expect(screen.getByTestId('edit-incident-etat').textContent).toBe('');
    });
  });

  it('gère une erreur lors de la récupération des données Overpass', async () => {
    axios.post.mockImplementation((url) => {
        if (url.includes('overpass-api.de')) {
            return Promise.reject(new Error('Overpass API error'));
        }
        // Mock l'appel à l'API de prédiction finale pour isoler l'erreur Overpass
        if (url === config.url2) {
            return Promise.resolve({ data: { success: true } });
        }
        return Promise.reject(new Error(`Unhandled POST: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3)); // Attendre chargement initial

    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });

    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith("Erreur lors de la récupération des structures sensibles :", expect.any(Error));
        // Vérifier que l'appel à l'API finale n'a pas eu lieu car Overpass a échoué
        expect(axios.post).not.toHaveBeenCalledWith(config.url2, expect.any(Object));
    });
  });

  it('gère une erreur lors de l\envoi final des prédictions à config.url2', async () => {
    axios.post.mockImplementation((url, data) => {
        if (url.includes('overpass-api.de')) {
            return Promise.resolve(mockOverpassResponseBase);
        }
        if (url === config.url2) {
            return Promise.reject(new Error('Prediction send error'));
        }
        return Promise.reject(new Error(`Unhandled POST: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('overpass-api.de'), expect.any(String));
        expect(axios.post).toHaveBeenCalledWith(config.url2, expect.any(Object));
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi des données de prédiction :", expect.any(Error));
    });
  });

  it('gère une réponse Overpass sans éléments', async () => {
    axios.post.mockImplementation((url, data) => {
        if (url.includes('overpass-api.de')) {
            return Promise.resolve({ data: { elements: [] } }); // Pas d'éléments
        }
        if (url === config.url2) {
            return Promise.resolve({ data: { success: true } });
        }
        return Promise.reject(new Error(`Unhandled POST: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });

    await waitFor(() => {
        // Vérifier que l'appel final est fait avec un tableau vide de structures
        expect(axios.post).toHaveBeenCalledWith(
            config.url2,
            expect.objectContaining({ sensitive_structures: [] }),
            expect.any(Object)
        );
    });
  });

  it('traduit correctement les structures sensibles et gère les inconnues et doublons', async () => {
     axios.post.mockImplementation((url, data) => {
        if (url.includes('overpass-api.de')) {
            // Réponse avec doublons et inconnus
            return Promise.resolve({ data: { elements: [
                { tags: { amenity: 'hospital' } },
                { tags: { amenity: 'hospital' } }, // Doublon
                { tags: { amenity: 'unknown_amenity' } }, // Inconnu
                { tags: { highway: 'motorway' } }, // Connu
                { tags: {} } // Pas de tags
            ] } });
        }
        if (url === config.url2) {
            return Promise.resolve({ data: { success: true } });
        }
        return Promise.reject(new Error(`Unhandled POST: ${url}`));
    });

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(3));

    await act(async () => {
      fireEvent.click(screen.getByTestId('send-prediction'));
    });

    await waitFor(() => {
        // Vérifier que la liste envoyée est correcte et unique
        expect(axios.post).toHaveBeenCalledWith(
            config.url2,
            expect.objectContaining({ 
                sensitive_structures: expect.arrayContaining(['Hôpital', 'Route', 'Structure inconnue']) 
            }),
            expect.any(Object)
        );
        // Vérifier que la taille est correcte (pas de doublons)
        const callArgs = axios.post.mock.calls.find(call => call[0] === config.url2);
        expect(callArgs[1].sensitive_structures).toHaveLength(3);
    });
  });

});

