import React, { useState, useEffect } from 'react';
import {
  Box,
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
  // État pour gérer la sélection des incidents
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [newIncident, setNewIncident] = useState({
    title: "",
    zone: "",
    description: "",
    photo: "",
    video: "",
    audio: "",
    latitude: "",
    longitude: "",
    user_id: "",
    indicateur_id: "",
    category_ids: [],
    etat: "",
  });
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const etatMapping = {
    declared: "Déclaré",
    taken_into_account: "Pris en compte",
    resolved: "Résolu",
  };
  const getEtatLabel = (etat) => {
    return etatMapping[etat] || "Indéfini"; 
  };

  // Récupération des incidents
  const fetchIncidents = async () => {
    const url = `${config.url}/MapApi/incident/`;
    try {
      const res = await axios.get(url, {
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

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Suppression d'un incident après confirmation
  const deleteIncident = async (incidentId) => {
    setInProgress(true);
    const url = `${config.url}/MapApi/incident/${incidentId}`;
    try {
      await axios.delete(url);
      setInProgress(false);
      Swal.fire("Succès", "Incident supprimé", "success");
      fetchIncidents();
    } catch (error) {
      setInProgress(false);
      Swal.fire("Erreur", "Veuillez réessayer", "error");
      console.log(error.message);
    }
  };

  // Confirmation pour suppression d'un incident
  const confirmDeleteIncident = (incidentId) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est définitive. Voulez-vous supprimer cet incident ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteIncident(incidentId);
      }
    });
  };

  // Suppression des incidents sélectionnés après confirmation
  const deleteSelectedIncidents = async () => {
    if (selectedIncidents.length === 0) return;
    setInProgress(true);
    try {
      await Promise.all(
        selectedIncidents.map(id => axios.delete(`${config.url}/MapApi/incident/${id}`))
      );
      setInProgress(false);
      Swal.fire("Succès", "Incidents sélectionnés supprimés", "success");
      setSelectedIncidents([]); // Réinitialisation des sélections
      fetchIncidents();
    } catch (error) {
      setInProgress(false);
      Swal.fire("Erreur", "Veuillez réessayer", "error");
      console.log(error.message);
    }
  };

  // Confirmation pour suppression des incidents sélectionnés
  const confirmDeleteSelectedIncidents = () => {
    if (selectedIncidents.length === 0) return;
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est définitive. Voulez-vous supprimer les incidents sélectionnés ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSelectedIncidents();
      }
    });
  };

  // Suppression de tous les incidents affichés après confirmation
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
      Swal.fire("Erreur", "Veuillez réessayer", "error");
      console.log(error.message);
    }
  };

  // Confirmation pour suppression de tous les incidents
  const confirmDeleteAllIncidents = () => {
    if (data.length === 0) return;
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Êtes-vous sûr de supprimer tous les incidents reportés ? Cette action est définitive.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAllIncidents();
      }
    });
  };

  const onShowIncident = (id) => {
    const item = getIncidentById(id);
    navigate.push(`/admin/incident_view/${id}`, { state: { incident: item } });
  };

  const getIncidentById = (id) => {
    return data.find((incident) => incident.id === id);
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("-");
  };

  // Gestion de la sélection individuelle d'un incident
  const handleSelectIncident = (id) => {
    if (selectedIncidents.includes(id)) {
      setSelectedIncidents(selectedIncidents.filter(item => item !== id));
    } else {
      setSelectedIncidents([...selectedIncidents, id]);
    }
  };

  // Gestion de la sélection/désélection de tous les incidents
  const handleSelectAll = () => {
    if (selectedIncidents.length === data.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(data.map(item => item.id));
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
          {dataReady ? (
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr>
                  {/* Case à cocher pour sélectionner/désélectionner tous les incidents */}
                  <Th borderColor={borderColor}>
                    <Checkbox
                      isChecked={selectedIncidents.length === data.length && data.length > 0}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th borderColor={borderColor}>Titre</Th>
                  <Th borderColor={borderColor}>Zone</Th>
                  <Th borderColor={borderColor}>Description</Th>
                  <Th borderColor={borderColor}>Utilisateur</Th>
                  <Th borderColor={borderColor}>Etat</Th>
                  <Th borderColor={borderColor}>Date Création</Th>
                  <Th borderColor={borderColor}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data
                  .filter((item) => !highlightId || item.id === Number(highlightId))
                  .map((item) => {
                  let userName = item.user_id ? `${item.user_id.first_name} ${item.user_id.last_name}` : "indéfini";
                  return (
                    <Tr key={item.id}>
                      <Td borderColor={borderColor}>
                        {/* Case à cocher pour sélectionner l'incident */}
                        <Checkbox
                          isChecked={selectedIncidents.includes(item.id)}
                          onChange={() => handleSelectIncident(item.id)}
                        />
                      </Td>
                      <Td borderColor={borderColor} color="gray.400">{item.title}</Td>
                      <Td borderColor={borderColor} color="gray.400">{item.zone}</Td>
                      <Td borderColor={borderColor} color="gray.400">{item.description}</Td>
                      <Td borderColor={borderColor} color="gray.400">{userName}</Td>
                      <Td borderColor={borderColor} color="gray.400">{getEtatLabel(item.etat)}</Td>
                      <Td borderColor={borderColor} color="gray.400">{formatDate(item.created_at)}</Td>
                      <Td borderColor={borderColor}>
                        <Button
                          size="sm"
                          onClick={() => onShowIncident(item.id)}
                          colorScheme="blue"
                        >
                          <FaEye />
                        </Button>
                        {userType === 'admin' && (
                          <Button
                            size="sm"
                            colorScheme="red"
                            ml="2"
                            onClick={() => confirmDeleteIncident(item.id)}
                            isLoading={inProgress}
                          >
                            <FaTrash />
                          </Button>
                        )}
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
