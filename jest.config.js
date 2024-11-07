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
    "react-leaflet": "<rootDir>/src/__mocks__/reactLeafletMock.js",
    "react-apexcharts": "<rootDir>/src/__mocks__/apexcharts.js",
    "^components/(.*)$": "<rootDir>/src/components/$1",
    "^context/(.*)$": "<rootDir>/src/context/$1",
    "^assets/(.*)$": "<rootDir>/src/assets/$1",
    "^layouts/(.*)$": "<rootDir>/src/layouts/$1",
    "^Fonctions/(.*)$": "<rootDir>/src/Fonctions/$1",
    "^theme/(.*)$": "<rootDir>/src/theme/$1",
    "^variables/(.*)$": "<rootDir>/src/variables/$1",
    "^views/(.*)$": "<rootDir>/src/views/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  roots: ["<rootDir>/src"],
  testMatch: ["<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)"],
  transformIgnorePatterns: ["/node_modules/(?!(@testing-library/jest-dom)/)"],
  verbose: true,
  // Add this block for full coverage collection
  collectCoverage: true, // Enable collection of coverage data
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{js,jsx,ts,tsx}", // Collect coverage from all files in src
    "!<rootDir>/src/**/*.d.ts", // Exclude TypeScript declaration files
    "!<rootDir>/src/**/*.test.{js,jsx,ts,tsx}", // Exclude test files themselves
  ],
  coverageDirectory: "<rootDir>/coverage", // Specify where to store coverage reports
  coverageThreshold: {
    global: {
      branches: 80, // Adjust according to your desired coverage thresholds
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
