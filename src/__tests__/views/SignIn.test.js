// SignIn.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../../views/Pages/SignIn";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "context/AuthContext";

// Mocker axios, sweetalert2 et le contexte Auth
jest.mock("axios");
jest.mock("sweetalert2");
jest.mock("context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("SignIn component", () => {
  beforeEach(() => {
    // Réinitialiser sessionStorage et les mocks
    sessionStorage.clear();
    jest.clearAllMocks();
    useAuth.mockReturnValue({ login: jest.fn() });
    // Pour pouvoir modifier window.location.href dans les tests
    delete window.location;
    window.location = { href: "" };
  });

  test("authentification réussie pour un utilisateur admin", async () => {
    const loginMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock });

    const fakeToken = "fake-token";
    const fakeUserData = {
      id: 1,
      first_name: "Admin",
      adress: "Test Address",
      user_type: "admin",
      organisation: "Test Org",
      password_reset_count: "1", // ici, pour admin, on ne déclenche pas le modal
    };

    // Simuler la réponse de la requête POST (login)
    axios.post.mockResolvedValueOnce({ data: { access: fakeToken } });
    // Simuler la réponse de la requête GET (récupération des informations utilisateur)
    axios.get.mockResolvedValueOnce({ data: { data: fakeUserData } });

    render(<SignIn />);

    // Remplir les champs email et mot de passe
    fireEvent.change(screen.getByPlaceholderText("Votre email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Votre mot de passe"), {
      target: { value: "password" },
    });

    // Cliquer sur le bouton "Se connecter"
    fireEvent.click(screen.getByText("Se connecter"));

    // Vérifier que la requête POST a été effectuée avec les bons paramètres
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/MapApi/login/"),
        { email: "admin@example.com", password: "password" }
      );
    });

    // Vérifier l'appel de la requête GET
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/MapApi/user_retrieve/"),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${fakeToken}` },
        })
      );
    });

    // Vérifier que sessionStorage contient bien les données
    expect(sessionStorage.getItem("token")).toBe(fakeToken);
    expect(sessionStorage.getItem("user")).toBe(JSON.stringify(fakeUserData));
    expect(sessionStorage.getItem("user_id")).toBe(String(fakeUserData.id));
    expect(sessionStorage.getItem("first_name")).toBe(fakeUserData.first_name);
    expect(sessionStorage.getItem("zone")).toBe(fakeUserData.adress);
    expect(sessionStorage.getItem("user_type")).toBe(fakeUserData.user_type);
    expect(sessionStorage.getItem("organisation")).toBe(fakeUserData.organisation);

    // Vérifier que la fonction login() a été appelée
    expect(loginMock).toHaveBeenCalled();

    // Vérifier la redirection pour un admin
    await waitFor(() => {
      expect(window.location.href).toBe("/dashboardAdmin");
    });
  });

  test("affiche une erreur en cas d'échec d'authentification", async () => {
    // Simuler une erreur lors de la requête POST
    axios.post.mockRejectedValueOnce(new Error("Login failed"));

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("Votre email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Votre mot de passe"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Se connecter"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    // Vérifier que le message d'erreur est affiché dans le composant
    await waitFor(() => {
      expect(
        screen.getByText("Login ou mot de passe incorrect! Veuillez réessayer.")
      ).toBeInTheDocument();
    });

    // Vérifier que Swal.fire est appelé avec le bon message
    expect(Swal.fire).toHaveBeenCalledWith(
      "Erreur",
      "Login ou mot de passe incorrect! Veuillez réessayer",
      "error"
    );
  });

  test("affiche le modal de changement de mot de passe pour un utilisateur elu et change le mot de passe", async () => {
    const loginMock = jest.fn();
    useAuth.mockReturnValue({ login: loginMock });

    const fakeToken = "fake-token";
    const fakeUserData = {
      id: 2,
      first_name: "Elu",
      adress: "Test Address",
      user_type: "elu",
      organisation: "Test Org",
      password_reset_count: "0", // pour un elu qui doit changer de mot de passe
    };

    // Simuler le login et la récupération de l'utilisateur
    axios.post.mockResolvedValueOnce({ data: { access: fakeToken } });
    axios.get.mockResolvedValueOnce({ data: { data: fakeUserData } });

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("Votre email"), {
      target: { value: "elu@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Votre mot de passe"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Se connecter"));

    // Le modal de changement de mot de passe doit s'ouvrir (titre du modal présent)
    await waitFor(() => {
      expect(screen.getByText("Changer le mot de passe")).toBeInTheDocument();
    });

    // Remplir les champs du modal pour le nouveau mot de passe
    fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), {
      target: { value: "newpass" },
    });

    // Simuler la requête PUT pour changer le mot de passe
    axios.put.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByText("Enregistrer"));

    // Vérifier que la requête PUT est effectuée avec les bons paramètres
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/MapApi/change_password/"),
        { old_password: "password", new_password: "newpass" },
        expect.objectContaining({
          headers: { Authorization: `Bearer ${fakeToken}` },
        })
      );
    });

    // Vérifier que Swal.fire affiche un message de succès
    expect(Swal.fire).toHaveBeenCalledWith(
      "Succès",
      "Mot de passe modifié avec succès",
      "success"
    );

    // Vérifier la redirection vers le dashboard elu
    await waitFor(() => {
      expect(window.location.href).toBe("/admin/elu-dashboard");
    });
  });
});
