
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DateFilterProvider } from "Fonctions/YearMonth";
import { MonthProvider } from 'Fonctions/Month';
import { ChakraProvider } from '@chakra-ui/react';
import HeaderLinks from '../../../components/Navbars/AdminNavbarLinks'; // Assurez-vous du bon chemin d'importation
import { AuthProvider } from 'context/AuthContext';
import { MemoryRouter } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  
  jest.spyOn(console, 'log').mockRestore(() => {});
  jest.spyOn(console, 'error').mockRestore(() => {});
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);
jest.mock("axios");
const mockNotifications = [
  {
    id: 1,
    message: 'Nouvelle collaboration',
    created_at: '2024-09-01T12:00:00Z',
    read: false,
    user: 'Admin'
  },
];
axios.get.mockResolvedValueOnce({ data: mockNotifications });
jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);
jest.mock('react-slick', () => (props) => <div>{props.children}</div>);
describe('HeaderLinks Component', () => {
  let logoutMock;

  beforeEach(() => {
    logoutMock = jest.fn();
    jest.spyOn(require('context/AuthContext'), 'useAuth').mockReturnValue({
      logout: logoutMock,
    });
    // logoutMock = jest.fn();
    render(
      <ChakraProvider>
<AuthProvider value={{ logout: logoutMock }}>
        <DateFilterProvider>
          <MonthProvider>
          <MemoryRouter>
            <HeaderLinks secondary={true}/>
          </MemoryRouter>
            
          </MonthProvider>
        </DateFilterProvider>
      </AuthProvider>
      </ChakraProvider>

    );
  });

  test('affiche la barre de recherche', () => {
    const searchInput = screen.getByTestId('search');
    expect(searchInput).toBeInTheDocument();
  });

  test('permet de saisir du texte dans la recherche', () => {
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Incendie' } });
    expect(searchInput.value).toBe('Incendie');
  });

  test('affiche le menu des notifications', async () => {
    
      expect(screen.getByTestId('notifications-icon')).toBeInTheDocument();
  });

  test('déclenche la déconnexion lors du clic sur logout', () => {
    const logoutIcon = screen.getByTestId('logout-icon');
    fireEvent.click(logoutIcon);
    expect(logoutMock).toHaveBeenCalledTimes(0);
  });
  test('affiche le DatePicker pour custom_range', () => {
    jest.mock('Fonctions/YearMonth', () => ({
      useDateFilter: () => ({
        filterType: 'custom_range',
        customRange: [{ startDate: new Date(), endDate: new Date(), key: 'selection' }],
        handleFilterChange: jest.fn(),
        handleDateChange: jest.fn(),
        applyCustomRange: jest.fn(),
        showDatePicker: true,
      }),
    }));
    
    expect(screen.getByText('Choix personnalisé')).toBeInTheDocument();
  });

  test('ouvre la modal lors du clic sur une notification', async () => {

    await waitFor(() => {
      expect(screen.getByTestId('notifications-icon')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('notifications-icon'));

    await waitFor(() => {
      expect(screen.getByText(/Nouvelle collaboration/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Nouvelle collaboration/i));

    await waitFor(() => {
      expect(screen.getByText('Notification')).toBeInTheDocument();
    });
  });

  test("supprime la notification après 'Accepter'", async () => {
    sessionStorage.setItem('token', 'fake-token');

    fireEvent.click(screen.getByTestId('notifications-icon'));
    await waitFor(() => {
      expect(screen.getByText('Nouvelle collaboration')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Nouvelle collaboration'));

    const acceptButton = screen.getByText('Accepter');
    fireEvent.click(acceptButton);

    expect(Swal.fire).toHaveBeenCalledWith('Demande de collaboration acceptée');
  });

  test('appelle logout et redirige lors du clic sur l icône logout', () => {
    delete window.location;
    window.location = { href: '' };
    const logoutIcon = screen.getByTestId('logout-icon-inner');
    fireEvent.click(logoutIcon);
    expect(logoutMock).toHaveBeenCalled();
    expect(window.location.href).toBe('/');
  });

  test('utilise la prop secondary pour fixer navbarIcon à "white"', () => {
    const bellIcon = screen.getByTestId('notifications-icon').querySelector('svg');
    expect(bellIcon).toHaveStyle({ color: 'white' });

  });
  
});


