import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CollaborationList from 'views/Dashboard/ListeCollab';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
import { config } from 'config';

// Mock AuthContext
jest.mock('context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 123 },
  }),
}));

// const mock = new MockAdapter(axios);
jest.mock('axios');
const renderWithProviders = (ui) => render(<ChakraProvider>{ui}</ChakraProvider>);

beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        token: 'fake-token',
        getItem: jest.fn(() => 'fake-token'),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

const mockCollaborations = [
  {
    id: 1,
    status: 'accepted',
    incident: {
      id: 101,
      title: 'Panne réseau',
    },
  },
  {
    id: 2,
    status: 'pending',
    incident: {
      id: 102,
      title: 'Incident électricité',
    },
  },
];

test('affiche les collaborations et permet d’ouvrir une discussion', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockCollaborations }));


  renderWithProviders(<CollaborationList />);

  // Attente du spinner puis affichage du contenu
//   expect(screen.getByRole('progressbar')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Panne réseau')).toBeInTheDocument();
    expect(screen.getByText('Incident électricité')).toBeInTheDocument();
  });

  // Test bouton "Ouvrir discussion" sur une collaboration acceptée
  fireEvent.click(screen.getAllByText('Ouvrir discussion')[0]);

  await waitFor(() => {
    expect(screen.getByText(/discussion/i)).toBeInTheDocument(); // CollaborationChat devrait s'afficher
  });
});

test('bloque l’ouverture de discussion si non acceptée', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: mockCollaborations }));


  renderWithProviders(<CollaborationList />);

  await waitFor(() => {
    expect(screen.getByText('Incident électricité')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId('open-chat-1'));

  

  // Le composant CollaborationChat ne doit pas s’afficher
  expect(screen.queryByText(/discussion/i)).not.toBeInTheDocument();
});
