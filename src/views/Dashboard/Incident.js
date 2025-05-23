
import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  Button,
  Checkbox,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  HStack,
  Tag,
  TagLabel,
  Wrap,
  WrapItem

} from "@chakra-ui/react";
import axios from "axios";
import { config } from '../../config';
import { useHistory, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaEye, FaTrash } from 'react-icons/fa';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';

const Incident = () => {
  const navigate = useHistory();
  const [dataReady, setDataReady] = useState(false);
  const [data, setData] = useState([]);
  const userType = sessionStorage.getItem("user_type");
  const [inProgress, setInProgress] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get('highlight');
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [tagFilter, setTagFilter] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const etatMapping = {
    declared: "Déclaré",
    taken_into_account: "Pris en compte",
    resolved: "Résolu",
  };

  const getEtatLabel = (etat) => etatMapping[etat] || "Indéfini";

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(`${config.url}/MapApi/incident/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      setData(res.data.results);
      setDataReady(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchPredictions = async () => {
    try {
      const res = await axios.get(`${config.url}/MapApi/prediction/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("les prredictions", res.data)
      setPredictions(res.data); // Pas .results
    } catch (error) {
      console.log("Erreur lors de la récupération des prédictions", error.message);
    }
  };
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (predictions.length > 0) {
      const tagSet = new Set();
      predictions.forEach(pred => {
        const tags = typeof pred.incident_type === 'string'
          ? pred.incident_type.split(',').map(t => t.trim())
          : [];
        tags.forEach(tag => tagSet.add(tag));
      });
      setAllTags(Array.from(tagSet));
    }
  }, [predictions]);
  const toggleTagFilter = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  useEffect(() => {
    fetchIncidents();
    fetchPredictions();
  }, []);


  const getTagsForIncident = (incidentId) => {
    const prediction = predictions.find(p => Number(p.incident_id) === Number(incidentId));
    const tags = prediction?.incident_type;
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim());
    }
    return [];
  };
  
  

  // const allTags = Array.from(new Set(predictions.flatMap(p => p.incident_type)));

  const formatDate = (date) => {
    const d = new Date(date);
    return [d.getDate().toString().padStart(2, '0'), (d.getMonth()+1).toString().padStart(2, '0'), d.getFullYear()].join("-");
  };

  const onShowIncident = (id) => {
    const item = getIncidentById(id);
    navigate.push(`/admin/incident_view/${id}`, { state: { incident: item } });
  };

  const getIncidentById = (id) => data.find(incident => incident.id === id);

  const handleSelectIncident = (id) => {
    setSelectedIncidents(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIncidents.length === data.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(data.map(item => item.id));
    }
  };

  const confirmDeleteIncident = (incidentId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est définitive. Voulez-vous supprimer cet incident ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) deleteIncident(incidentId);
    });
  };

  const deleteIncident = async (incidentId) => {
    setInProgress(true);
    try {
      await axios.delete(`${config.url}/MapApi/incident/${incidentId}`);
      setInProgress(false);
      Swal.fire("Succès", "Incident supprimé", "success");
      fetchIncidents();
    } catch (error) {
      setInProgress(false);
      Swal.fire("Erreur", "Veuillez réessayer", "error");
      console.log(error.message);
    }
  };

  const confirmDeleteSelectedIncidents = () => {
    if (selectedIncidents.length === 0) return;
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous supprimer les incidents sélectionnés ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) deleteSelectedIncidents();
    });
  };

  const deleteSelectedIncidents = async () => {
    if (selectedIncidents.length === 0) return;
    setInProgress(true);
    try {
      await Promise.all(
        selectedIncidents.map(id =>
          axios.delete(`${config.url}/MapApi/incident/${id}`)
        )
      );
      setInProgress(false);
      Swal.fire("Succès", "Incidents supprimés", "success");
      setSelectedIncidents([]);
      fetchIncidents();
    } catch (error) {
      setInProgress(false);
      Swal.fire("Erreur", "Échec suppression", "error");
      console.log(error.message);
    }
  };

  const confirmDeleteAllIncidents = () => {
    if (data.length === 0) return;
    Swal.fire({
      title: "Tout supprimer ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) deleteAllIncidents();
    });
  };

  const deleteAllIncidents = async () => {
    if (data.length === 0) return;
    setInProgress(true);
    try {
      await Promise.all(
        data.map(item => axios.delete(`${config.url}/MapApi/incident/${item.id}`))
      );
      setInProgress(false);
      Swal.fire("Succès", "Tous les incidents ont été supprimés", "success");
      setSelectedIncidents([]);
      fetchIncidents();
    } catch (error) {
      setInProgress(false);
      Swal.fire("Erreur", "Échec suppression", "error");
      console.log(error.message);
    }
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            La Table des Incidents
          </Text>
        </CardHeader>

        <CardBody>
          {userType === 'admin' && (
            <Flex mb={4}>
              <Button
                colorScheme="red"
                mr={4}
                onClick={confirmDeleteSelectedIncidents}
                isLoading={inProgress}
                disabled={selectedIncidents.length === 0}
              >
                Supprimer incidents sélectionnés
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteAllIncidents}
                isLoading={inProgress}
                disabled={data.length === 0}
              >
                Tout supprimer
              </Button>
            </Flex>
          )}

        
          <Wrap mb={4}>
            {allTags.map((tag, idx) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <WrapItem key={idx}>
                  <Tag
                    size="md"
                    variant={isSelected ? "solid" : "subtle"}
                    colorScheme={isSelected ? "teal" : "gray"}
                    cursor="pointer"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                </WrapItem>
              );
            })}
          </Wrap>

          {dataReady ? (
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr>
                  <Th borderColor={borderColor}>
                    <Checkbox
                      isChecked={selectedIncidents.length === data.length && data.length > 0}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th borderColor={borderColor}>Titre</Th>
                  <Th borderColor={borderColor}>Zone</Th>
                  <Th borderColor={borderColor}>Description</Th>
                  <Th borderColor={borderColor}>Tags</Th>
                  <Th borderColor={borderColor}>Utilisateur</Th>
                  <Th borderColor={borderColor}>État</Th>
                  <Th borderColor={borderColor}>Date Création</Th>
                  <Th borderColor={borderColor}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data
                  .filter(item => {
                    if (!highlightId && selectedTags.length === 0) return true;
                    const itemTags = getTagsForIncident(item.id);
                    const hasAllTags = selectedTags.every(tag => itemTags.includes(tag));
                    return (!highlightId || item.id === Number(highlightId)) && hasAllTags;
                  })
                  .map(item => {
                    const userName = item.user_id
                      ? `${item.user_id.first_name} ${item.user_id.last_name}`
                      : "indéfini";
                    return (
                      <Tr key={item.id}>
                        <Td borderColor={borderColor}>
                          <Checkbox
                            isChecked={selectedIncidents.includes(item.id)}
                            onChange={() => handleSelectIncident(item.id)}
                          />
                        </Td>
                        <Td borderColor={borderColor} color="gray.400">{item.title}</Td>
                        <Td borderColor={borderColor} color="gray.400">{item.zone}</Td>
                        <Td borderColor={borderColor} color="gray.400">{item.description}</Td>
                        <Td borderColor={borderColor} color="gray.400">{getTagsForIncident(item.id).join(", ")}</Td>
                        <Td borderColor={borderColor} color="gray.400">{userName}</Td>
                        <Td borderColor={borderColor} color="gray.400">{getEtatLabel(item.etat)}</Td>
                        <Td borderColor={borderColor} color="gray.400">{formatDate(item.created_at)}</Td>

                        <Td borderColor={borderColor}>
                          <HStack spacing={2} justify="center">
                            <Tooltip label="Voir l'incident" hasArrow>
                              <Button
                                size="sm"
                                onClick={() => onShowIncident(item.id)}
                                colorScheme="blue"
                              >
                                <FaEye />
                              </Button>
                            </Tooltip>

                            {userType === 'admin' && (
                              <Tooltip label="Supprimer l'incident" hasArrow>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => confirmDeleteIncident(item.id)}
                                  isLoading={inProgress}
                                >
                                  <FaTrash />
                                </Button>
                              </Tooltip>
                            )}
                          </HStack>
                        </Td>

                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          ) : (
            <Spinner size="xl" />
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};

export default Incident;
