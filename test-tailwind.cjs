const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('./frontend/tailwind.config.js');

const fullConfig = resolveConfig(tailwindConfig);
console.log("Colors available in config:");
const colors = fullConfig.theme.colors;
console.log(Object.keys(colors).join(', '));
if (colors.slate) {
    console.log("slate is present", Object.keys(colors.slate));
} else {
    console.log("slate is MISSING");
}
if (colors.white) console.log("white is present");
