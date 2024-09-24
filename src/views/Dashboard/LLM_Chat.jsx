// src/views/Dashboard/LLM_Chat.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    VStack,
    IconButton,
} from "@chakra-ui/react";
import { ArrowForwardIcon, RepeatIcon, CloseIcon } from "@chakra-ui/icons";
import { config } from "config";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./Chat.css";
import Typewriter from "./Typewriter"; // Ensure this path is correct

function Chat() {
    const { incidentId, userId } = useParams();
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const chatContainerRef = useRef(null);

    // Track which message is currently being typed
    const [currentTypingId, setCurrentTypingId] = useState(null);

    // Function to scroll chat container to bottom
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scroll({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    // Function to send user messages
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
                { id: Date.now(), role: "user", content: message },
            ]);
            setMessage("");
            scrollToBottom(); // Scroll after sending a message
        }
    };

    // Function to delete chat history
    const deleteChatHistory = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const deleteRequest = {
                incident_id: incidentId.toString(),
                session_id: userId.toString(),
                action: "delete_chat",
            };
            ws.send(JSON.stringify(deleteRequest));
            setChatMessages([]); // Clear chat messages in the UI
        }
    };

    // Function to fetch chat history
    const getChatHistory = async () => {
        try {
            const chatHistory = await axios.get(
                `${config.url}/MapApi/history/${userId + incidentId}`
            );
            const formattedHistory = chatHistory.data.flatMap((item) => [
                {
                    id: Date.now() + Math.random(), // Unique ID for each message
                    role: "user",
                    content: item.question,
                },
                {
                    id: Date.now() + Math.random(),
                    role: "assistant",
                    content: item.answer,
                    isTyping: false, // Historical messages are fully rendered
                },
            ]);
            setChatMessages(formattedHistory);
            // Scroll to bottom after loading history
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // WebSocket setup
    useEffect(() => {
        const websocket = new WebSocket(
            "ws://57.153.185.160:8001/api1/ws/chat"
        );

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
                    setWs(
                        new WebSocket("ws://57.153.185.160:8001/api1/ws/chat")
                    );
                }
            }, 3000);
        };

        websocket.onopen = connectWebSocket;
        getChatHistory();
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);

            if (data.message === "Chat history deleted successfully.") {
                setChatMessages([]);
            } else {
                const newAssistantMessage = {
                    id: Date.now(), // Unique ID
                    role: "assistant",
                    content: data.answer,
                    isTyping: true, // Indicates that this message should use the Typewriter
                    isStopped: false, // Flag to indicate if typing has been stopped
                };
                setChatMessages((prev) => [...prev, newAssistantMessage]);
                setCurrentTypingId(newAssistantMessage.id);
            }
        };
        websocket.onclose = closeWebSocket;
        websocket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        return () => {
            websocket.close();
        };
    }, [incidentId, userId]);

    // Auto-scroll to the latest message when chatMessages change
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Callback when typing is done
    const handleTypingDone = (id) => {
        setChatMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === id ? { ...msg, isTyping: false } : msg
            )
        );
        setCurrentTypingId(null);
    };

    // Function to stop typing
    const stopTyping = () => {
        if (currentTypingId) {
            setChatMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === currentTypingId
                        ? { ...msg, isTyping: false, isStopped: true }
                        : msg
                )
            );
            setCurrentTypingId(null);

            // Optionally, send a cancel message to the server if supported
            // ws.send(JSON.stringify({ action: "cancel_response", message_id: currentTypingId }));
        }
    };

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
                    bg="#FFFFFF" // Light-gray background
                    color="black" // Black text color
                >
                    <VStack spacing={4} align="stretch">
                        {chatMessages.map((msg) => (
                            <Box
                                key={msg.id}
                                alignSelf={
                                    msg.role === "user"
                                        ? "flex-end"
                                        : "flex-start"
                                }
                                p={2}
                                borderRadius="md"
                                maxW="70%"
                                bg={
                                    msg.role === "user"
                                        ? "blue.100"
                                        : "white.100"
                                }
                            >
                                <Text fontWeight="bold">
                                    {msg.role === "user" ? "Vous:" : "MapChat:"}
                                </Text>
                                {msg.role === "assistant" && msg.isTyping ? (
                                    <Typewriter
                                        text={msg.content}
                                        speed={15} // Adjust as needed
                                        onTypingDone={() =>
                                            handleTypingDone(msg.id)
                                        }
                                        onTextUpdate={scrollToBottom} // Existing prop
                                        isStopped={msg.isStopped} // New prop
                                    />
                                ) : msg.role === "assistant" ? (
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                marked(msg.content)
                                            ),
                                        }}
                                        maxW="100%"
                                        wordBreak="break-word"
                                        whiteSpace="-moz-initial"
                                        overflow="hidden"
                                        className="markdown-content"
                                        color="inherit" // Ensure inherited text color
                                    />
                                ) : (
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                marked(msg.content)
                                            ),
                                        }}
                                        maxW="100%"
                                        wordBreak="break-word"
                                        whiteSpace="-moz-initial"
                                        overflow="hidden"
                                        className="markdown-content"
                                        color="inherit" // Ensure inherited text color
                                    />
                                )}
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Flex
                    className="input-chat-container"
                    mt={4}
                    alignItems="center"
                >
                    <InputGroup>
                        <Input
                            className="input-chat"
                            type="text"
                            placeholder="Chat message ..."
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />
                        {currentTypingId && (
                            <InputRightElement width="3rem">
                                <IconButton
                                    aria-label="Stop typing"
                                    icon={<CloseIcon />}
                                    size="sm"
                                    onClick={stopTyping}
                                    variant="ghost"
                                    colorScheme="red"
                                />
                            </InputRightElement>
                        )}
                    </InputGroup>
                    <Button
                        className="submit-chat"
                        onClick={sendMessage}
                        isDisabled={
                            !ws ||
                            ws.readyState !== WebSocket.OPEN ||
                            message.trim() === ""
                        }
                        aria-label="Send Message"
                        ml={2}
                        colorScheme="teal"
                    >
                        <ArrowForwardIcon />
                    </Button>

                    <Button
                        colorScheme="blue"
                        onClick={deleteChatHistory}
                        isDisabled={!ws || ws.readyState !== WebSocket.OPEN}
                        aria-label="Reset Chat History"
                        ml={2}
                        leftIcon={<RepeatIcon />}
                    >
                        Reset
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}

export default Chat;
