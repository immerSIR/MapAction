import React, { useState, useEffect } from 'react';
import {
  Box,  
  Button,
  Divider,
  Flex,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import Swal from 'sweetalert2';
import { config } from '../../config';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const MessageManager = () => {
  const [dataReady, setDataReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [editForm, setEditForm] = useState({
    response: '',
    message: '',
  });

  const [replyForm, setReplyForm] = useState({
    response: '',
    message: '',
  });

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isReplyOpen,
    onOpen: onReplyOpen,
    onClose: onReplyClose,
  } = useDisclosure();

   const {
    isOpen: isReadOpen,
    onOpen: onReadOpen,
    onClose: onReadClose,
  } = useDisclosure();


  const fetchMessages = async () => {
    const url = `${config.url}/MapApi/message/`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Les messages reçu :", res);
      
      setMessages(res.data.results);
      setDataReady(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Erreur lors de la récupération des messages", "error");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Suppression d'un message
  const deleteMessage = async (id) => {
    setInProgress(true);
    try {
      await axios.delete(`${config.url}/MapApi/message/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Succès", "Message supprimé", "success");
      fetchMessages();
    } catch (error) {
      Swal.fire("Erreur", "Erreur lors de la suppression", "error");
      console.error(error);
    }
    setInProgress(false);
  };

  // Confirmation avant suppression
  const confirmDeleteMessage = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est définitive. Voulez-vous supprimer ce message ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMessage(id);
      }
    });
  };

  // Préparation de la modification d'un message
  const handleEditMessage = (msg) => {
    setSelectedMessage(msg);
    setEditForm({
      subject: msg.subject || '',
      content: msg.content || '',
    });
    onEditOpen();
  };


   const handleReadMessage = (msg) => {
    setSelectedMessage(msg);
    setReplyForm({
      message: msg.id,
      response: '', // Réinitialisation de la réponse
    });
    onReadOpen();
  };
  // Envoi de la modification (PUT)
  const updateMessage = async () => {
    setInProgress(true);
    try {
      await axios.put(`${config.url}/MapApi/message/${selectedMessage.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Succès", "Message modifié", "success");
      onEditClose();
      fetchMessages();
    } catch (error) {
      Swal.fire("Erreur", "Erreur lors de la modification", "error");
      console.error(error);
    }
    setInProgress(false);
  };

  // Préparation de la réponse à un message
  const handleReplyMessage = (msg) => {
    setSelectedMessage(msg);
    setReplyForm({
      message: msg.id,
      response: '',
    });
    onReplyOpen();
  };

  // Envoi de la réponse (POST)
  const sendReply = async () => {
    console.log("Envoi de la réponse avec :", replyForm);
    setInProgress(true);
    try {
      await axios.post(`${config.url}/MapApi/response_msg/`, replyForm, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire("Succès", "Réponse envoyée", "success");
      onReplyClose();
    } catch (error) {
      Swal.fire("Erreur", "Erreur lors de l'envoi de la réponse", "error");
      console.error(error);
    }
    setInProgress(false);
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Gestion des messages
          </Text>
        </CardHeader>

        <CardBody>
          {dataReady ? (
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr>
                  <Th borderColor={borderColor}>ID</Th>
                  <Th borderColor={borderColor}>Sujet</Th>
                  <Th borderColor={borderColor}>Contenu</Th>
                  <Th borderColor={borderColor}>Date</Th>
                  <Th borderColor={borderColor}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {messages.map((msg) => (
                  <Tr key={msg.id}>
                    <Td borderColor={borderColor}>{msg.id}</Td>
                    <Td borderColor={borderColor}>{msg.objet}</Td>
                    <Td borderColor={borderColor}>{msg.message}</Td>
                    <Td borderColor={borderColor}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </Td>
                    <Td borderColor={borderColor}>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr="2"
                        onClick={() => handleReadMessage(msg)}
                      >
                        Lire
                      </Button>

                       <Button
                        size="sm"
                        mr="2"
                        colorScheme="green"
                        onClick={() => handleReplyMessage(msg)}
                      >
                        Répondre
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        
                        onClick={() => confirmDeleteMessage(msg.id)}
                        isLoading={inProgress}
                      >
                        Supprimer
                      </Button>
                     
                       
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Spinner size="xl" />
          )}
        </CardBody>
      </Card>

      {/* Modal pour modifier un message */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier le message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Sujet"
              mb={4}
              value={editForm.subject}
              onChange={(e) =>
                setEditForm({ ...editForm, subject: e.target.value })
              }
            />
            <Textarea
              placeholder="Contenu"
              value={editForm.content}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateMessage} isLoading={inProgress}>
              Sauvegarder
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isReadOpen} onClose={onReadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lire le message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text fontWeight="bold">Sujet :</Text>
              <Text>{selectedMessage?.objet}</Text>
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Contenu :</Text>
              <Text>{selectedMessage?.message}</Text>
            </Box>
            <Divider my={4} />
            <Box>
              <Text fontWeight="bold" mb={2}>Répondre :</Text>
              <Textarea
                autoFocus
                placeholder="Votre réponse"
                value={replyForm.response}
                onChange={(e) =>
                  setReplyForm({ ...replyForm, response: e.target.value })
                }
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={sendReply} isLoading={inProgress}>
              Envoyer
            </Button>
            <Button variant="ghost" onClick={onReadClose}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal pour répondre à un message */}
      <Modal isOpen={isReplyOpen} onClose={onReplyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Répondre au message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Textarea
            autoFocus
            placeholder="Votre réponse"
            value={replyForm.response}
            onChange={(e) => {
              console.log("Réponse saisie :", e.target.value);
              setReplyForm({ ...replyForm, response: e.target.value });
            }}
          />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={sendReply} isLoading={inProgress}>
              Envoyer
            </Button>
            <Button variant="ghost" onClick={onReplyClose}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageManager;
