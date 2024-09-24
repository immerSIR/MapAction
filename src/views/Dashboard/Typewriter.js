// src/views/Dashboard/Typewriter.js

import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import PropTypes from "prop-types";
import "./Typewriter.css"; // Optional: For additional styling

const Typewriter = ({
    text,
    speed = 50,
    onTypingDone,
    onTextUpdate,
    isStopped,
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const currentIndexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        // If typing is stopped, display the full text immediately
        if (isStopped) {
            setDisplayedText(text);
            if (onTypingDone) {
                onTypingDone();
            }
            return;
        }

        // Initialize typing
        setDisplayedText("");
        currentIndexRef.current = 0;

        intervalRef.current = setInterval(() => {
            currentIndexRef.current += 1;
            setDisplayedText(text.slice(0, currentIndexRef.current));

            if (onTextUpdate) {
                onTextUpdate(); // Notify parent component
            }

            if (currentIndexRef.current >= text.length) {
                clearInterval(intervalRef.current);
                if (onTypingDone) {
                    onTypingDone();
                }
            }
        }, speed);

        // Cleanup on unmount or when dependencies change
        return () => clearInterval(intervalRef.current);
    }, [text, speed, onTypingDone, onTextUpdate, isStopped]);

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
    onTextUpdate: PropTypes.func, // Existing prop
    isStopped: PropTypes.bool, // New prop
};

export default Typewriter;
