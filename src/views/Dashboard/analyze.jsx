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

    useEffect(() => {
        const fetchData = async () => {
            await fetchPredictions(); // Fetch predictions and set in state
        };

        fetchData().then(() => {
            // Check if there's already a prediction
            if (!prediction || Object.keys(prediction).length === 0) {
                // Ensure that incident.photo exists before sending the prediction
                if (incident.photo) {
                    sendPrediction(); // Only send prediction if no existing prediction is found and photo exists
                } else {
                    console.log(
                        "Incident photo is not available yet, skipping prediction."
                    );
                }
            } else {
                console.log("Prediction already exists, skipping prediction.");
            }
        });
    }, [incident, prediction, incidentId]); // Make sure to include `incident`, `prediction`, and `incidentId` in the dependency array

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
