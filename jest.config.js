module.exports = {
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/src/__mocks__/fileMock.js",
    },
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
        "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
    ],
    transformIgnorePatterns: ["/node_modules/(?!(@testing-library/jest-dom)/)"],
    verbose: true,
};
