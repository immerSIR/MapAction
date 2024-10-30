import "@testing-library/jest-dom";
import "text-encoding-polyfill";

// Import Jest's expect globally
import { expect } from "@jest/globals";
global.expect = expect;

// Set up TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up DOM environment
const { JSDOM } = require("jsdom");
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: "node.js",
};

// Add any additional setup needed for your tests
