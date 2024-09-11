import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Flex,
    Grid,
    Text,
    Heading,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import { IncidentData } from "Fonctions/Incident_fonction";
import { Player } from "video-react";
import {
    MapContainer,
    TileLayer,
    Popup,
    Marker,
    Circle,
    useMap,
} from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import L from "leaflet"; // Import Leaflet
import { useParams } from "react-router-dom"; // Import useParams to get incidentId

export default function Analyze() {
    const { incidentId } = useParams(); // Get incidentId from the URL parameters
    const {
        latitude,
        longitude,
        imgUrl,
        position,
        date,
        heure,
        handleNavigateLLM,
        incident,
        context,
        piste_solution,
        impact_potentiel,
        type_incident,
        fetchPredictions,
        sendPrediction,
        prediction, // Add prediction from IncidentData if it exists in the state
    } = IncidentData();

    // const fetchPredictionsByIncidentId = async (incidentId) => {
    //     try {
    //         const response = await fetch(
    //             `http://139.144.63.238/MapApi/predictions/${incidentId}`
    //         );
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch predictions");
    //         }
    //         const data = await response.json();
    //         return data; // Return the prediction data or null if no prediction is found
    //     } catch (error) {
    //         console.error("Error fetching predictions:", error);
    //         return null;
    //     }
    // };

    const fetchPredictionsByIncidentId = async (incidentId) => {
        try {
            const response = await fetch(
                `http://139.144.63.238/MapApi/Incidentprediction/${incidentId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch predictions");
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json(); // Parse the JSON response
                return data; // Return the prediction data
            } else {
                throw new Error("Received non-JSON response");
            }
        } catch (error) {
            console.error("Error fetching predictions:", error);
            return null; // Return null if there is an error
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch existing prediction for the incident
                const existingPrediction = await fetchPredictionsByIncidentId(
                    incidentId
                );

                console.log("Existing prediction:", existingPrediction); // Log prediction

                // Check if prediction exists
                if (
                    existingPrediction &&
                    Object.keys(existingPrediction).length > 0
                ) {
                    console.log(
                        "Prediction already exists, skipping prediction."
                    );
                } else {
                    if (incident.photo) {
                        console.log("Sending prediction as none exists.");
                        sendPrediction(); // Send prediction if no existing one is found
                    } else {
                        console.log(
                            "Incident photo is not available yet, skipping prediction."
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching or sending prediction:", error);
            }
        };

        fetchData();
    }, [incident, prediction, incidentId]);

    const { colorMode } = useColorMode();
    const textColor = useColorModeValue("gray.700", "white");

    const iconHTMLBlue = ReactDOMServer.renderToString(
        <FaMapMarkerAlt color="blue" size={20} />
    );

    const customMarkerIconBlue = new L.DivIcon({
        html: iconHTMLBlue,
    });

    const iconHTMLRed = ReactDOMServer.renderToString(
        <FaMapMarkerAlt color="red" size={20} />
    );

    const customMarkerIconRed = new L.DivIcon({
        html: iconHTMLRed,
    });

    const iconHTMLOrange = ReactDOMServer.renderToString(
        <FaMapMarkerAlt color="orange" size={20} />
    );

    const customMarkerIconOrange = new L.DivIcon({
        html: iconHTMLOrange,
    });

    function RecenterMap({ lat, lon }) {
        const map = useMap();
        useEffect(() => {
            if (lat && lon) {
                map.setView([lat, lon], 13);
            }
        }, [lat, lon, map]);
        return null;
    }

    function ExpandableContent({ content }) {
        const [expanded, setExpanded] = useState(false);

        const toggleExpanded = () => {
            setExpanded(!expanded);
        };

        return (
            <Box>
                <p>
                    {expanded ? content : content.substring(0, 300)}
                    {!expanded && content.length > 100 && (
                        <Button onClick={toggleExpanded}>Voir plus</Button>
                    )}
                </p>
            </Box>
        );
    }

    return (
        <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
            <Grid
                templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
                templateRows={{ lg: "repeat(2, auto)" }}
                gap="20px"
            >
                <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
                    <Flex direction="column">
                        <Box
                            overflow={{ sm: "scroll", lg: "hidden" }}
                            justify="space-between"
                            p="22px"
                        >
                            <Box mb="4">
                                <Heading as="h6" size="xs" mb="2">
                                    Contexte & Description
                                </Heading>
                                <Box minH="200px">
                                    <ExpandableContent
                                        content={context || ""}
                                    />
                                </Box>
                            </Box>
                            <Box mb="4">
                                <Heading as="h6" size="xs" mb="2">
                                    Impacts Potentiels
                                </Heading>
                                <Box minH="200px">
                                    <ExpandableContent
                                        content={impact_potentiel || ""}
                                    />
                                </Box>
                            </Box>
                            <Box mb="4">
                                <Heading as="h6" size="xs" mb="2">
                                    Pistes de solutions envisageables
                                </Heading>
                                <Box minH="200px">
                                    <ExpandableContent
                                        content={piste_solution || ""}
                                    />
                                </Box>
                            </Box>
                            <Button
                                onClick={handleNavigateLLM}
                                colorScheme="teal"
                            >
                                Discussion LLM
                            </Button>
                        </Box>
                    </Flex>
                </Card>
                <Card
                    bg={
                        colorMode === "dark"
                            ? "navy.800"
                            : "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                    }
                    p="0px"
                    maxW={{ sm: "320px", md: "100%" }}
                >
                    <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
                        <Text
                            color="#fff"
                            fontSize="lg"
                            fontWeight="bold"
                            mb="6px"
                        >
                            Carte interactive
                        </Text>
                    </Flex>
                    <Box minH="300px">
                        {latitude !== 0 && longitude !== 0 ? (
                            <Box height="600px" width="100%" p="0 8px 0 8px">
                                <MapContainer
                                    center={position}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <RecenterMap
                                        lat={latitude}
                                        lon={longitude}
                                    />
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker
                                        className="icon-marker"
                                        icon={
                                            incident.etat === "resolved"
                                                ? customMarkerIconBlue
                                                : incident.etat ===
                                                  "taken_into_account"
                                                ? customMarkerIconOrange
                                                : customMarkerIconRed
                                        }
                                        position={position}
                                    >
                                        <Popup>{incident.title}</Popup>
                                        <Circle
                                            center={position}
                                            radius={500}
                                            color="red"
                                        />
                                    </Marker>
                                </MapContainer>
                            </Box>
                        ) : (
                            <Text className="danger" color="red.500">
                                Coordonnees non renseignees
                            </Text>
                        )}
                    </Box>
                </Card>

                <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
                    <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
                        <Text fontSize="lg" color={textColor} fontWeight="bold">
                            Image de l'incident
                        </Text>
                    </Flex>
                    <Box minH="300px" p="8px">
                        {imgUrl ? (
                            <img src={imgUrl} alt="Incident" />
                        ) : (
                            "No image available"
                        )}
                    </Box>
                    <Flex
                        direction="row"
                        align="center"
                        justifyContent="space-between"
                        p="8px"
                    >
                        <Text
                            color="#ccc"
                            fontWeight="bold"
                            mb="6px"
                            flexGrow={1}
                        >
                            Date : {date}
                        </Text>
                        <Text color="#ccc" fontWeight="bold" mb="6px">
                            Heure : {heure}
                        </Text>
                    </Flex>
                    <Text color="#000" fontWeight="bold" mb="6px" p="8px">
                        Type d'incident : {type_incident}
                    </Text>
                </Card>
            </Grid>
        </Flex>
    );
}
