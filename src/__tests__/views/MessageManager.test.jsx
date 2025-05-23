jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MessageManager from 'views/Dashboard/MessageManager';
import axios from 'axios';
import { ChakraProvider } from '@chakra-ui/react';
import Swal from 'sweetalert2';

jest.mock('axios');

const mockMessages = {
  results: [
    {
      id: 1,
      objet: 'Sujet Test',
      message: 'Contenu du message',
      created_at: new Date().toISOString(),
    },
  ],
};

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

const renderWithChakra = (ui) => render(<ChakraProvider>{ui}</ChakraProvider>);

test('affiche le tableau des messages après chargement', async () => {
  axios.get.mockResolvedValueOnce({ data: mockMessages });

  renderWithChakra(<MessageManager />);

  expect(screen.getByText(/gestion des messages/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Sujet Test')).toBeInTheDocument();
    expect(screen.getByText('Contenu du message')).toBeInTheDocument();
  });
});

test('affiche un message d’erreur si la récupération échoue', async () => {
  axios.get.mockRejectedValueOnce(new Error('Erreur réseau'));

  // Supprime SweetAlert (Swal.fire) s'il est utilisé
  jest.spyOn(global.console, 'error').mockImplementation(() => {});

  renderWithChakra(<MessageManager />);

  await waitFor(() => {
    expect(console.error).toHaveBeenCalled();
  });
});

test('ouvre la modale de lecture en cliquant sur "Lire"', async () => {
  axios.get.mockResolvedValueOnce({ data: mockMessages });

  renderWithChakra(<MessageManager />);

  await waitFor(() => screen.getByText('Lire'));

  fireEvent.click(screen.getByText('Lire'));

  expect(await screen.findByText('Lire le message')).toBeInTheDocument();
  expect(screen.getByText('Sujet :')).toBeInTheDocument();
  expect(screen.getByText('Contenu :')).toBeInTheDocument();
});

test('ouvre la modale de réponse en cliquant sur "Répondre"', async () => {
  axios.get.mockResolvedValueOnce({ data: mockMessages });

  renderWithChakra(<MessageManager />);

  await waitFor(() => screen.getByText('Répondre'));

  fireEvent.click(screen.getByText('Répondre'));

  expect(await screen.findByText('Répondre au message')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Votre réponse')).toBeInTheDocument();
});

test('modifie la valeur du champ réponse', async () => {
  axios.get.mockResolvedValueOnce({ data: mockMessages });

  renderWithChakra(<MessageManager />);

  await waitFor(() => screen.getByText('Répondre'));
  fireEvent.click(screen.getByText('Répondre'));

  const textarea = await screen.findByPlaceholderText('Votre réponse');
  fireEvent.change(textarea, { target: { value: 'Nouvelle réponse' } });

  expect(textarea.value).toBe('Nouvelle réponse');
});

test('supprime un message après confirmation', async () => {
  
  axios.get.mockResolvedValueOnce({ data: mockMessages });
  axios.delete.mockResolvedValueOnce({});
  axios.get.mockResolvedValueOnce({ data: [] });
  Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
  renderWithChakra(<MessageManager />);
  const supprimerButton = await screen.findByText('Supprimer');
  fireEvent.click(supprimerButton);
  await waitFor(() => {
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/MapApi/message/1'),
      expect.anything()
    );
  });
});

test('affiche une erreur si la suppression échoue', async () => {
  axios.get.mockResolvedValueOnce({ data: mockMessages });
  axios.delete.mockRejectedValueOnce(new Error('Suppression échouée'));
  Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
  jest.spyOn(global.console, 'error').mockImplementation(() => {});
  renderWithChakra(<MessageManager />);

  await waitFor(() => screen.getByText('Supprimer'));
  fireEvent.click(screen.getByText('Supprimer'));

  await waitFor(() => {
    expect(console.error).toHaveBeenCalled();
  });
});

test('envoie une réponse correctement', async () => {
  axios.get.mockResolvedValueOnce({ data: mockMessages });
  axios.post.mockResolvedValueOnce({});

  renderWithChakra(<MessageManager />);

  await waitFor(() => screen.getByText('Répondre'));
  fireEvent.click(screen.getByText('Répondre'));

  const textarea = await screen.findByPlaceholderText('Votre réponse');
  fireEvent.change(textarea, { target: { value: 'Ma réponse' } });

  fireEvent.click(screen.getByText('Envoyer'));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/MapApi/response_msg/'),
      expect.objectContaining({ response: 'Ma réponse' }),
      expect.anything()
    );
  });
});

