/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  verbose: true,
  testRunner: 'jest-circus/runner',
  testEnvironment: './jest-detect-fail.js',
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": process.env.ARTIFACT_DIR || "./artifacts",
      "filename": "report.html",
      "openReport": false,
      "expand": true,
    }]
  ]
};