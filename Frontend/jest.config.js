module.exports = {
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.{js,jsx}'],
    // coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',

    transform: {
        "^.+\\.(js|jsx|mjs|cjs)$": "babel-jest",
      },
      moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
        "\\.(css|sass)$": "<rootDir>/src/__mocks__/fileMock.js"
      },
      moduleDirectories: ["node_modules", "src"],
      moduleFileExtensions: ["js", "jsx", "json", "node"],
      transformIgnorePatterns: [
        "node_modules/(?!(axios)/)"
      ],
      setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
}

