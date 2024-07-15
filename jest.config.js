export default {
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "mjs"],
  testMatch: ["**/tests/**/*.test.js", "**/__tests__/**/*.test.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};