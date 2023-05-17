const jwt = require("jsonwebtoken");
const db = require("../Models");
const { verifyToken, isAdmin, isUser, isSeller } = require("../Middleware/authMiddleware");
const { Types: { ObjectId } } = require("mongoose");
const User = require('../Models/user.model');
const Role = require('../Models/role.model');


// Mock User and Role models
db.user = {
    findById: jest.fn(),
};
db.role = {
    find: jest.fn(),
};

jest.mock('../Models/user.model')
//mock jwt
jest.mock("jsonwebtoken", () => {
    const originalJwt = jest.requireActual("jsonwebtoken");
    return {
      ...originalJwt, // keep all original functions
      verify: jest.fn(), // override verify function
      JsonWebTokenError: originalJwt.JsonWebTokenError, // keep the original error class
      TokenExpiredError: originalJwt.TokenExpiredError, // keep the original error class
    };
  });
  
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
            send: jest.fn(), 
        };
        const next = jest.fn();

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ message: "Token was not provided" }); 
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
            send: jest.fn(), 
        };
        const next = jest.fn();
    
        jwt.verify.mockReturnValue({ id: "user-id" });
    
        await verifyToken(req, res, next);
    
        expect(jwt.verify).toHaveBeenCalledWith("valid-token", "my-secret-key"); 
        expect(req.userId).toBe("user-id");
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled(); 
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
          send: jest.fn(),
        };
        const next = jest.fn();
      
        // Temporarily mock console.error
        const originalConsoleError = console.error;
        console.error = jest.fn();
      
        jwt.verify.mockImplementation(() => {
          throw new jwt.JsonWebTokenError('Token is invalid!');
        });
      
        await verifyToken(req, res, next);
      
        // Restore console.error
        console.error = originalConsoleError;
      
        expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "my-secret-key"); 
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: "Token is invalid!" });
        expect(next).not.toHaveBeenCalled();
      });
      
    
});


describe("isAdmin", () => {
    test("Should return 200 if user is admin", async () => {
        const req = {
            headers: {
                "user-id": "valid-admin-id",
            },
        };
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const next = jest.fn();

        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({ 
                roles: [{ name: "admin" }] 
            }),
        });

        await isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "User is an admin" });
    });
});

describe("isSeller", () => {
    test("Should return 200 if user is a seller", async () => {
        const req = {
            headers: {
                "user-id": "valid-seller-id",
            },
        };
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const next = jest.fn();

        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({ 
                roles: [{ name: "seller" }] 
            }),
        });

        await isSeller(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "User is a seller" });
    });

    // Add more test cases...
});


describe("isUser", () => {
    test("Should return 200 if user is a customer", async () => {
        const req = {
            headers: {
                "user-id": "valid-user-id",
            },
        };
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const next = jest.fn();

        User.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({ 
                roles: [{ name: "user" }] 
            }),
        });

        await isUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "User is a customer" });
    });

});
