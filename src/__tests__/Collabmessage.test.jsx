import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import CollaborationChat from "./CollaborationChat";
import axios from "axios";
const { ChakraProvider } = require('@chakra-ui/react');
import CollaborationChat from "views/Dashboard/CollaborationChat";

jest.mock("axios");

// Simuler sessionStorage
beforeEach(() => {
  sessionStorage.setItem("token", "fake-token");
  sessionStorage.setItem("user_id", "1");
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockMessages = [
  {
    id: 1,
    message: "Bonjour",
    created_at: new Date().toISOString(),
    sender: { id: 2, first_name: "Jean", organisation: "Org A" },
  },
  {
    id: 2,
    message: "Salut !",
    created_at: new Date().toISOString(),
    sender: { id: 1, first_name: "Moi", organisation: "" },
  },
];

const renderComponent = (props = {}) => {
  return render(
    <ChakraProvider>
      <CollaborationChat
        incidentId={123}
        apiUrl="http://fake-api.com"
        onBack={jest.fn()}
        {...props}
      />
    </ChakraProvider>
  );
};

test("affiche le spinner de chargement et les messages", async () => {
  axios.get
    .mockResolvedValueOnce({ data: { etat: "open" } }) // fetchIncidentStatus
    .mockResolvedValueOnce({ data: mockMessages });    // fetchMessages

  renderComponent();

  expect(screen.getByText(/Discussion de l'incident #123/i)).toBeInTheDocument();
  expect(screen.getByRole("progressbar")).toBeInTheDocument(); // Spinner

  // Attendre que les messages soient affichés
  await waitFor(() => {
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText("Salut !")).toBeInTheDocument();
  });
});

test("permet d’écrire et d’envoyer un message", async () => {
  axios.get
    .mockResolvedValueOnce({ data: { etat: "open" } })
    .mockResolvedValueOnce({ data: [] });

  axios.post.mockResolvedValueOnce({
    data: {
      id: 3,
      message: "Nouveau message",
      created_at: new Date().toISOString(),
      sender: { id: 1, first_name: "Moi", organisation: "" },
    },
  });

  renderComponent();

  await waitFor(() => {
    expect(screen.getByPlaceholderText("Écrire un message...")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByPlaceholderText("Écrire un message..."), {
    target: { value: "Nouveau message" },
  });

  fireEvent.click(screen.getByText("Envoyer"));

  await waitFor(() => {
    expect(screen.getByText("Nouveau message")).toBeInTheDocument();
  });
});
