// Ajout d'un polyfill pour la méthode scroll()
HTMLElement.prototype.scroll = function() {};

const React = require('react');
const { render, screen, fireEvent, waitFor, act } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const { MemoryRouter, Route } = require('react-router-dom');
const axios = require('axios');
const Chat = require('../views/Dashboard/LLM_Chat').default;

// Mock des dépendances
jest.mock('axios');
jest.mock('marked', () => ({
  marked: (text) => text
}));
jest.mock('dompurify', () => ({
  sanitize: (content) => content
}));

// Mock de WebSocket
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  readyState: WebSocket.OPEN
};
const mockWebSocketInstance = {
  send: jest.fn(),
  close: jest.fn(),
  readyState: WebSocket.OPEN,
  addEventListener: jest.fn((event, callback) => {
    if (event === 'message') {
      callback({ data: JSON.stringify({ answer: 'Test response' }) });
    }
  }),
  removeEventListener: jest.fn()
};
global.WebSocket = jest.fn(() => mockWebSocketInstance);
// global.WebSocket = jest.fn(() => ({
//   ...mockWebSocket,
//   addEventListener: jest.fn((event, callback) => {
//     if (event === 'message') {
//       callback({ data: JSON.stringify({ answer: 'Test response' }) });
//     }
//   }),
//   removeEventListener: jest.fn()
// }));

describe('Chat Component', () => {
  const renderWithProviders = (component) => {
    return render(
      <MemoryRouter initialEntries={['/chat/1/2']}>
        <Route path="/chat/:incidentId/:userId">
          <ChakraProvider>
            {component}
          </ChakraProvider>
        </Route>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({
      data: [
        {
          question: "Test question",
          answer: "Test answer"
        }
      ]
    });
  });

  it('établit une connexion WebSocket', async () => {
    renderWithProviders(<Chat />);
    expect(global.WebSocket).toHaveBeenCalled();
  });

  it('charge l\'historique du chat', async () => {
    const mockHistory = [
      { question: 'Test question', answer: 'Test answer' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockHistory });

    renderWithProviders(<Chat />);

    await waitFor(() => {
      expect(screen.getByText('Test question')).toBeInTheDocument();
      expect(screen.getByText('Test answer')).toBeInTheDocument();
    });
  });

  it('envoie un message', async () => {
    renderWithProviders(<Chat />);

    const input = screen.getByPlaceholderText('Chat message ...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    const sendButton = screen.getByLabelText('Send Message');
    fireEvent.click(sendButton);

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      expect.stringContaining('Hello')
    );
  });

  it('gère la réinitialisation du chat', async () => {
    renderWithProviders(<Chat />);

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      expect.stringContaining('delete_chat')
    );
  });

  it('gère l\'arrêt de la frappe', async () => {
    renderWithProviders(<Chat />);

    // Simuler un message en cours
    act(() => {
      const wsMessage = new MessageEvent('message', {
        data: JSON.stringify({ answer: 'Test typing...' })
      });
      global.WebSocket.mock.instances[0].onmessage(wsMessage);
    });

    const stopButton = screen.getByLabelText('Stop typing');
    fireEvent.click(stopButton);

    expect(screen.getByText('Test typing...')).toBeInTheDocument();
  });

  it('gère les erreurs de chargement de l\'historique', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Failed to load history'));

    renderWithProviders(<Chat />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('gère la déconnexion WebSocket', () => {
    const { unmount } = renderWithProviders(<Chat />);
    unmount();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('envoie un message avec la touche Enter', () => {
    renderWithProviders(<Chat />);

    const input = screen.getByPlaceholderText('Chat message ...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockWebSocket.send).toHaveBeenCalled();
  });
}); 