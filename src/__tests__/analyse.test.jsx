// const React = require('react');
// const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
// const { ChakraProvider } = require('@chakra-ui/react');
// const { BrowserRouter } = require('react-router-dom');

// // Mock des dépendances problématiques

// jest.mock('react-slick', () => (props) => <div>{props.children}</div>);
// jest.mock('react-leaflet', () => ({
//   MapContainer: () => <div data-testid="map-container">Map Container</div>,
//   TileLayer: () => null,
//   Popup: () => null,
//   Marker: () => null,
//   Circle: () => null,
//   useMap: () => ({ setView: jest.fn() })
// }));
// const mockIncidentData = jest.fn();

// // Mock de la fonction IncidentData
// jest.mock('Fonctions/Incident_fonction', () => ({
//   IncidentData: () => ({
//     latitude: 48.8566,
//     longitude: 2.3522,
//     imgUrl: 'test-image.jpg',
//     date: '2024-03-21',
//     heure: '14:30',
//     incident: { title: 'Test Incident' },
//     prediction: { 
//       analysis: 'Texte très long '.repeat(31),
//       piste_solution: "Voici une piste de solution.",
//       ndvi_heatmap: "mock.png",
//       ndvi_ndwi_plot: "mock.png",
//       landcover_plot: "mock.png",
//     },
//     type_incident: 'Test type',
//     zone: 'Test zone',
//     handleNavigateLLM: jest.fn(),
//     sendPrediction: jest.fn(),
//     isLoadingContext: false,
//   })
// }));
// jest.mock('react-markdown', () => {
//   return ({ children }) => (
//     <div data-testid="markdown">
//       {typeof children === 'string' ? children : JSON.stringify(children)}
//     </div>
//   );
// });

// const Analyze = require('../views/Dashboard/analyze').default;

// describe('Analyze Component', () => {
//   const renderWithProviders = (component) => {
//     return render(
//       <BrowserRouter>
//         <ChakraProvider>
//           {component}
//         </ChakraProvider>
//       </BrowserRouter>
//     );
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('affiche les informations de l\'incident', async () => {
//     renderWithProviders(<Analyze />);

//     await waitFor(() => {
//       expect(screen.getByText('Test zone')).toBeInTheDocument();
//       expect(screen.getByText('Test type')).toBeInTheDocument();
//     });
//   });

//   it('affiche la carte avec les coordonnées correctes', async () => {
//     renderWithProviders(<Analyze />);

//     await waitFor(() => {
//       expect(screen.getByTestId('map-container')).toBeInTheDocument();
//     });
//   });

//   it('affiche l\'image de l\'incident', async () => {
//     renderWithProviders(<Analyze />);

//     await waitFor(() => {
//       const image = screen.getByAltText('Incident');
//       expect(image).toBeInTheDocument();
//       expect(image.src).toContain('test-image.jpg');
//     });
//   });

//   it('affiche la date et l\'heure', async () => {
//     renderWithProviders(<Analyze />);

//     await waitFor(() => {
//       expect(screen.getByText('Date : 2024-03-21')).toBeInTheDocument();
//       expect(screen.getByText('Heure : 14:30')).toBeInTheDocument();
//     });
//   });

//   it('affiche les analyses et solutions', async () => {
//     renderWithProviders(<Analyze />);

//     await waitFor(() => {
//       const markdownBlocks = screen.getAllByTestId('markdown');
//       expect(markdownBlocks[0]).toHaveTextContent('Texte très long');
//       expect(markdownBlocks[1]).toHaveTextContent('Test solution');
//       expect(markdownBlocks[2]).toHaveTextContent('Test impact');
//     });
//   });
  
  
//   it('ouvre et ferme le modal de visualisation', async () => {
//     renderWithProviders(<Analyze />);
  
//     const button = await screen.findByText(/Visualiser/i);
//     fireEvent.click(button);
  
//     await waitFor(() => {
//       expect(screen.getByText(/Graphiques/i)).toBeInTheDocument(); // Ou le titre exact du Modal
//     });
  
//     const closeBtn = screen.getByText(/Fermer/i); // Adapter si besoin
//     fireEvent.click(closeBtn);
  
//     await waitFor(() => {
//       expect(screen.queryByText(/Graphiques/i)).not.toBeInTheDocument();
//     });
//   });
//   it('affiche un message d\'erreur si predictionError est défini', async () => {
//     renderWithProviders(<Analyze />);
  
//     await waitFor(() => {
//       expect(screen.getByText(/Erreur pendant l'analyse/i)).toBeInTheDocument();
//     });
//   });
//   it('affiche un message lorsque aucun problème environnemental n\'est détecté', async () => {
//     mockIncidentData.mockReturnValue({
//       latitude: 48.8566,
//       longitude: 2.3522,
//       imgUrl: 'test-image.jpg',
//       date: '2024-03-21',
//       heure: '14:30',
//       incident: { title: 'Test Incident' },
//       prediction: null,
//       type_incident: 'Aucun problème environnemental',
//       zone: 'Test zone',
//       predictionError: null,
//       handleNavigateLLM: jest.fn(),
//       sendPrediction: jest.fn()
//     });
  
//     renderWithProviders(<Analyze />);
    
//     await waitFor(() => {
//       expect(screen.getByText(/Aucun problème environnemental/i)).toBeInTheDocument();
//     });
//   });
//   it('déclenche handleNavigateLLM lors du clic sur MapChat', async () => {
//     const mockHandleNavigateLLM = jest.fn();
  
//     jest.mock('Fonctions/Incident_fonction', () => ({
//       IncidentData: () => ({
//         handleNavigateLLM: mockHandleNavigateLLM,
//         incident: { title: 'Test' }
//       })
//     }));
  
//     renderWithProviders(<Analyze />);
  
//     const mapChatBtn = await screen.findByText(/MapChat/i);
//     fireEvent.click(mapChatBtn);
  
//     expect(mockHandleNavigateLLM).toHaveBeenCalled();
//   });
//   it('affiche un message si les coordonnées sont 0,0', async () => {
//     renderWithProviders(<Analyze />);
//     await waitFor(() => {
//       expect(screen.getByText(/Coordonnées non renseignées/i)).toBeInTheDocument();
//     });
//   });
  
//   it('affiche un message d\'attente si l\'analyse est en cours', async () => {
//     renderWithProviders(<Analyze />);
//     await waitFor(() => {
//       expect(screen.getByText(/L'analyse est en cours/i)).toBeInTheDocument();
//     });
//   });
  
//   it('affiche les images dans le modal de visualisation', async () => {
//     renderWithProviders(<Analyze />);
    
//     fireEvent.click(await screen.findByText(/Visualiser/i));
  
//     await waitFor(() => {
//       expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(3);
//       expect(screen.getByAltText('NDVI Heatmap')).toBeInTheDocument();
//       expect(screen.getByAltText('NDVI NDWI Plot')).toBeInTheDocument();
//       expect(screen.getByAltText('Landcover Plot')).toBeInTheDocument();
//     });
//   });

//   it('gère le basculement entre "voir plus" et "voir moins"', async () => {
//     renderWithProviders(<Analyze />);
  
//     const voirPlusButton = await screen.findByText(/Voir plus/i);
//     expect(voirPlusButton).toBeInTheDocument();
  
//     fireEvent.click(voirPlusButton);
//     await waitFor(() => {
//       expect(screen.getByText(/Voir moins/i)).toBeInTheDocument();
//     });
  
//     fireEvent.click(screen.getByText(/Voir moins/i));
//     expect(screen.getByText(/Voir plus/i)).toBeInTheDocument();
//   });
//   it('correspond au rendu attendu', async () => {
   
//     const { container } = renderWithProviders(<Analyze />);
//     await waitFor(() => screen.getAllByText(/.../)); // attend que tout soit monté
//     expect(container).toMatchSnapshot();
//   });
  
// });

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Analyze from "../views/Dashboard/analyze"; // Ajusté selon le fichier utilisateur
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";

// --- Mocks --- 

// Mock useParams
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // Conserve les autres exports
    useParams: jest.fn(),
}));

// Mock IncidentData hook
jest.mock("Fonctions/Incident_fonction", () => ({
    IncidentData: jest.fn(),
}));

// Mock react-leaflet components
jest.mock("react-leaflet", () => ({
    MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer"></div>,
    Marker: ({ children }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }) => <div data-testid="popup">{children}</div>,
    Circle: () => <div data-testid="circle"></div>,
    useMap: jest.fn(() => ({ // Mock useMap pour RecenterMap
        setView: jest.fn(),
    })),
}));

// Mock react-slick
jest.mock("react-slick", () => {
    return function DummySlider({ children }) {
        return <div data-testid="slider">{children}</div>;
    };
});

// Mock QuotesCarousel
jest.mock("../views/Dashboard/QuotesCarousel", () => { // Ajusté selon le fichier utilisateur
    return function DummyQuotesCarousel() {
        return <div data-testid="quotes-carousel">Quotes Carousel Mock</div>;
    };
});

// Mock L.DivIcon (nécessaire car utilisé directement)
global.L = {
    DivIcon: jest.fn(),
};

// Mock fetch API
global.fetch = jest.fn();

// Mock ReactDOMServer
jest.mock("react-dom/server", () => ({
    renderToString: jest.fn((component) => "<div>Mocked Icon</div>"),
}));

// Mock config URL
jest.mock("config", () => ({
    config: {
        url: "http://mock-api.com",
    },
}));

// Mock Chakra UI useDisclosure (simplifié)
jest.mock("@chakra-ui/react", () => {
    const actualChakra = jest.requireActual("@chakra-ui/react");
    return {
        ...actualChakra,
        useDisclosure: jest.fn(() => ({
            isOpen: false,
            onOpen: jest.fn(),
            onClose: jest.fn(),
        })),
    };
});

// Mock react-markdown (ajouté selon le fichier utilisateur)
jest.mock('react-markdown', () => {
  return ({ children }) => (
    <div data-testid="markdown">
      {typeof children === 'string' ? children : JSON.stringify(children)}
    </div>
  );
});

// --- Helper Functions --- 

const setupMocks = (mockData) => {
    require("react-router-dom").useParams.mockReturnValue({ incidentId: "test-incident-123" });
    require("Fonctions/Incident_fonction").IncidentData.mockReturnValue({
        latitude: 48.8566,
        longitude: 2.3522,
        imgUrl: "http://example.com/image.jpg",
        date: "2024-05-23",
        heure: "14:00",
        incident: { title: "Test Incident", etat: "new" },
        handleNavigateLLM: jest.fn(),
        type_incident: "Problème environnemental",
        zone: "Zone Test",
        sendPrediction: jest.fn().mockResolvedValue(undefined), // Mock sendPrediction
        ...mockData, // Permet de surcharger les valeurs par défaut
    });
    // Réinitialiser fetch pour chaque test
    global.fetch.mockClear();
    // Mock useDisclosure séparément pour contrôler isOpen
    const mockDisclosure = require("@chakra-ui/react").useDisclosure;
    mockDisclosure.mockClear(); // Clear previous mock calls
    const onOpenMock = jest.fn();
    const onCloseMock = jest.fn();
    // Important: le mock doit être réinitialisé ici pour chaque appel à setupMocks
    mockDisclosure.mockReturnValue({
        isOpen: false, // Default state
        onOpen: onOpenMock,
        onClose: onCloseMock,
    });
    return { onOpenMock, onCloseMock, mockDisclosure }; // Retourner les mocks pour les assertions
};

// Fonction pour envelopper le composant avec les providers nécessaires
const renderWithProviders = (component, mockDisclosureState = { isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }) => {
    // Assurer que le mock useDisclosure est configuré AVANT le rendu
    require("@chakra-ui/react").useDisclosure.mockReturnValue(mockDisclosureState);
    return render(
        <BrowserRouter>
            <ChakraProvider>
                {component}
            </ChakraProvider>
        </BrowserRouter>
    );
};

// --- Test Suite --- 

describe("Analyze Component", () => {

    beforeEach(() => {
        // Nettoyer les mocks avant chaque test
        jest.clearAllMocks();
        // Réinitialiser le mock fetch
        global.fetch.mockReset();
        // S'assurer que useDisclosure est réinitialisé avant chaque test
        require("@chakra-ui/react").useDisclosure.mockClear();
    });

    test("affiche l'indicateur de chargement initialement", async () => {
        setupMocks({}); // Setup de base
        // Simuler que la prédiction n'existe pas encore pour déclencher le chargement
        global.fetch.mockResolvedValueOnce({ 
            ok: false, 
            status: 404, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => ({}) // Simule une réponse 404
        }); 

        renderWithProviders(<Analyze />);

        // Vérifier l'indicateur de chargement
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
        expect(screen.getByText(/L'analyse est en cours/i)).toBeInTheDocument();

        // Attendre potentiellement la fin du chargement (même si on teste l'état initial)
        // Cela évite les avertissements "act"
        await waitFor(() => expect(require("Fonctions/Incident_fonction").IncidentData().sendPrediction).toHaveBeenCalled());
    });

    test("affiche un message d'erreur si la récupération de la prédiction échoue", async () => {
        setupMocks({});
        // Simuler une erreur réseau lors du fetch initial
        global.fetch.mockRejectedValueOnce(new Error("Network Error"));

        renderWithProviders(<Analyze />);

        // Attendre l'affichage du message d'erreur
        await waitFor(() => {
            expect(screen.getByText(/Erreur lors de la récupération des données d'analyse/i)).toBeInTheDocument();
        });
        // Vérifier que le spinner n'est plus là
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    });

    test("affiche un message d'erreur si l'envoi de la prédiction échoue", async () => {
        setupMocks({});
        // Simuler que la prédiction n'existe pas (404)
        global.fetch.mockResolvedValueOnce({ 
            ok: false, 
            status: 404, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => ({}) 
        }); 
        // Simuler l'échec de sendPrediction
        const sendPredictionMock = require("Fonctions/Incident_fonction").IncidentData().sendPrediction;
        sendPredictionMock.mockRejectedValueOnce(new Error("API Error"));

        renderWithProviders(<Analyze />);

        // Attendre l'affichage du message d'erreur spécifique à l'envoi
        await waitFor(() => {
            expect(screen.getByText(/Échec de l'envoi de la prédiction/i)).toBeInTheDocument();
        });
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    });

    test("affiche le message 'Aucun problème environnemental' quand type_incident est correspondant", async () => {
        setupMocks({ type_incident: "Aucun problème environnemental" });
        // Pas besoin de fetch mock ici car shouldShowReport() sera false

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders

        // Attendre que le chargement initial (même s'il est court) soit terminé
        // Pas besoin de waitFor ici car le rendu est synchrone dans ce cas
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
       
        expect(screen.getByText(/Notre modèle a analysé l'image de l'incident mais n'a détecté aucun problème environnemental/i)).toBeInTheDocument();
        expect(screen.getByText(/MapChat/i)).toBeInTheDocument(); // Le bouton MapChat doit toujours être là
        expect(screen.queryByText(/Rapport d'Analyse/i)).toBeInTheDocument(); // Le titre est toujours là
        expect(screen.queryByText(/Visualiser/i)).not.toBeInTheDocument(); // Pas de bouton visualiser
    });

    test("affiche le rapport d'analyse et les détails quand la prédiction est réussie", async () => {
        const mockPrediction = {
            analysis: "Ceci est une analyse détaillée de l'incident.",
            piste_solution: "Voici une piste de solution.",
            ndvi_heatmap: "http://example.com/ndvi.jpg",
            ndvi_ndwi_plot: "http://example.com/plot.jpg",
            landcover_plot: "http://example.com/landcover.jpg",
        };
        setupMocks({});
        // Simuler la récupération réussie de la prédiction
        global.fetch.mockResolvedValueOnce({ 
            ok: true, 
            status: 200, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => mockPrediction 
        });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders

        // Attendre l'affichage du rapport
        await waitFor(() => {
            expect(screen.getByText(/Rapport d'Analyse/i)).toBeInTheDocument();
        });
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

        // Vérifier les informations affichées
        expect(screen.getByText(/Zone Test/i)).toBeInTheDocument();
        // Utiliser une regex plus souple pour les coordonnées pour éviter les problèmes d'espacement
        expect(screen.getByText(/48\.8566,\s*2\.3522/i)).toBeInTheDocument(); 
        expect(screen.getByText(/Problème environnemental/i)).toBeInTheDocument();
        // Vérifier l'affichage tronqué initial de l'analyse (via le mock react-markdown)
        expect(screen.getByTestId("markdown")).toHaveTextContent(/Ceci est une analyse détaillée de l'incident\.\.\./i);
        expect(screen.queryByText(/Voici une piste de solution/i)).not.toBeInTheDocument(); // La solution ne doit pas être visible initialement

        // Vérifier la présence des boutons
        expect(screen.getByRole('button', { name: /MapChat/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Visualiser/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Voir plus/i })).toBeInTheDocument();
    });

    test("affiche l'analyse complète et la solution après clic sur 'Voir plus'", async () => {
        const mockPrediction = {
            analysis: "Ceci est une analyse détaillée de l'incident qui est suffisamment longue pour être tronquée initialement et nécessiter un clic sur voir plus pour tout afficher.",
            piste_solution: "Voici une piste de solution.",
        };
        setupMocks({});
        global.fetch.mockResolvedValueOnce({ 
            ok: true, 
            status: 200, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => mockPrediction 
        });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders

        // Attendre l'affichage initial
        const voirPlusButton = await screen.findByRole('button', { name: /Voir plus/i });
        // Vérifier que la solution n'est pas dans le markdown initial
        expect(screen.getByTestId("markdown")).not.toHaveTextContent(/Voici une piste de solution/i);

        // Cliquer sur 'Voir plus'
        fireEvent.click(voirPlusButton);

        // Attendre la mise à jour du DOM après le clic
        await waitFor(() => {
             // Vérifier que tout le texte est affiché dans les éléments markdown
             // On peut avoir plusieurs éléments markdown rendus
            expect(screen.getAllByTestId("markdown")[0]).toHaveTextContent(mockPrediction.analysis);
            expect(screen.getAllByTestId("markdown")[1]).toHaveTextContent(mockPrediction.piste_solution);
        });
        expect(screen.getByRole('button', { name: /Voir moins/i })).toBeInTheDocument();

        // Cliquer sur 'Voir moins'
        fireEvent.click(screen.getByRole('button', { name: /Voir moins/i }));

        // Attendre la mise à jour
        await waitFor(() => {
            // Vérifier que seul le texte tronqué est affiché
            expect(screen.getByTestId("markdown")).toHaveTextContent(/Ceci est une analyse détaillée de l'incident qui est suffisamment longue pour être tronquée initialement et nécessiter un clic sur voir plus pour tout afficher\.\.\./i);
            // Vérifier que la solution n'est plus là
            expect(screen.queryByText(mockPrediction.piste_solution)).not.toBeInTheDocument(); 
        });
        expect(screen.getByRole('button', { name: /Voir plus/i })).toBeInTheDocument();
    });

    test("ouvre et ferme le modal 'Visualiser'", async () => {
        const mockPrediction = {
            analysis: "Analyse",
            ndvi_heatmap: "http://example.com/ndvi.jpg",
            ndvi_ndwi_plot: "http://example.com/plot.jpg",
            landcover_plot: "http://example.com/landcover.jpg",
        };
        // Récupérer les mocks onOpen/onClose de la configuration initiale
        const { onOpenMock, onCloseMock, mockDisclosure } = setupMocks({}); 
        global.fetch.mockResolvedValueOnce({ 
            ok: true, 
            status: 200, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => mockPrediction 
        });

        // Rendu initial avec le modal fermé
        const { rerender } = renderWithProviders(<Analyze />, { isOpen: false, onOpen: onOpenMock, onClose: onCloseMock });

        // Attendre le bouton Visualiser
        const visualiserButton = await screen.findByRole('button', { name: /Visualiser/i });

        // Vérifier que le modal n'est pas ouvert initialement
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Cliquer sur 'Visualiser'
        fireEvent.click(visualiserButton);

        // Vérifier que onOpen a été appelé
        expect(onOpenMock).toHaveBeenCalledTimes(1);

        // --- Simulation de l'ouverture du modal --- 
        // Re-rendre avec le mock mis à jour pour isOpen: true
        rerender(
            <BrowserRouter>
                <ChakraProvider>
                    <Analyze />
                </ChakraProvider>
            </BrowserRouter>
        );
        // Mettre à jour l'état du mock *après* le clic mais *avant* les assertions sur le contenu du modal
        mockDisclosure.mockReturnValue({ isOpen: true, onOpen: onOpenMock, onClose: onCloseMock }); 
        // Forcer un re-render virtuel si nécessaire ou attendre que le DOM reflète l'état ouvert
        // Souvent, le simple fait de vérifier le contenu suffit si le re-render est synchrone au changement d'état

        // Attendre que le modal soit rendu (peut nécessiter waitFor)
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        expect(screen.getByText(/Graphiques/i)).toBeInTheDocument(); // Titre du modal
        expect(screen.getByTestId('slider')).toBeInTheDocument(); // Vérifier le slider mocké
        // Vérifier la présence des images
        expect(screen.getByAltText("NDVI Heatmap")).toBeInTheDocument();
        expect(screen.getByAltText("NDVI NDWI Plot")).toBeInTheDocument();
        expect(screen.getByAltText("Landcover Plot")).toBeInTheDocument();
        const fermerButton = screen.getByRole('button', { name: /Fermer/i });
        expect(fermerButton).toBeInTheDocument();

        // Cliquer sur 'Fermer'
        fireEvent.click(fermerButton);

        // Vérifier que onClose a été appelé
        expect(onCloseMock).toHaveBeenCalledTimes(1);

        // --- Simulation de la fermeture --- 
        // Re-rendre avec le mock mis à jour pour isOpen: false
        mockDisclosure.mockReturnValue({ isOpen: false, onOpen: onOpenMock, onClose: onCloseMock });
        rerender(
             <BrowserRouter>
                <ChakraProvider>
                    <Analyze />
                </ChakraProvider>
            </BrowserRouter>
        );
       
        // Attendre que le modal disparaisse
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    test("affiche la carte interactive si les coordonnées sont valides", async () => {
        setupMocks({}); // Coordonnées valides par défaut
        global.fetch.mockResolvedValueOnce({ ok: true, status: 200, headers: new Headers({'content-type': 'application/json'}), json: async () => ({ analysis: "Analyse" }) });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders
        await waitFor(() => expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument());

        expect(screen.getByText(/Carte interactive/i)).toBeInTheDocument();
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
        expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
        expect(screen.getByTestId("marker")).toBeInTheDocument();
        expect(screen.getByTestId("popup")).toBeInTheDocument();
        expect(screen.getByTestId("circle")).toBeInTheDocument();
    });

    test("n'affiche pas la carte interactive si les coordonnées sont invalides (0, 0)", async () => {
        setupMocks({ latitude: 0, longitude: 0 });
        global.fetch.mockResolvedValueOnce({ ok: true, status: 200, headers: new Headers({'content-type': 'application/json'}), json: async () => ({ analysis: "Analyse" }) });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders
        await waitFor(() => expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument());

        expect(screen.getByText(/Carte interactive/i)).toBeInTheDocument();
        expect(screen.getByText(/Coordonnées non renseignées/i)).toBeInTheDocument();
        expect(screen.queryByTestId("map-container")).not.toBeInTheDocument();
    });

    test("affiche l'image de l'incident si imgUrl est fourni", async () => {
        setupMocks({ imgUrl: "http://example.com/incident.jpg" });
        global.fetch.mockResolvedValueOnce({ ok: true, status: 200, headers: new Headers({'content-type': 'application/json'}), json: async () => ({ analysis: "Analyse" }) });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders
        await waitFor(() => expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument());

        expect(screen.getByText(/Image de l'incident/i)).toBeInTheDocument();
        const image = screen.getByAltText("Incident");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", "http://example.com/incident.jpg");
        expect(screen.getByText(/Date : 2024-05-23/i)).toBeInTheDocument();
        expect(screen.getByText(/Heure : 14:00/i)).toBeInTheDocument();
    });

    test("affiche 'No image available' si imgUrl n'est pas fourni", async () => {
        setupMocks({ imgUrl: null });
        global.fetch.mockResolvedValueOnce({ ok: true, status: 200, headers: new Headers({'content-type': 'application/json'}), json: async () => ({ analysis: "Analyse" }) });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders
        await waitFor(() => expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument());

        expect(screen.getByText(/Image de l'incident/i)).toBeInTheDocument();
        expect(screen.getByText(/No image available/i)).toBeInTheDocument();
        expect(screen.queryByAltText("Incident")).not.toBeInTheDocument();
    });

    test("appelle handleNavigateLLM lors du clic sur le bouton MapChat", async () => {
        const handleNavigateLLMMock = jest.fn();
        setupMocks({ handleNavigateLLM: handleNavigateLLMMock });
        global.fetch.mockResolvedValueOnce({ ok: true, status: 200, headers: new Headers({'content-type': 'application/json'}), json: async () => ({ analysis: "Analyse" }) });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders
        const mapChatButton = await screen.findByRole('button', { name: /MapChat/i });

        fireEvent.click(mapChatButton);
        expect(handleNavigateLLMMock).toHaveBeenCalledTimes(1);
    });

    // Test pour le polling (plus complexe, peut nécessiter jest.useFakeTimers)
    test("appelle fetch périodiquement si la prédiction n'est pas trouvée initialement", async () => {
        jest.useFakeTimers(); // Utiliser les timers mockés de Jest
        setupMocks({});
        const sendPredictionMock = require("Fonctions/Incident_fonction").IncidentData().sendPrediction;

        // 1. Fetch initial (404 - pas de prédiction)
        global.fetch.mockResolvedValueOnce({ 
            ok: false, 
            status: 404, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => ({}) 
        }); 
        // 2. Fetch pendant le polling (encore 404)
        global.fetch.mockResolvedValueOnce({ 
            ok: false, 
            status: 404, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => ({}) 
        }); 
        // 3. Fetch pendant le polling (trouvé!)
        const mockPrediction = { analysis: "Trouvé après polling!" };
        global.fetch.mockResolvedValueOnce({ 
            ok: true, 
            status: 200, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => mockPrediction 
        });

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders

        // Attendre que sendPrediction soit appelé (déclenché par le 404 initial)
        await waitFor(() => expect(sendPredictionMock).toHaveBeenCalledTimes(1));
        // Le polling devrait commencer
        expect(global.fetch).toHaveBeenCalledTimes(1); // Fetch initial

        // Avancer le temps pour déclencher le premier intervalle de polling (15s)
        jest.advanceTimersByTime(15000);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2)); // Premier fetch de polling

        // Avancer le temps pour déclencher le deuxième intervalle de polling (15s)
        jest.advanceTimersByTime(15000);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3)); // Deuxième fetch de polling (qui réussit)

        // Vérifier que l'analyse est affichée
        await waitFor(() => {
            // Utiliser le mock de react-markdown pour vérifier le contenu
            expect(screen.getByTestId("markdown")).toHaveTextContent(/Trouvé après polling!/i);
        });
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

        // Avancer encore le temps pour s'assurer que le polling s'est arrêté
        jest.advanceTimersByTime(15000);
        expect(global.fetch).toHaveBeenCalledTimes(3); // Ne doit pas avoir été appelé à nouveau

        jest.useRealTimers(); // Restaurer les vrais timers
    });

     test("affiche une erreur si le polling dépasse le temps maximum", async () => {
        jest.useFakeTimers();
        setupMocks({});
        const sendPredictionMock = require("Fonctions/Incident_fonction").IncidentData().sendPrediction;

        // Simuler que fetch renvoie toujours 404
        global.fetch.mockResolvedValue({ 
            ok: false, 
            status: 404, 
            headers: new Headers({'content-type': 'application/json'}),
            json: async () => ({}) 
        }); 

        renderWithProviders(<Analyze />); // Utiliser renderWithProviders

        // Attendre que sendPrediction soit appelé
        await waitFor(() => expect(sendPredictionMock).toHaveBeenCalledTimes(1));
        expect(global.fetch).toHaveBeenCalledTimes(1); // Fetch initial

        // Avancer le temps au-delà du timeout (5 minutes)
        jest.advanceTimersByTime(5 * 60 * 1000 + 1000); // 5 minutes + 1 seconde

        // Attendre l'affichage de l'erreur de timeout
        await waitFor(() => {
            expect(screen.getByText(/L'analyse prend plus de temps que prévu/i)).toBeInTheDocument();
        });
        expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

        jest.useRealTimers();
    });

});

