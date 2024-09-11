import React, { useState, useEffect } from "react";
import { config } from "config";
import { useParams, useHistory, useLocation } from "react-router-dom";
import "../../node_modules/video-react/dist/video-react.css";
import axios from "axios";
import Swal from "sweetalert2";

export const IncidentData = () => {
    const { incidentId, userId } = useParams();
    const navigate = useHistory();
    const [user, setUser] = useState({});
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const predictionId = userId + incidentId;
    const location = useLocation();
    const pictUrl = location.state ? location.state.pictUrl : "";
    // console.log("Location:", location);
    // console.log("LocationdotState", location.state.nearbyPlaces);
    // const nearbyPlacesDic = location.state ? location.state.nearbyPlaces : [];
    const fetchUserData = async () => {
        try {
            const response = await axios.get(
                `${config.url}/MapApi/user_retrieve/`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.token}`,
                    },
                }
            );
            console.log("User information", response.data.data);
            setUser(response.data.data);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des informations utilisateur :",
                error.message
            );
        }
    };

    useEffect(() => {
        fetchUserData();
        const fetchIncident = async () => {
            try {
                const response = await axios.get(
                    `${config.url}/MapApi/incident/${incidentId}`
                );
                console.log("reponse", response);
                setIncident(response.data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des détails de l'incident :",
                    error
                );
            }
        };
        const fetchPredictions = async () => {
            try {
                const response = await axios.get(
                    `${config.url}/MapApi/Incidentprediction/${incidentId}`
                );
                console.log("les reponses du serveur", response);
                setPredictions(response.data[0]);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des prédictions :",
                    error
                );
            }
        };
        if (incidentId) {
            fetchIncident();
            fetchPredictions();
        }
        // sendPrediction();
    }, [incidentId]);
    const fetchPredictions = async () => {
        try {
            const response = await axios.get(
                `${config.url}/MapApi/Incidentprediction/${incidentId}`
            );
            console.log("les reponses du serveur", response.data);
            setPredictions(response.data[0]);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des prédictions :",
                error
            );
        }
    };
    const [incident, setIncident] = useState({});
    const [videoIsLoading, setVideoIsLoading] = useState(false);
    const imgUrl =
        incident && incident.photo ? config.url + incident.photo : "";
    // console.log("The image url is", imgUrl);
    // console.log("The photo is", incident.photo);
    // console.log("The image is", incident.image_name);
    const audioUrl = incident ? config.url + incident.audio : "";
    const videoUrl = incident ? config.url + incident.video : "";
    // console.log(videoUrl);
    const latitude = incident?.lattitude || 0;
    const longitude = incident?.longitude || 0;
    const description = incident ? incident.description : "";
    const position = [latitude, longitude];
    const dataTostring = incident ? incident.created_at : "";
    const dateObject = new Date(dataTostring);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const date = dateObject.toLocaleDateString();
    console.log("la date", date);
    const heure = dateObject.toLocaleTimeString();
    const [isChanged, setisChanged] = useState(false);
    const [inProgress, setProgress] = useState(false);
    const [changeState, setState] = useState(false);
    const data = [];
    const [prediction, setPredictions] = useState([]);
    const piste_solution = prediction ? prediction.piste_solution : "";
    // console.log("Piste solution", piste_solution);
    const context = prediction ? prediction.context : "";
    // console.log("Context", context);
    const impact_potentiel = prediction ? prediction.impact_potentiel : "";
    // console.log("impact_potentiel", impact_potentiel);
    const type_incident = prediction ? prediction.incident_type : "";
    const [EditIncident, setEditIncident] = useState({
        title: "",
        zone: "",
        description: "",
        lattitude: "",
        longitude: "",
        user_id: "",
        etat: "",
        indicateur_id: "",
        category_ids: [],
    });

    const optionstype = [
        { label: "En attente", value: "declared" },
        { label: "Prendre en compte", value: "taken_into_account" },
        { label: "Résolu", value: "resolved" },
    ];

    const handleSelectChange = (selectedOption) => {
        console.log(selectedOption.value);
        setEditIncident({ ...EditIncident, etat: selectedOption.value });
        console.log(EditIncident);
    };

    const handleChangeStatus = async (e) => {
        e.preventDefault();
        setState(true);

        const action = EditIncident.etat;
        const url = config.url + "/MapApi/hadleIncident/" + incidentId;
        const token = sessionStorage.getItem("token");

        if (!token) {
            Swal.fire("Token not found. Please log in.");
            setState(false);
            setisChanged(false);
            return;
        }

        try {
            const response = await axios.post(
                url,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
            setState(false);
            setisChanged(false);
            setEditIncident({
                title: "",
                zone: "",
                description: "",
                lattitude: "",
                longitude: "",
                user_id: "",
                etat: "",
                indicateur_id: "",
                category_ids: [],
            });
            Swal.fire("Changement de status effectué avec succès");
        } catch (error) {
            if (
                error.response &&
                error.response.data.code === "token_not_valid"
            ) {
                try {
                    const refreshToken = localStorage.getItem("refresh_token");
                    const refreshResponse = await axios.post(
                        config.url + "/api/token/refresh/",
                        { refresh: refreshToken }
                    );
                    localStorage.setItem("token", refreshResponse.data.access);
                    const retryResponse = await axios.post(
                        url,
                        { action },
                        {
                            headers: {
                                Authorization: `Bearer ${refreshResponse.data.access}`,
                            },
                        }
                    );
                    console.log(retryResponse);
                    setState(false);
                    setisChanged(false);
                    setEditIncident({
                        title: "",
                        zone: "",
                        description: "",
                        lattitude: "",
                        longitude: "",
                        user_id: "",
                        etat: "",
                        indicateur_id: "",
                        category_ids: [],
                    });
                    Swal.fire("Changement de status effectué avec succès");
                } catch (refreshError) {
                    console.log(refreshError);
                    Swal.fire("Session expired. Please log in again.");
                }
            } else {
                setState(false);
                setisChanged(false);
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                    Swal.fire(
                        "Désolé",
                        "Cet incident est déjà pris en compte."
                    );
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log(error.message);
                }
            }
        }
    };
    const handleNavigate = async () => {
        const userId = user.id;
        navigate.push(`/admin/analyze/${incident.id}/${userId}`);
    };
    const handleNavigateLLM = async () => {
        navigate.push(`/admin/llm_chat/${incident.id}/${userId}`);
    };

    const fetchNearbySensitiveStructures = async (latitude, longitude) => {
        try {
            // Define Overpass API query to fetch sensitive structures near the incident
            const overpassUrl = "https://overpass-api.de/api/interpreter";
            const overpassQuery = `
                [out:json];
                (
                  node["amenity"~"school|clinic|hospital|fire_station|police"](around:500,${latitude},${longitude});
                  way["amenity"~"school|clinic|hospital|fire_station|police"](around:500,${latitude},${longitude});
                  relation["amenity"~"school|clinic|hospital|fire_station|police"](around:500,${latitude},${longitude});
                );
                out center;
            `;

            const response = await axios.post(
                overpassUrl,
                `data=${encodeURIComponent(overpassQuery)}`
            );
            const nearbyStructures = response.data.elements;

            // Map the Overpass response to a list of nearby places (sensitive structures)
            const sensitiveStructures = nearbyStructures.map((structure) => {
                if (structure.tags.amenity === "school") {
                    return "ecole";
                } else if (
                    structure.tags.amenity === "clinic" ||
                    structure.tags.amenity === "hospital"
                ) {
                    return "Clinique";
                } else if (structure.tags.amenity === "fire_station") {
                    return "Caserne des pompiers";
                } else if (structure.tags.amenity === "police") {
                    return "Commissariat";
                } else {
                    return structure.tags.amenity;
                }
            });
            return sensitiveStructures;
        } catch (error) {
            console.error(
                "Error fetching sensitive structures from Overpass API:",
                error
            );
            return [];
        }
    };

    const sendPrediction = async () => {
        try {
            const fastapiUrl = config.url2;

            // Ensure that incident.photo is defined
            if (!incident.photo) {
                console.error(
                    "Incident photo is undefined, skipping prediction."
                );
                return; // Don't proceed if there is no photo
            }

            // Fetch nearby sensitive structures from Overpass API
            const sensitiveStructures = await fetchNearbySensitiveStructures(
                latitude,
                longitude
            );

            const payload = {
                image_name: incident.photo, // Use incident.photo directly
                sensitive_structures: sensitiveStructures,
                incident_id: incidentId,
                user_id: userId,
            };
            console.log("Les sites voisins:", sensitiveStructures);
            console.log("Payload being sent:", payload);

            try {
                const response = await axios.post(fastapiUrl, payload);
                console.log("Server Response:", response.data);
            } catch (error) {
                console.error(
                    "Error sending prediction (Axios error):",
                    error.response || error.message || error
                );
                throw new Error(
                    error.response?.data?.detail || "Error during API call"
                );
            }
        } catch (error) {
            console.error("Error in sendPrediction function:", error);
        }
    };

    return {
        handleChangeStatus,
        latitude,
        longitude,
        videoUrl,
        imgUrl,
        audioUrl,
        optionstype,
        description,
        position,
        date,
        heure,
        videoIsLoading,
        handleNavigate,
        setVideoIsLoading,
        incident,
        context,
        piste_solution,
        impact_potentiel,
        type_incident,
        EditIncident,
        handleSelectChange,
        fetchPredictions,
        handleNavigateLLM,
        sendPrediction,
    };
};
