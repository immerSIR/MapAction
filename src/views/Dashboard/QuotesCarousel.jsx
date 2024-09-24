// src/views/Dashboard/QuotesCarousel.jsx

import React, { useState, useEffect } from "react";
import { Text, Box, Fade } from "@chakra-ui/react";

const quotes = [
    "La Terre ne nous appartient pas, nous l'empruntons à nos enfants. – Antoine de Saint-Exupéry",
    "Il n'y a pas de passagers sur le vaisseau Terre. Nous sommes tous membres de l'équipage. – Marshall McLuhan",
    "L'environnement n'est pas une question de politique, mais de survie. – Inconnu",
    "Chaque fois que nous sauvons une goutte d'eau, nous sauvons un peu de notre avenir. – Inconnu",
    "La nature ne fait rien en vain. – Aristote",
    "La préservation de la nature est la plus noble des entreprises humaines. – Inconnu",
    "La planète ne dispose pas de substitut. – Inconnu",
    "La Terre a assez de ressources pour satisfaire les besoins de chacun, mais pas l'avidité de tous. – Mahatma Gandhi",
    "La meilleure façon de prédire l'avenir est de le protéger. – Inconnu",
    "Nous n'héritons pas de la Terre de nos ancêtres, nous l'empruntons à nos enfants. – Antoine de Saint-Exupéry",
];

const QuotesCarousel = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShow(false);
            setTimeout(() => {
                setCurrentQuoteIndex((prevIndex) =>
                    prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
                );
                setShow(true);
            }, 500); // Fade out duration
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Box mt={4} p={2}>
            <Fade in={show} transition={{ duration: 0.5 }}>
                <Text fontStyle="italic" color="gray.600" textAlign="center">
                    "{quotes[currentQuoteIndex]}"
                </Text>
            </Fade>
        </Box>
    );
};

export default QuotesCarousel;
