import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Carte from "../../variables/maps"; // Ajustez le chemin selon votre organisation
import axios from "axios";

// Mocker axios
jest.mock("axios");

jest.mock("config", () => ({
  config: {
    url: "http://fakeapi.com",
  },
}));

jest.mock("Fonctions/YearMonth", () => ({
  useDateFilter: () => ({
    filterType: "default",
    customRange: [
      { startDate: new Date("2020-01-01"), endDate: new Date("2020-01-02") }
    ],
  }),
}));

jest.mock("Fonctions/Month", () => ({
  useMonth: () => ({
    selectedMonth: "2020-01",
  }),
}));


const sampleIncident = {
  id: 1,
  lattitude: 17.570692,
  longitude: -3.996166,
  title: "Incident Test",
  description: "Description Test",
  etat: "taken_into_account",
  photo: "/photo_test.jpg",
  video: "/video_test.mp4",
  audio: "/audio_test.mp3",
  orgPhoto: "/orgPhoto_test.jpg",
};

describe("Carte component", () => {
  beforeEach(() => {
    sessionStorage.setItem("token", "fake-token");
    axios.get.mockReset();
  });

  test("affiche les marqueurs et déclenche onShowIncident lors du clic", async () => {
    axios.get.mockResolvedValue({ data: [sampleIncident] });

    const onShowIncident = jest.fn();

    const { container } = render(
      <Carte
        onShowIncident={onShowIncident}
        showOnlyTakenIntoAccount={false}
        showOnlyResolved={false}
        showOnlyDeclared={false}
      />
    );

    await waitFor(() => {
      const marker = container.querySelector(".leaflet-marker-icon");
      expect(marker).toBeInTheDocument();
    });

    const marker = container.querySelector(".leaflet-marker-icon");
    fireEvent.click(marker);

    await waitFor(() => {
      expect(screen.getByText("Voir l'incident")).toBeInTheDocument();
    });
    const imgs = screen.getAllByAltText("image");
    expect(imgs.length).toBeGreaterThanOrEqual(2);
    // const imgs = container.querySelectorAll("img");
    // expect(imgs.length).toBeGreaterThanOrEqual(2);
    expect(imgs[0]).toHaveAttribute("src", "http://fakeapi.com" + sampleIncident.photo);
    expect(imgs[1]).toHaveAttribute("src", "http://fakeapi.com" + sampleIncident.orgPhoto);

    // Rechercher le bouton dans le popup via sa classe personnalisée
    const popupButton = container.querySelector("button.boutton.button--round-l");
    expect(popupButton).toBeInTheDocument();

    fireEvent.click(popupButton);
    expect(onShowIncident).toHaveBeenCalledWith(sampleIncident.id);
  });

  test("change le type de carte lorsque le bouton de basculement est cliqué", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Carte
        onShowIncident={() => {}}
        showOnlyTakenIntoAccount={false}
        showOnlyResolved={false}
        showOnlyDeclared={false}
      />
    );

    
    const toggleButton = screen.getByRole("button", {
      name: /Vue Satellite/i,
    });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Vue Standard/i })
      ).toBeInTheDocument();
    });
  });
});
