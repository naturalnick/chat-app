module.exports = {
	moduleNameMapper: {
		"\\.(css|less)$": "<rootDir>/test/jest/__mocks__/styleMock.js",
	},
	transform: {
		"^.+\\.[t|j]sx?$": "babel-jest",
	},
};
