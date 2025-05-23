import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordPage from 'views/Pages/ResetPassWord';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider, useToast } from '@chakra-ui/react';

// Mock Axios
jest.mock('axios');

// Mock useToast
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: () => mockToast,
  };
});

// Mock useHistory
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));

const renderComponent = () =>
  render(
    <ChakraProvider>
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    </ChakraProvider>
  );

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envoie un code de réinitialisation après saisie de l’email', async () => {
    axios.post.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.change(screen.getByLabelText(/adresse email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /envoyer le code/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/password/'),
        { email: 'test@example.com' }
      )
    );

    expect(
      await screen.findByLabelText(/code reçu par email/i)
    ).toBeInTheDocument();
  });

  it('réinitialise le mot de passe après saisie du code et des mots de passe', async () => {
    axios.post
      .mockResolvedValueOnce({}) // pour le code
      .mockResolvedValueOnce({}); // pour le reset

    renderComponent();

    // Étape 1 : envoi du code
    fireEvent.change(screen.getByLabelText(/adresse email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /envoyer le code/i }));

    // Attendre le passage à l'étape 2
    await screen.findByLabelText(/code reçu par email/i);

    // Étape 2 : reset
    fireEvent.change(screen.getByLabelText(/code reçu par email/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'newpass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'newpass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /réinitialiser le mot de passe/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/MapApi/reset_password/'),
        expect.objectContaining({
          email: 'test@example.com',
          code: '123456',
          new_password: 'newpass123',
          new_password_confirm: 'newpass123',
        })
      );
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Mot de passe réinitialisé',
        status: 'success',
      })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/signin/');
    });
  });

  it('affiche une erreur si l’email est invalide', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid email'));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/adresse email/i), {
      target: { value: 'bademail@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /envoyer le code/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    // Tu peux ajouter une assertion visuelle ici si tu veux rendre l'erreur visible dans le DOM
    // Par exemple avec une alerte Chakra si tu l’ajoutes dans le composant
  });

  it('affiche une erreur toast si le reset échoue', async () => {
    axios.post
      .mockResolvedValueOnce({}) // envoi du code
      .mockRejectedValueOnce(new Error('Reset failed')); // reset

    renderComponent();

    fireEvent.change(screen.getByLabelText(/adresse email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /envoyer le code/i }));

    await screen.findByLabelText(/code reçu par email/i);

    fireEvent.change(screen.getByLabelText(/code reçu par email/i), {
      target: { value: '0000' },
    });
    fireEvent.change(screen.getByLabelText(/nouveau mot de passe/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
      target: { value: 'abc123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /réinitialiser le mot de passe/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erreur',
          description: expect.stringContaining('réinitialisation'),
          status: 'error',
        })
      );
    });
  });
});
