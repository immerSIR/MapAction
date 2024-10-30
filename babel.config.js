module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: [
        "@babel/plugin-syntax-import-attributes",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-optional-chaining",
    ],
};
