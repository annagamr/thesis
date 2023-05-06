const request = require("supertest");
const { createApp, connectAndInitialize, db } = require("../index");

// Test suite for the server
describe("Server", () => {
    // Test for the root route
    test("1. Returns a welcome message", async () => {
        const app = createApp();
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Welcome to my application." });
    });

    // Test for the connectAndInitialize function
    test("2. connectAndInitialize connects to the database and initialize roles if needed", async () => {
        const originalConsoleLog = console.log;
        console.log = jest.fn();

        // Mock the mongoose connect method
        const originalConnect = db.mongoose.connect;
        db.mongoose.connect = jest.fn().mockResolvedValue();

        const originalEstimatedDocumentCount = db.role.estimatedDocumentCount;
        const originalInsertMany = db.role.insertMany;

        // Scenario 1: Roles count is zero
        db.role.estimatedDocumentCount = jest.fn().mockResolvedValue(0);
        db.role.insertMany = jest.fn();

        await connectAndInitialize();

        expect(console.log).toHaveBeenCalledWith("Connected to database!");
        expect(console.log).toHaveBeenCalledWith("Roles have been initialized!");

        // Scenario 2: Roles count is non-zero
        console.log.mockClear();
        db.role.estimatedDocumentCount = jest.fn().mockResolvedValue(1);

        await connectAndInitialize();
        expect(console.log).toHaveBeenCalledWith("Connected to database!");
        expect(console.log).not.toHaveBeenCalledWith("Roles have been initialized!");

        // Restore the original functions
        console.log = originalConsoleLog;
        db.mongoose.connect = originalConnect;
        db.role.estimatedDocumentCount = originalEstimatedDocumentCount;
        db.role.insertMany = originalInsertMany;
    });
});