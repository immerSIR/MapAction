import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  Spinner,
  useToast,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "context/AuthContext";
import CollaborationChat from "./CollaborationChat";
import { config } from "config";
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
const CollaborationList = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const user = useAuth()
  console.log(user.user.id);
  
  useEffect(() => {
    axios.get(`${config.url}/MapApi/collaboration/`, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.token}`
      }
    })
    .then((response) => {
      const userCollaborations = response.data;
      setCollaborations(userCollaborations);
      console.log("Les collaborations : ", userCollaborations);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des collaborations", error.response ? error.response.data : error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les collaborations.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    })
    .finally(() => setLoading(false));
  }, [user, toast]);  
  
  if (loading) return <Spinner size="lg" />;

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            La Liste de mes Collaborations
          </Text>
        </CardHeader>

        <CardBody>
        {selectedCollaboration ? (
        <CollaborationChat
          incidentId={selectedCollaboration.incident}
          onBack={() => setSelectedCollaboration(null)}
        />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Incident</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {collaborations.map((collab) => (
              <Tr key={collab.id}>
                <Td>{collab.incident.title || `Incident #${collab.incident}`}</Td>
                <Td>{collab.status}</Td>
                <Td>
                <Button
                  size="sm"
                  onClick={() => {
                    if (collab.status !== 'accepted') {
                      toast({
                        title: "Collaboration non acceptée",
                        description: "Vous ne pouvez pas accéder à cette discussion car la collaboration n'a pas été acceptée.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    } else {
                      setSelectedCollaboration(collab);
                    }
                  }}
                >
                  Ouvrir discussion
                </Button>

                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
        </CardBody>
        </Card>
        </Flex>

  );
};

export default CollaborationList;
