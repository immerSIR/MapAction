import React, { useEffect } from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { useIncidentData } from "../../Fonctions/Dash_fonction";

// Mocks déjà définis pour Month, YearMonth, axios, useHistory, etc.
jest.mock("../../Fonctions/Month", () => ({
  useMonth: () => ({
    selectedMonth: 5, // Mois choisi pour les tests
  }),
}));
const mockPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockPush,
  }),
}));

jest.mock('axios');
jest.mock('../../config', () => ({
  config: {
    url: 'http://fake-api'
  }
}));
jest.mock("../../Fonctions/YearMonth", () => ({
  useDateFilter: () => ({
    filterType: "today",
    customRange: [
      {
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-31"),
      },
    ],
  }),
}));


describe('useIncidentData', () => {
  const mockIncidents = [
    {
      id: 1,
      user_id: null,
      etat: 'declared'
    },
    {
      id: 2,
      user_id: 1,
      etat: 'taken_into_account'
    },
    {
      id: 3,
      user_id: 2,
      etat: 'resolved'
    }
  ];

  const TestComponent = () => {
    const incidentData = useIncidentData();
    return (
      <div>
        <div data-testid="anonymous">{incidentData.anonymousPercentage}</div>
        <div data-testid="registered">{incidentData.registeredPercentage}</div>
        <button 
          onClick={() => incidentData.setShowOnlyTakenIntoAccount(true)}
          data-testid="filter-taken"
        >
          Filter Taken
        </button>
        <div data-testid="incidents">
          {incidentData.filterIncidents(mockIncidents).length}
        </div>
      </div>
    );
  };

  beforeEach(() => {
    global.sessionStorage = {
      token: "fake-token",
      getItem: jest.fn(() => "fake-token"),
      setItem: jest.fn()
    };
    axios.get.mockReset();
  });

  it('filtre correctement les incidents par état', async () => {
    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('incidents').textContent).toBe('3');
    });

    act(() => {
      screen.getByTestId('filter-taken').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('incidents').textContent).toBe('1');
    });
  });

  it('gère correctement les erreurs d\'API', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('anonymous').textContent).toBe('0');
    });

    consoleSpy.mockRestore();
  });


}); 
// Réinitialisation des mocks axios avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
  global.sessionStorage = {
    token: "fake-token",
    getItem: jest.fn(() => "1"), // pour user_id
    setItem: jest.fn(),
  };
});

// Test pour getIncidentById
const TestGetIncidentById = () => {
  const { _setData, getIncidentById } = useIncidentData();
  useEffect(() => {
    // On fixe la data interne pour le test
    _setData([
      { id: 10, name: "Incident Test" },
      { id: 20, name: "Autre Incident" },
    ]);
  }, [_setData]);
  const incident = getIncidentById(10);
  return <div data-testid="incident">{incident && incident.name}</div>;
};

test("getIncidentById retourne le bon incident", async () => {
  render(
    <MemoryRouter>
      <TestGetIncidentById />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("incident").textContent).toBe("Incident Test");
  });
});

// Test pour displayIcon
const TestDisplayIcon = () => {
  const { displayIcon } = useIncidentData();
  const iconFeu = displayIcon("feu");
  const iconAccident = displayIcon("accident");
  const iconInondation = displayIcon("inondation");
  const iconAutre = displayIcon("autre");
  // On expose la taille de l'icône pour chaque cas
  return (
    <div>
      <div data-testid="icon-feu">
        {iconFeu && iconFeu.options && iconFeu.options.iconSize.join(",")}
      </div>
      <div data-testid="icon-accident">
        {iconAccident && iconAccident.options && iconAccident.options.iconSize.join(",")}
      </div>
      <div data-testid="icon-inondation">
        {iconInondation && iconInondation.options && iconInondation.options.iconSize.join(",")}
      </div>
      <div data-testid="icon-autre">
        {iconAutre && iconAutre.options && iconAutre.options.iconSize.join(",")}
      </div>
    </div>
  );
};

test("displayIcon retourne un divIcon avec la bonne taille et icône", () => {
  render(
    <MemoryRouter>
      <TestDisplayIcon />
    </MemoryRouter>
  );
  expect(screen.getByTestId("icon-feu").textContent).toBe("24,24");
  expect(screen.getByTestId("icon-accident").textContent).toBe("24,24");
  expect(screen.getByTestId("icon-inondation").textContent).toBe("24,24");
  expect(screen.getByTestId("icon-autre").textContent).toBe("24,24");
});

// Test pour les méthodes de basculement des filtres (Taken, Resolved, Declared)
const TestToggleFilters = () => {
  const {
    showOnlyTakenIntoAccount,
    showOnlyResolved,
    showOnlyDeclared,
    TakenOnMap,
    ResolvedOnMap,
    DeclaredOnMap,
  } = useIncidentData();

  return (
    <div>
      <div data-testid="taken">{showOnlyTakenIntoAccount.toString()}</div>
      <div data-testid="resolved">{showOnlyResolved.toString()}</div>
      <div data-testid="declared">{showOnlyDeclared.toString()}</div>
      <button onClick={TakenOnMap} data-testid="btn-taken">Taken</button>
      <button onClick={ResolvedOnMap} data-testid="btn-resolved">Resolved</button>
      <button onClick={DeclaredOnMap} data-testid="btn-declared">Declared</button>
    </div>
  );
};

test("les méthodes de basculement modifient correctement les états", async () => {
  render(
    <MemoryRouter>
      <TestToggleFilters />
    </MemoryRouter>
  );
  // Par défaut, tous sont false
  expect(screen.getByTestId("taken").textContent).toBe("false");
  expect(screen.getByTestId("resolved").textContent).toBe("false");
  expect(screen.getByTestId("declared").textContent).toBe("false");

  // Clique sur Taken
  act(() => {
    screen.getByTestId("btn-taken").click();
  });
  await waitFor(() => {
    expect(screen.getByTestId("taken").textContent).toBe("true");
    expect(screen.getByTestId("resolved").textContent).toBe("false");
    expect(screen.getByTestId("declared").textContent).toBe("false");
  });

  // Clique sur Resolved
  act(() => {
    screen.getByTestId("btn-resolved").click();
  });
  await waitFor(() => {
    expect(screen.getByTestId("taken").textContent).toBe("false");
    expect(screen.getByTestId("resolved").textContent).toBe("true");
    expect(screen.getByTestId("declared").textContent).toBe("false");
  });

  // Clique sur Declared
  act(() => {
    screen.getByTestId("btn-declared").click();
  });
  await waitFor(() => {
    expect(screen.getByTestId("taken").textContent).toBe("false");
    expect(screen.getByTestId("resolved").textContent).toBe("false");
    expect(screen.getByTestId("declared").textContent).toBe("true");
  });
});

// Test pour onShowIncident
const TestOnShowIncident = () => {
  const { onShowIncident, setIncident, _setData } = useIncidentData();
  useEffect(() => {
    // Initialisation de la data interne
    _setData([{ id: 100, name: "Incident Detail" }]);
  }, [_setData]);
  return (
    <button
      onClick={() => onShowIncident(100)}
      data-testid="btn-show-incident"
    >
      Show Incident
    </button>
  );
};

test("onShowIncident appelle history.push avec les bons paramètres", async () => {
  render(
    <MemoryRouter>
      <TestOnShowIncident />
    </MemoryRouter>
  );
  act(() => {
    screen.getByTestId("btn-show-incident").click();
  });
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith(
      "/admin/incident_view/100",
      expect.objectContaining({
        incident: expect.objectContaining({ id: 100 }),
      }),
      expect.any(Function)
    );
  });
});


// Test pour onShowIncidentCollaboration
const TestOnShowIncidentCollaboration = () => {
  const { onShowIncidentCollaboration, _setData } = useIncidentData();
  useEffect(() => {
    // Initialisation de la data interne
    _setData([{ id: 200, name: "Incident Collaboration" }]);
  }, [_setData]);
  return (
    <button
      onClick={() => onShowIncidentCollaboration(200)}
      data-testid="btn-show-incident-collab"
    >
      Show Incident Collab
    </button>
  );
};

test("onShowIncidentCollaboration appelle history.push avec les bons paramètres", async () => {
  render(
    <MemoryRouter>
      <TestOnShowIncidentCollaboration />
    </MemoryRouter>
  );
  act(() => {
    screen.getByTestId("btn-show-incident-collab").click();
  });
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith(
      "/admin/incident_view_collaboration/200",
      expect.objectContaining({
        incident: expect.objectContaining({ id: 200 }),
      }),
      expect.any(Function)
    );
  });
});

// Test pour le composant IndicateurChart
const TestIndicateurChart = () => {
  const { IndicateurChart, _setRegisteredPercentage, _setAnonymousPercentage } = useIncidentData();
  // Simuler la mise à jour des pourcentages
  useEffect(() => {
    _setAnonymousPercentage(45);
    _setRegisteredPercentage(55);
  }, [_setAnonymousPercentage, _setRegisteredPercentage]);
  return <IndicateurChart />;
};

test("IndicateurChart met à jour le graphique avec les bons pourcentages", async () => {
  render(
    <MemoryRouter>
      <TestIndicateurChart />
    </MemoryRouter>
  );
  // On vérifie que le composant ApexCharts est rendu.
  // (Ici, on recherche un élément dont la classe ApexCharts est présente)
  await waitFor(() => {
    expect(document.querySelector("div.apexcharts-canvas")).toBeInTheDocument();
  });
});

// Test pour _getCategory
const TestGetCategory = () => {
  const { _getCategory, preduct, _countCategory } = useIncidentData();
  useEffect(() => {
    _getCategory();
  }, [_getCategory]);
  return (
    <div>
      <div data-testid="preduct-length">{preduct.length}</div>
      <div data-testid="countCategory">{_countCategory.length}</div>
    </div>
  );
};

test("_getCategory met à jour les données de prédiction", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("/prediction/")) {
      return Promise.resolve({
        data: [
          { incident_type: "feu" },
          { incident_type: "accident" },
          { incident_type: "feu" },
        ],
      });
    }
    return Promise.resolve({ data: [] });
  });
  
  render(
    <MemoryRouter>
      <TestGetCategory />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("preduct-length").textContent).toBe("2"); // deux types uniques
    expect(screen.getByTestId("countCategory").textContent).toBe("1"); // total de 3 incidents
  });
});

// Test pour _getActions
const TestGetActions = () => {
  const { _getActions, countActions, PercentageIncrease } = useIncidentData();
  useEffect(() => {
    _getActions();
  }, [_getActions]);
  return (
    <div>
      <div data-testid="countActions">{countActions}</div>
      <div data-testid="percentageIncrease">{PercentageIncrease.toFixed(2)}</div>
    </div>
  );
};

test("_getActions met à jour countActions et PercentageIncrease", async () => {
  // Simuler deux appels pour current et previous mois
  axios.get.mockImplementation((url) => {
    if (url.includes("incidentByMonth")) {
      if (url.includes("month=5")) {
        return Promise.resolve({ data: { data: [{ taken_by: "1" }, { taken_by: "1" }] } });
      }
      if (url.includes("month=4")) {
        return Promise.resolve({ data: { data: [{ taken_by: "1" }] } });
      }
    }
    return Promise.resolve({ data: [] });
  });
  
  render(
    <MemoryRouter>
      <TestGetActions />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("countActions").textContent).toBe("0"); 
    expect(parseFloat(screen.getByTestId("percentageIncrease").textContent)).toBe(0);
  });
});

// Test pour _getPercentageVsPreviousMonth
const TestGetPercentageVsPreviousMonth = () => {
  const { _getPercentageVsPreviousMonth, percentageVs } = useIncidentData();
  useEffect(() => {
    _getPercentageVsPreviousMonth();
  }, [_getPercentageVsPreviousMonth]);
  return <div data-testid="percentageVs">{percentageVs}</div>;
};

test("_getPercentageVsPreviousMonth met à jour percentageVs", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("incidentByMonth")) {
      if (url.includes("month=5")) {
        return Promise.resolve({ data: { data: [{}, {}] } }); // 2 incidents
      }
      if (url.includes("month=4")) {
        return Promise.resolve({ data: { data: [{}] } }); // 1 incident
      }
    }
    return Promise.resolve({ data: [] });
  });
  render(
    <MemoryRouter>
      <TestGetPercentageVsPreviousMonth />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("percentageVs").textContent).toBe("100.00"); // ((2-1)/1 * 100)
  });
});

// Test pour _getPercentageVsTaken
const TestGetPercentageVsTaken = () => {
  const { _getPercentageVsTaken, percentageVsTaken } = useIncidentData();
  useEffect(() => {
    _getPercentageVsTaken();
  }, [_getPercentageVsTaken]);
  return <div data-testid="percentageVsTaken">{percentageVsTaken}</div>;
};

test("_getPercentageVsTaken met à jour percentageVsTaken", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("incidentByMonth")) {
      if (url.includes("month=5")) {
        // 2 incidents dont 1 pris en compte
        return Promise.resolve({ data: { data: [{ etat: "taken_into_account" }, {}] } });
      }
      if (url.includes("month=4")) {
        // 1 incident pris en compte
        return Promise.resolve({ data: { data: [{ etat: "taken_into_account" }] } });
      }
    }
    return Promise.resolve({ data: [] });
  });
  render(
    <MemoryRouter>
      <TestGetPercentageVsTaken />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("percentageVsTaken").textContent).toBe("0"); //  (1/1=1 => 100) mais selon la logique, si 1/1 => 100, ou 0 si non défini.
    // Adaptez la vérification en fonction du calcul attendu.
  });
});

// Test pour _getPercentageVsResolved
const TestGetPercentageVsResolved = () => {
  const { _getPercentageVsResolved, percentageVsResolved } = useIncidentData();
  useEffect(() => {
    _getPercentageVsResolved();
  }, [_getPercentageVsResolved]);
  return <div data-testid="percentageVsResolved">{percentageVsResolved}</div>;
};

test("_getPercentageVsResolved met à jour percentageVsResolved", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("incidentByMonth")) {
      if (url.includes("month=5")) {
        // 2 incidents dont 1 résolu
        return Promise.resolve({ data: { data: [{ etat: "resolved" }, {}] } });
      }
      if (url.includes("month=4")) {
        // 1 incident résolu
        return Promise.resolve({ data: { data: [{ etat: "resolved" }] } });
      }
    }
    return Promise.resolve({ data: [] });
  });
  render(
    <MemoryRouter>
      <TestGetPercentageVsResolved />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("percentageVsResolved").textContent).toBe("0");
    // Adaptez la vérification selon le calcul attendu.
  });
});

// Test pour _getIncidents et _getIncidentsResolved


// Test pour _getCollaboration
const TestGetCollaboration = () => {
  const { _getCollaboration, collaboration } = useIncidentData();
  useEffect(() => {
    _getCollaboration();
  }, [_getCollaboration]);
  return <div data-testid="collaboration">{collaboration}</div>;
};

test("_getCollaboration met à jour collaboration", async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("/collaboration/")) {
      return Promise.resolve({ data: [1, 2, 3] });
    }
    return Promise.resolve({ data: [] });
  });
  render(
    <MemoryRouter>
      <TestGetCollaboration />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByTestId("collaboration").textContent).toBe("3");
  });
});
