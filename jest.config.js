module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx"],
    testEnvironment: "jsdom",
    setupFiles: ["./jest.setup.js"],
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^config$": "<rootDir>/src/__mocks__/config.js",
    },
    moduleDirectories: ["node_modules", "src"],
};
