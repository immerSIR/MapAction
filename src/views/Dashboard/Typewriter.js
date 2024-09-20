// src/views/Dashboard/Typewriter.js

import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import PropTypes from "prop-types";
import "./Typewriter.css"; // Optional: For additional styling

const Typewriter = ({ text, speed = 50, onTypingDone, onTextUpdate }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            currentIndex++;
            setDisplayedText(text.slice(0, currentIndex));
            if (onTextUpdate) {
                onTextUpdate(); // Notify parent component
            }
            if (currentIndex >= text.length) {
                clearInterval(interval);
                if (onTypingDone) {
                    onTypingDone();
                }
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onTypingDone, onTextUpdate]);

    // Convert the currently displayed text to HTML
    const rawHtml = marked(displayedText);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);

    return (
        <span
            className="typewriter"
            style={{ color: "inherit" }} // Inherit text color from parent
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
};

Typewriter.propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number,
    onTypingDone: PropTypes.func,
    onTextUpdate: PropTypes.func, // New prop
};

export default Typewriter;
