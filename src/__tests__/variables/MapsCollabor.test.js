// Carte.test.js
import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Carte from "../../variables/MapsCollabor"; // Ajustez le chemin selon votre organisation
import axios from "axios";

// Mocker axios
// Carte.test.js


// Mocker axios
jest.mock("axios");

// Mocker le module de configuration pour utiliser une URL fictive
jest.mock("config", () => ({
  config: {
    url: "http://fakeapi.com",
  },
}));

// Mocker les hooks pour le filtre et le mois
jest.mock("Fonctions/YearMonth", () => ({
  useDateFilter: () => ({
    filterType: "default",
    customRange: [{ startDate: new Date("2020-01-01"), endDate: new Date("2020-01-02") }],
  }),
}));

jest.mock("Fonctions/Month", () => ({
  useMonth: () => ({
    selectedMonth: "2020-01", // valeur arbitraire
  }),
}));

// Données d'exemple pour un incident et l'utilisateur associé
const sampleIncident = {
  id: 1,
  lattitude: 16.2833,
  longitude: -3.0833,
  title: "Incident 1",
  description: "Description de l'incident 1",
  etat: "taken_into_account",
  photo: "/photo1.jpg",
  video: "/video1.mp4",
  audio: "/audio1.mp3",
  taken_by: 123,
};

const sampleUser = {
  avatar: "/avatar1.jpg",
  organisation: "Organisation 1",
};

describe("Carte component", () => {
  beforeEach(() => {
    // Simuler la présence d'un token dans sessionStorage
    sessionStorage.setItem("token", "fake-token");
    axios.get.mockReset();
  });

  test("affiche les marqueurs et déclenche onShowIncident lors du clic", async () => {
    // Mocker l'appel pour récupérer la liste des incidents
    axios.get.mockImplementation((url) => {
      if (url.includes("/MapApi/incident-filter/")) {
        return Promise.resolve({ data: [sampleIncident] });
      }
      // Mocker l'appel pour récupérer l'utilisateur associé à l'incident
      if (url.includes(`/MapApi/user/${sampleIncident.taken_by}/`)) {
        return Promise.resolve({ data: sampleUser });
      }
      return Promise.reject(new Error(`URL inattendue: ${url}`));
    });

    // Création d'une fonction factice pour le callback
    const onShowIncident = jest.fn();

    // Rendu du composant Carte
    const { container } = render(<Carte onShowIncident={onShowIncident} />);

    // Attendre que le marqueur soit rendu
    await waitFor(() => {
      const marker = container.querySelector(".leaflet-marker-icon");
      expect(marker).toBeInTheDocument();
    });

    // Simuler un clic sur le marqueur pour ouvrir le popup
    const marker = container.querySelector(".leaflet-marker-icon");
    fireEvent.click(marker);

    // Attendre que le popup soit ouvert et que le bouton apparaisse
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Voir l'incident/i });
      expect(button).toBeInTheDocument();
    });

    // Récupérer toutes les images du popup (les deux images ayant le même alt "Organization")
    const images = screen.getAllByAltText("Organization");
    expect(images.length).toBeGreaterThanOrEqual(2);
    
    // Vérifier que l'image correspondant à la photo de l'incident est présente
    expect(images[0]).toHaveAttribute("src", "http://fakeapi.com" + sampleIncident.photo);
    // Vérifier que l'image correspondant à la photo de l'organisation (avatar) est présente
    expect(images[1]).toHaveAttribute("src", "http://fakeapi.com" + sampleUser.avatar);

    // Récupérer le bouton via son rôle et aria-label et simuler un clic dessus
    const button = screen.getByRole("button", { name: /Voir l'incident/i });
    fireEvent.click(button);
    expect(onShowIncident).toHaveBeenCalledWith(sampleIncident.id);
  });
});
