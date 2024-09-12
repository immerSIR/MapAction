import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { config } from "config";

function Chat() {
    let { incidentId, userId } = useParams();
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const chatContainerRef = useRef(null);

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN && message.trim() !== "") {
            const messageToSend = {
                incident_id: incidentId.toString(),
                session_id: userId.toString(),
                question: message,
            };
            ws.send(JSON.stringify(messageToSend));
            setChatMessages((prevMessages) => [
                ...prevMessages,
                { role: "user", content: message },
            ]);
            setMessage("");
        }
    };

    const getChatHistory = async () => {
        try {
            const chatHistory = await axios.get(
                `${config.url}/MapApi/history/${userId + incidentId}`
            );
            const formattedHistory = chatHistory.data.flatMap((item) => [
                { role: "user", content: item.question },
                { role: "assistant", content: item.answer },
            ]);
            setChatMessages(formattedHistory);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    useEffect(() => {
        const websocket = new WebSocket("ws://57.153.185.160:8001/ws/chat");

        const connectWebSocket = () => {
            console.log("WebSocket Connected");
            setWs(websocket);
        };

        const closeWebSocket = () => {
            console.log("WebSocket Disconnected");
            setTimeout(() => {
                if (
                    [WebSocket.CLOSED, WebSocket.CLOSING].includes(
                        websocket.readyState
                    )
                ) {
                    console.log("Reconnecting WebSocket...");
                    setWs(new WebSocket("ws://57.153.185.160:8001/ws/chat"));
                }
            }, 3000);
        };

        websocket.onopen = connectWebSocket;
        getChatHistory();
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data : ", data);
            setChatMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.answer },
            ]);
        };
        websocket.onclose = closeWebSocket;
        websocket.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };

        return () => {
            websocket.close();
        };
    }, [incidentId, userId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    return (
        <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
            <Box className="container" p={4}>
                <Text fontSize="2xl" mb={4}>
                    MapChat
                </Text>
                <Box
                    ref={chatContainerRef}
                    className="chat-container"
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    maxH="400px"
                    overflowY="auto"
                >
                    <VStack spacing={4} align="stretch">
                        {chatMessages.map((msg, index) => (
                            <Box
                                key={index}
                                alignSelf={
                                    msg.role === "user"
                                        ? "flex-end"
                                        : "flex-start"
                                }
                                bg={
                                    msg.role === "user"
                                        ? "blue.100"
                                        : "gray.100"
                                }
                                p={2}
                                borderRadius="md"
                                maxW="70%"
                            >
                                <Text fontWeight="bold">
                                    {msg.role === "user" ? "Vous:" : "MapChat:"}
                                </Text>
                                <Text>{msg.content}</Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>
                <Flex className="input-chat-container" mt={4}>
                    <Input
                        className="input-chat"
                        type="text"
                        placeholder="Chat message ..."
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        mr={2}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                    />
                    <Button
                        className="submit-chat"
                        onClick={sendMessage}
                        isDisabled={
                            !ws ||
                            ws.readyState !== WebSocket.OPEN ||
                            message.trim() === ""
                        }
                    >
                        Send
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}

export default Chat;
