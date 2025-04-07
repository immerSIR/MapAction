import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { config } from "config";

const CollaborationChat = ({ incidentId, apiUrl, onBack }) => {
  const user = Number(sessionStorage.getItem('user_id')); // Convertir en nombre
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [incidentResolved, setIncidentResolved] = useState(false);
  const toast = useToast();

  // Vérifier si l'incident est résolu
  const fetchIncidentStatus = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${config.url}/MapApi/incident/${incidentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.data.etat === "resolved") {
        setIncidentResolved(true);
      }
    } catch (error) {
      console.error("Erreur de récupération de l'incident", error);
    }
  }, [incidentId]);

  // Récupération des messages
  const fetchMessages = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${config.url}/MapApi/discussion/${incidentId}/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erreur de chargement des messages", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer les messages.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [incidentId, toast]);

  // Exécuter la récupération des messages et du statut de l'incident
  useEffect(() => {
    fetchIncidentStatus();
    fetchMessages();
    const interval = setInterval(() => {
      fetchIncidentStatus();
      fetchMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchIncidentStatus, fetchMessages]);

  // Fonction d'envoi d'un message
  const sendMessage = async () => {
    if (!newMessage.trim() || incidentResolved) return;

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(`${config.url}/MapApi/discussion/${incidentId}/`, {
        message: newMessage,
      }, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      toast({
        title: "Erreur d'envoi",
        description: "Votre message n'a pas pu être envoyé.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} w="100%" maxW="600px" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
      <Button mb={4} onClick={onBack}>Retour</Button>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Discussion de l'incident #{incidentId}
      </Text>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <VStack align="stretch" spacing={3} maxH="400px" overflowY="auto">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <HStack
                key={msg.id}
                align="start"
                bg={msg.sender.id === user ? "blue.50" : "green.50"} 
                p={3}
                borderRadius="md"
                boxShadow="sm"
                justify={msg.sender.id === user ? "flex-end" : "flex-start"} 
              >
                <Avatar size="sm" name={msg.sender?.first_name || "Utilisateur"} />
                <Box>
                  <Text fontWeight="bold">
                    {msg.sender.organisation && msg.sender.organisation.trim() !== ''
                      ? msg.sender.organisation
                      : "Utilisateur"}
                  </Text>
                  <Text>{msg.message}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(msg.created_at).toLocaleString()}
                  </Text>
                </Box>
              </HStack>
            ))
          ) : (
            <Text color="gray.600">Aucun message pour le moment.</Text>
          )}
        </VStack>
      )}

      {incidentResolved ? (
        <Text color="red.500" fontWeight="bold" mt={4}>
          Cet incident est résolu, la discussion est clôturée.
        </Text>
      ) : (
        <HStack mt={4}>
          <Input
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            isDisabled={incidentResolved}
          />
          <Button colorScheme="blue" onClick={sendMessage} isDisabled={incidentResolved}>
            Envoyer
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default CollaborationChat;
