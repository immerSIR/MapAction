// Analyze.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Box,
    Button,
    Flex,
    Grid,
    Text,
    Heading,
    Spinner,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    useDisclosure,
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
import "./Chat.css";
import QuotesCarousel from "./QuotesCarousel"; // Import QuotesCarousel from the same directory
import ReactMarkdown from "react-markdown"; // Add this import
import { config } from "config";
import Slider from "react-slick"; // Import react-slick for carousel
import "slick-carousel/slick/slick.css"; // Import slick carousel styles
import "slick-carousel/slick/slick-theme.css"; // Import slick carousel theme

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
        zone,
        sendPrediction,
    } = IncidentData();
    const textColor = useColorModeValue("gray.700", "white");

    const [expanded, setExpanded] = useState(false);
    const [prediction, setPrediction] = useState(null); // State to store the prediction
    const [isLoadingContext, setIsLoadingContext] = useState(true); // State to track context loading
    const [predictionError, setPredictionError] = useState(null); // State to track prediction errors
    const predictionSentRef = useRef(false); // Ref to track if prediction has been sent
    const [isPolling, setIsPolling] = useState(false); // Add state for polling status
    const pollingIntervalRef = useRef(null); // Ref to store polling interval ID

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    // Function to fetch predictions by incident ID (useCallback for stability)
    const fetchPredictionsByIncidentId = useCallback(async (id) => {
        try {
            const response = await fetch(
                `${config.url}/MapApi/Incidentprediction/${id}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    console.log(
                        `Prediction for incident ${id} not found (404). Still polling.`
                    );
                    return null;
                }
                throw new Error(
                    `Failed to fetch predictions (status: ${response.status})`
                );
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                const predictionExists =
                    (Array.isArray(data) && data.length > 0) ||
                    (typeof data === "object" &&
                        data !== null &&
                        Object.keys(data).length > 0);
                if (predictionExists) {
                    console.log(`Prediction found for incident ${id}:`, data);
                    return Array.isArray(data) ? data[0] : data;
                } else {
                    console.log(
                        `Prediction for incident ${id} exists but is empty. Still polling.`
                    );
                    return null;
                }
            } else {
                console.warn(
                    `Received non-JSON response when fetching prediction for incident ${id}`
                );
                return null;
            }
        } catch (error) {
            console.error(
                `Error fetching prediction for incident ${id}:`,
                error
            );
            return null;
        }
    }, []);

    // Add this function to determine if we should show the report
    const shouldShowReport = () => {
        return type_incident !== "Aucun problème environnemental";
    };

    // Modify the useEffect for fetching/sending predictions
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!incidentId || !shouldShowReport()) {
                if (isMounted) setIsLoadingContext(false);
                return;
            }

            try {
                console.log(`Checking prediction for incident: ${incidentId}`);
                const existingPrediction = await fetchPredictionsByIncidentId(
                    incidentId
                );

                if (existingPrediction && isMounted) {
                    console.log(
                        "Setting existing prediction:",
                        existingPrediction
                    );
                    setPrediction(existingPrediction);
                    setPredictionError(null);
                    setIsLoadingContext(false);
                    setIsPolling(false);
                    predictionSentRef.current = true;
                } else if (imgUrl && !predictionSentRef.current && isMounted) {
                    console.log(
                        `No prediction found for ${incidentId}, attempting to send.`
                    );
                    predictionSentRef.current = true;

                    try {
                        await sendPrediction();
                        console.log(
                            `Prediction request sent for incident ${incidentId}. Starting polling.`
                        );
                        if (isMounted) setIsPolling(true);
                    } catch (error) {
                        console.error("Failed to send prediction:", error);
                        if (isMounted) {
                            setPredictionError(
                                "Échec de l'envoi de la prédiction. Problème de connexion au serveur d'analyse."
                            );
                            setIsLoadingContext(false);
                        }
                    }
                } else if (
                    !existingPrediction &&
                    predictionSentRef.current &&
                    isMounted
                ) {
                    console.log(
                        `Prediction sent for ${incidentId}, but no data yet. Ensuring polling is active.`
                    );
                    if (!isPolling) setIsPolling(true);
                } else if (!imgUrl && isMounted) {
                    console.log("Image URL not available yet.");
                } else {
                    if (isMounted) setIsLoadingContext(false);
                }
            } catch (error) {
                console.error("Error in main fetchData effect:", error);
                if (isMounted) {
                    setPredictionError(
                        "Erreur lors de la récupération des données d'analyse."
                    );
                    setIsLoadingContext(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            console.log(
                "Unmounting analyze component or dependencies changed."
            );
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [incidentId, imgUrl, sendPrediction, fetchPredictionsByIncidentId]);

    useEffect(() => {
        let isMounted = true;
        const maxPollingTime = 5 * 60 * 1000;
        const pollingStartTime = Date.now();

        const poll = async () => {
            if (!incidentId) return;

            console.log(`Polling check for incident ${incidentId}...`);

            if (Date.now() - pollingStartTime > maxPollingTime) {
                console.error(
                    `Polling timed out for incident ${incidentId} after 5 minutes.`
                );
                if (isMounted) {
                    setPredictionError(
                        "L'analyse prend plus de temps que prévu. Veuillez vérifier à nouveau plus tard."
                    );
                    setIsLoadingContext(false);
                    setIsPolling(false);
                }
                return;
            }

            const fetchedPrediction = await fetchPredictionsByIncidentId(
                incidentId
            );

            if (fetchedPrediction && isMounted) {
                console.log(`Polling successful for incident ${incidentId}.`);
                setPrediction(fetchedPrediction);
                setPredictionError(null);
                setIsLoadingContext(false);
                setIsPolling(false);
            } else {
                console.log(
                    `Prediction still not available for ${incidentId}. Will poll again.`
                );
            }
        };

        if (isPolling && incidentId) {
            console.log(
                `Starting polling interval for incident ${incidentId}.`
            );
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            pollingIntervalRef.current = setInterval(poll, 15000);

            poll();
        } else {
            if (pollingIntervalRef.current) {
                console.log(
                    `Stopping polling interval for incident ${incidentId}.`
                );
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }

        return () => {
            isMounted = false;
            if (pollingIntervalRef.current) {
                console.log(
                    `Clearing polling interval on effect cleanup for incident ${incidentId}.`
                );
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [isPolling, incidentId, fetchPredictionsByIncidentId]);

    useEffect(() => {
        if (prediction) {
            if (prediction.ndvi_heatmap) {
                console.log("NDVI Heatmap URL:", prediction.ndvi_heatmap);
            } else {
                console.log(
                    "Prediction found but ndvi_heatmap is not available."
                );
            }
        }
    }, [prediction]);

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

    const MarkdownComponents = {
        h1: (props) => <Heading as="h1" size="xl" my={4} {...props} />,
        h2: (props) => <Heading as="h2" size="lg" my={4} {...props} />,
        h3: (props) => <Heading as="h3" size="md" my={3} {...props} />,
        p: (props) => <Text my={2} {...props} />,
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

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
                            {isLoadingContext ? (
                                <Box textAlign="center">
                                    <Heading size="md" mb="4">
                                        {predictionError
                                            ? "Erreur d'Analyse"
                                            : "L'analyse est en cours et le rapport sera fourni dans quelques instants..."}
                                    </Heading>
                                    {predictionError ? (
                                        <Text color="red.500" mb={4}>
                                            {predictionError}
                                        </Text>
                                    ) : (
                                        <Flex
                                            justify="center"
                                            align="center"
                                            mb="4"
                                        >
                                            <Spinner
                                                data-testid="loading-indicator"
                                                size="lg"
                                            />
                                        </Flex>
                                    )}
                                    {!predictionError && <QuotesCarousel />}
                                </Box>
                            ) : type_incident ===
                              "Aucun problème environnemental" ? (
                                <Box mb="4" minH="200px">
                                    <Heading as="h6" size="md" mb="4">
                                        Rapport d'Analyse
                                    </Heading>
                                    <Text mb="4" fontWeight="bold">
                                        Notre modèle a analysé l'image de
                                        l'incident mais n'a détecté aucun
                                        problème environnemental. Par
                                        conséquent, aucun rapport détaillé n'a
                                        été généré.
                                    </Text>
                                    <Text
                                        mb="4"
                                        fontWeight="bold"
                                        color="gray.600"
                                    >
                                        Note: Notre modèle utilise
                                        l'intelligence artificielle et peut donc
                                        ne pas être parfait. Si vous pensez
                                        qu'il s'est trompé, vous pouvez toujours
                                        poursuivre l'analyse de l'incident via
                                        MapChat.
                                    </Text>
                                    <Flex gap="4">
                                        <Button
                                            onClick={handleNavigateLLM}
                                            colorScheme="teal"
                                        >
                                            MapChat
                                        </Button>
                                    </Flex>
                                </Box>
                            ) : (
                                <Box mb="4" minH="200px">
                                    <Heading as="h6" size="md" mb="4">
                                        Rapport d'Analyse
                                    </Heading>
                                    <Text>
                                        <strong>Zone:</strong>{" "}
                                        {zone || "Zone non renseignée"}
                                    </Text>
                                    <Text>
                                        <strong>Coordonnées:</strong> {latitude}
                                        , {longitude}
                                    </Text>
                                    <Text>
                                        <strong>Type d'incident:</strong>{" "}
                                        {type_incident}
                                    </Text>
                                    <Text mt="2">
                                        {predictionError ? (
                                            <Box
                                                p={4}
                                                bg="red.50"
                                                color="red.600"
                                                borderRadius="md"
                                            >
                                                <Heading size="sm" mb={2}>
                                                    Erreur d'analyse
                                                </Heading>
                                                <Text>{predictionError}</Text>
                                            </Box>
                                        ) : expanded ? (
                                            <>
                                                <ReactMarkdown
                                                    components={
                                                        MarkdownComponents
                                                    }
                                                >
                                                    {prediction?.analysis ||
                                                        "Analyse non disponible"}
                                                </ReactMarkdown>
                                                <ReactMarkdown
                                                    components={
                                                        MarkdownComponents
                                                    }
                                                >
                                                    {prediction?.piste_solution ||
                                                        "Non disponible"}
                                                </ReactMarkdown>
                                            </>
                                        ) : (
                                            <ReactMarkdown
                                                components={MarkdownComponents}
                                            >
                                                {`${
                                                    prediction?.analysis
                                                        ? prediction?.analysis.substring(
                                                              0,
                                                              310
                                                          )
                                                        : "Analyse en cours ou non disponible. Si cette situation persiste, veuillez réessayer plus tard ou contacter le support."
                                                }${
                                                    prediction?.analysis
                                                        ? "..."
                                                        : ""
                                                }`}
                                            </ReactMarkdown>
                                        )}
                                        {prediction?.analysis &&
                                            prediction.analysis.length >
                                                300 && (
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
                                    <Flex gap="4">
                                        <Button
                                            onClick={handleNavigateLLM}
                                            colorScheme="teal"
                                        >
                                            MapChat
                                        </Button>
                                        <Button
                                            onClick={onOpen}
                                            colorScheme="teal"
                                        >
                                            Visualiser
                                        </Button>
                                    </Flex>
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent maxW="80vw" maxH="80vh">
                                            <ModalHeader>
                                                Graphiques
                                            </ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Slider {...sliderSettings}>
                                                    <div>
                                                        <Image
                                                            src={
                                                                prediction?.ndvi_heatmap
                                                            }
                                                            alt="NDVI Heatmap"
                                                            mb={4}
                                                            maxW="100%"
                                                            maxH="60vh"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Image
                                                            src={
                                                                prediction?.ndvi_ndwi_plot
                                                            }
                                                            alt="NDVI NDWI Plot"
                                                            mb={4}
                                                            maxW="100%"
                                                            maxH="60vh"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Image
                                                            src={
                                                                prediction?.landcover_plot
                                                            }
                                                            alt="Landcover Plot"
                                                            maxW="100%"
                                                            maxH="60vh"
                                                        />
                                                    </div>
                                                </Slider>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    colorScheme="blue"
                                                    mr={3}
                                                    onClick={onClose}
                                                >
                                                    Fermer
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </Box>
                            )}
                        </Box>
                    </Flex>
                </Card>

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
