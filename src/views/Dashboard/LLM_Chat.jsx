import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { config } from 'config';

function Chat() {
    let { incidentId, userId } = useParams();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatMessagesHistory, setChatMessagesHistory] = useState([]);
    const [ws, setWs] = useState(null);

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const messageToSend = {
                incident_id: incidentId.toString(),
                session_id: userId.toString(),
                question: message, // The message content you are sending
                answer: "" // Assuming you want to display the question as the message in the chat
            };
            ws.send(JSON.stringify(messageToSend));
            setChatMessages(prevMessages => [...prevMessages, messageToSend]); // Add the message to the chat display
            setMessage(''); // Clear the input after sending
        }
    };

    const getChatHistory = async () => {
        const chatHistory = await axios.get(`${config.url}/MapApi/history/${userId + incidentId}`);
        setChatMessagesHistory(chatHistory.data);
        console.log(chatHistory.data);
    }

    useEffect(() => {
        const websocket = new WebSocket('ws://0.0.0.0:8002/ws/chat');

        const connectWebSocket = () => {
            console.log('WebSocket Connected');
            setWs(websocket);
        };

        const closeWebSocket = () => {
            console.log('WebSocket Disconnected');
            setTimeout(() => {
                if ([WebSocket.CLOSED, WebSocket.CLOSING].includes(websocket.readyState)) {
                    console.log('Reconnecting WebSocket...');
                    setWs(new WebSocket('ws://0.0.0.0:8002/ws/chat'));
                }
            }, 3000); // Attempt to reconnect every 3 seconds
        };

        websocket.onopen = connectWebSocket;
        getChatHistory();
        websocket.onmessage = event => {
            const data = JSON.parse(event.data);
            console.log('Received data : ', data);
            setChatMessages(prev => [...prev, data]);
        };
        websocket.onclose = closeWebSocket;
        websocket.onerror = error => {
            console.error('WebSocket Error: ', error);
        };

        return () => {
            websocket.close();
        };
    }, []);

    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
            <Box className="container" p={4}>
            <Text fontSize="2xl" mb={4}>Map Action Chat</Text>
            <Box className="chat-container" p={4} border="1px" borderColor="gray.200" borderRadius="md" maxH="400px" overflowY="auto">
                <Box className="chat">
                    {chatMessagesHistory.map((value, index) => (
                        <Box key={index}>
                            <Box className="another-message-container" p={2} mb={2} bg="gray.100" borderRadius="md">
                                <Text fontWeight="bold">Vous:</Text>
                                <Text>{value.question}</Text>
                            </Box>
                            <Box className="my-message-container" p={2} mb={2} bg="blue.100" borderRadius="md">
                                <Text fontWeight="bold">MapChat:</Text>
                                <Text>{value.answer}</Text>
                            </Box>
                        </Box>
                    ))}

                    {chatMessages.map((value, index) => {
                        if (value.session_id === (userId + incidentId) && value.answer) {
                            return (
                                <Box key={index} className="my-message-container" p={2} mb={2} bg="blue.100" borderRadius="md">
                                    <Text fontWeight="bold">MapChat:</Text>
                                    <Text>{value.answer}</Text>
                                </Box>
                            );
                        } else {
                            return (
                                <Box key={index} className="another-message-container" p={2} mb={2} bg="gray.100" borderRadius="md">
                                    <Text fontWeight="bold">Vous:</Text>
                                    <Text>{value.question}</Text>
                                </Box>
                            );
                        }
                    })}
                </Box>
            </Box>
            <Flex className="input-chat-container" mt={4}>
                <Input
                    className="input-chat"
                    type="text"
                    placeholder="Chat message ..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    mr={2}
                />
                <Button
                    className="submit-chat"
                    onClick={sendMessage}
                    isDisabled={!ws || ws.readyState !== WebSocket.OPEN}
                >
                    Send
                </Button>
            </Flex>
        </Box>
        </Flex>
        
    );
}

export default Chat;
