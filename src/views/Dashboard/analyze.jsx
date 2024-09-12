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
import { marked } from "marked";

export default function Analyze() {
    const { incidentId } = useParams(); // Get incidentId from the URL parameters
    const {
        latitude,
        longitude,
        imgUrl,
        date,
        heure,
        incident,
        handleNavigateLLM,
        context,
        piste_solution,
        impact_potentiel,
        type_incident,
        zone, // Assuming `zone` corresponds to `area_name`
        sendPrediction,
    } = IncidentData();

    const { colorMode } = useColorMode();
    const textColor = useColorModeValue("gray.700", "white");

    const [expanded, setExpanded] = useState(false);
    const [prediction, setPrediction] = useState(null); // State to store the prediction

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    // Fetch predictions by incident ID
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
                    setPrediction(existingPrediction); // Set the prediction if it exists
                } else {
                    if (incident.photo) {
                        console.log("Sending prediction as none exists.");
                        await sendPrediction(); // Send prediction if no existing one is found
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
    }, [incident, incidentId]);

    // Convert Markdown to HTML using `marked`
    const convertMarkdownToHtml = (markdownText) => {
        return { __html: marked(markdownText) };
    };

    const iconHTML = ReactDOMServer.renderToString(
        <FaMapMarkerAlt
            color={
                incident.etat === "resolved"
                    ? "blue"
                    : incident.etat === "taken_into_account"
                    ? "orange"
                    : "red"
            }
            size={20}
        />
    );

    const customMarkerIcon = new L.DivIcon({ html: iconHTML });

    function RecenterMap({ lat, lon }) {
        const map = useMap();
        useEffect(() => {
            if (lat && lon) {
                map.setView([lat, lon], 13);
            }
        }, [lat, lon, map]);
        return null;
    }

    return (
        <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
            <Grid
                templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
                templateRows={{ lg: "repeat(2, auto)" }}
                gap="20px"
            >
                {/* Card for the Incident Report */}
                <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
                    <Flex direction="column">
                        <Box
                            overflow={{ sm: "scroll", lg: "hidden" }}
                            justify="space-between"
                            p="22px"
                        >
                            <Heading as="h6" size="md" mb="4">
                                Rapport d'Analyse
                            </Heading>
                            <Box mb="4" minH="200px">
                                <Text>
                                    <strong>Zone:</strong>{" "}
                                    {zone || "Zone non renseignée"}
                                </Text>
                                <Text>
                                    <strong>Coordonnées:</strong> {latitude},{" "}
                                    {longitude}
                                </Text>
                                <Text>
                                    <strong>Type d'incident:</strong>{" "}
                                    {type_incident}
                                </Text>
                                <Text mt="2">
                                    {expanded ? (
                                        <>
                                            <Box
                                                dangerouslySetInnerHTML={convertMarkdownToHtml(
                                                    context ||
                                                        (prediction &&
                                                            prediction.context) ||
                                                        "Contexte non disponible"
                                                )}
                                            />
                                            <Box
                                                dangerouslySetInnerHTML={convertMarkdownToHtml(
                                                    impact_potentiel ||
                                                        (prediction &&
                                                            prediction.impact_potentiel) ||
                                                        "Non disponible"
                                                )}
                                            />
                                            <Box
                                                dangerouslySetInnerHTML={convertMarkdownToHtml(
                                                    piste_solution ||
                                                        (prediction &&
                                                            prediction.piste_solution) ||
                                                        "Non disponible"
                                                )}
                                            />
                                        </>
                                    ) : (
                                        `${
                                            context
                                                ? context.substring(0, 300)
                                                : "Aucun contexte disponible"
                                        }...`
                                    )}
                                    {context && context.length > 300 && (
                                        <Button
                                            onClick={toggleExpanded}
                                            variant="link"
                                            mt="2"
                                        >
                                            {expanded
                                                ? "Voir moins"
                                                : "Voir plus"}
                                        </Button>
                                    )}
                                </Text>
                                <br />
                                <Button
                                    onClick={handleNavigateLLM}
                                    colorScheme="teal"
                                >
                                    MapChat
                                </Button>
                            </Box>
                        </Box>
                    </Flex>
                </Card>

                {/* Card for Interactive Map */}
                <Card p="0px" maxW={{ sm: "320px", md: "100%" }}>
                    <Flex direction="column" mb="40px" p="28px 0px 0px 22px">
                        <Text
                            color={textColor}
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
                                    center={[latitude, longitude]}
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
                                        position={[latitude, longitude]}
                                        icon={customMarkerIcon}
                                    >
                                        <Popup>{incident.title}</Popup>
                                        <Circle
                                            center={[latitude, longitude]}
                                            radius={500}
                                            color="red"
                                        />
                                    </Marker>
                                </MapContainer>
                            </Box>
                        ) : (
                            <Text color="red.500">
                                Coordonnées non renseignées
                            </Text>
                        )}
                    </Box>
                </Card>

                {/* Card for Incident Image */}
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
                        <Text color="#ccc" fontWeight="bold" flexGrow={1}>
                            Date : {date}
                        </Text>
                        <Text color="#ccc" fontWeight="bold">
                            Heure : {heure}
                        </Text>
                    </Flex>
                </Card>
            </Grid>
        </Flex>
    );
}
