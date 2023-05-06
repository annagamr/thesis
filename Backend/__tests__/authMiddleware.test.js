const jwt = require("jsonwebtoken");
const db = require("../Models");
const { verifyToken, isAdmin, isUser, isSeller } = require("../Middleware/authMiddleware");
const { Types: { ObjectId } } = require("mongoose");
const User = require('../Models/user.model');
const Role = require('../Models/role.model');


// Mock jwt
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

// Mock User and Role models
db.user = {
    findById: jest.fn(),
};
db.role = {
    find: jest.fn(),
};

describe("verifyToken", () => {
    afterEach(() => {
        jwt.verify.mockClear();
    });

    test("1. Returns a 403 error when no token is provided", async () => {
        const req = {
            headers: {},
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const next = jest.fn();

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Token was not provided" });
        expect(next).not.toHaveBeenCalled();
    });

    test("2. Calls next() when token is valid", async () => {
        const req = {
            headers: {
                "x-access-token": "valid-token",
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const next = jest.fn();

        jwt.verify.mockResolvedValue({ id: "user-id" });

        await verifyToken(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith("valid-token", "my-secret-key");
        expect(req.userId).toBe("user-id");
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    test("3. Returns a 401 error when token is invalid", async () => {
        const req = {
            headers: {
                "x-access-token": "invalid-token",
            },
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        const next = jest.fn();

        // Temporarily mock console.error
        const originalConsoleError = console.error;
        console.error = jest.fn();

        jwt.verify.mockRejectedValue(new Error("Token is invalid!"));

        await verifyToken(req, res, next);

        // Restore console.error
        console.error = originalConsoleError;

        expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "my-secret-key");
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Token is invalid!" });
        expect(next).not.toHaveBeenCalled();
    });
});

async function testRoleMiddleware(middleware, roleName, shouldPass) {
    const req = {
        userId: "507f1f77bcf86cd799439011",
    };
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();

    const userMock = {
        _id: new ObjectId("507f1f77bcf86cd799439011"),
        roles: [
            new ObjectId("507f191e810c19729de860ea"),
            new ObjectId("507f191e810c19729de860eb"),
            new ObjectId("507f191e810c19729de860ec"),
        ],
    };

    User.findById = jest.fn().mockResolvedValue(shouldPass ? userMock : { ...userMock, roles: userMock.roles.slice(1) });

    Role.find = jest.fn().mockImplementation((query) => {
        const roles = [];
    
        if (query._id.$in.some(id => id.equals(userMock.roles[0])) && roleName === "admin" && shouldPass) {
            roles.push({ _id: new ObjectId("507f191e810c19729de860ea"), name: "admin" });
        }
    
        if (query._id.$in.some(id => id.equals(userMock.roles[1])) && roleName === "user") {
            roles.push({ _id: new ObjectId("507f191e810c19729de860eb"), name: "user" });
        }

        if (query._id.$in.some(id => id.equals(userMock.roles[2])) && roleName === "seller") {
            roles.push({ _id: new ObjectId("507f191e810c19729de860ec"), name: "seller" });
        }
    
        return Promise.resolve(roles);
    });

    // Temporarily mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    await middleware(req, res, next);

    // Restore console.error
    console.error = originalConsoleError;

    if (shouldPass) {
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    } else {
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    }
}

describe("isAdmin", () => {
    test("4. Calls next() when user is an admin", async () => {
        await testRoleMiddleware(isAdmin, "admin", true);
    });

    test("4.2 Returns a 403 error when user is not an admin", async () => {
        await testRoleMiddleware(isAdmin, "user", false);
    });
});

describe("isUser", () => {
    test("5. Calls next() when user is a user", async () => {
        await testRoleMiddleware(isUser, "user", true);
    });

    test("5.2 Returns a 403 error when user is not a user", async () => {
        await testRoleMiddleware(isUser, "admin", false);
    });
});

describe("isSeller", () => {
    test("6. Calls next() when user is a seller", async () => {
        await testRoleMiddleware(isSeller, "seller", true);
    });

    test("6.2 Returns a 403 error when user is not a seller", async () => {
        await testRoleMiddleware(isSeller, "user", false);
    });
});