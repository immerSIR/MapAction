import "@testing-library/jest-dom";

const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
    console.error = (...args) => {
        if (
            /Warning: ReactDOM.render is no longer supported in React 18/.test(
                args[0]
            ) ||
            /Warning: unmountComponentAtNode is deprecated/.test(args[0]) ||
            /Warning: `ReactDOMTestUtils.act`/.test(args[0]) ||
            /Cannot read properties of undefined/.test(args[0]) ||
            /Erreur de requête:/.test(args[0]) ||
            /Erreur lors de/.test(args[0]) ||
            /Incident photo is undefined/.test(args[0]) ||
            /API Error/.test(args[0]) ||
            /TypeError:/.test(args[0]) ||
            /Error:/.test(args[0])
        ) {
            return;
        }
        originalError.call(console, ...args);
    };

    console.log = (...args) => {
        if (
            /latitude:/.test(args[0]) ||
            /longitude:/.test(args[0]) ||
            /Zone:/.test(args[0]) ||
            /la date/.test(args[0]) ||
            /User information/.test(args[0]) ||
            /reponse/.test(args[0]) ||
            /undefined/.test(args[0]) ||
            /les reponses/.test(args[0]) ||
            typeof args[0] === "object" ||
            args[0] === undefined
        ) {
            return;
        }
        originalLog.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
    console.log = originalLog;
});
