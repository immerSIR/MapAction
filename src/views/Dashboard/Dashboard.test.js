import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard"; // Adjust path accordingly
import { useIncidentData } from "Fonctions/Dash_fonction";
import { useMonth } from "Fonctions/Month";

// Mock the useIncidentData hook
jest.mock("../../Fonctions/Dash_fonction", () => ({
  useIncidentDataa: jest.fn(),
}));

// Mock the useMonth hook
jest.mock("../../Fonctions/Month", () => ({
  useMonth: jest.fn(),
}));

describe("Dashboard Component", () => {
  const mockIncidentData = {
    countIncidents: 100,
    percentageVs: 20,
    taken: 50,
    percentageVsTaken: 10,
    resolus: 40,
    percentageVsResolved: 5,
    _getIncidents: jest.fn(),
    _getIncidentsResolved: jest.fn(),
    _getAnonymous: jest.fn(),
    _getRegistered: jest.fn(),
    _getPercentage: jest.fn(),
    _getPercentageVsPreviousMonth: jest.fn(),
    _getPercentageVsTaken: jest.fn(),
    _getPercentageVsResolved: jest.fn(),
    _getCategory: jest.fn(),
    _getZone: jest.fn(),
    filterIncidents: jest.fn(),
    displayIcon: jest.fn(),
    chartRef: jest.fn(),
    IndicateurChart: jest.fn(),
    TakenOnMap: jest.fn(),
    DeclaredOnMap: jest.fn(),
    ResolvedOnMap: jest.fn(),
    PercentageIncrease: jest.fn(),
  };

  beforeEach(() => {
    useIncidentData.mockReturnValue(mockIncidentData);
    useMonth.mockReturnValue({ selectedMonth: "October" });
  });

  it("renders the Dashboard component", async () => {
    render(<Dashboard />);

    // Check if some static text exists on the page
    expect(screen.getByText("Nombre d'incidents")).toBeInTheDocument();
    expect(screen.getByText("Pourcentage pris en compte")).toBeInTheDocument();
    expect(screen.getByText("Pourcentage résolu")).toBeInTheDocument();

    // Wait for the data to be fetched and ensure some dynamic data is rendered
    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument(); // Check countIncidents
      expect(screen.getByText("50%")).toBeInTheDocument(); // Check taken %
    });
  });

  it("triggers the correct methods when map is clicked", () => {
    render(<Dashboard />);

    // Find and click the "Incidents pris en compte par" card
    const card = screen.getByText("Incidents pris en compte par");
    fireEvent.click(card);

    // Ensure the TakenOnMap method is called
    expect(mockIncidentData.TakenOnMap).toHaveBeenCalled();
  });

  it("calls _getIndicateur when data is fetched", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      // Check if _getIndicateur is called
      expect(mockIncidentData._getIndicateur).toHaveBeenCalled();
    });
  });

  it("should render the interactive map", () => {
    render(<Dashboard />);

    // Ensure the map component is rendered (Carte component)
    const mapElement = screen.getByTestId("map"); // Assuming you can add a test ID to the map component
    expect(mapElement).toBeInTheDocument();
  });
});
