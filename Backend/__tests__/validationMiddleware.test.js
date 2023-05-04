const { checkDuplicateUsernameOrEmailAndRolesExisted } = require('../Middleware/validationMiddleware');
const db = require('../Models');
const httpMocks = require('node-mocks-http');

jest.mock('../Models', () => ({
    user: {
        findOne: jest.fn(),
    },
    ROLES: ['user', 'admin', 'moderator'],
}));

describe('checkDuplicateUsernameOrEmailAndRolesExisted', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });


    test('should return 400 if username already exists', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                username: 'testUsername',
                email: 'test@email.com',
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        db.user.findOne.mockResolvedValueOnce({ username: 'testUsername' });

        await checkDuplicateUsernameOrEmailAndRolesExisted(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Failed! Username is already in use!' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 if email already exists', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                username: 'testUsername',
                email: 'test@email.com',
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        db.user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ email: 'test@email.com' });

        await checkDuplicateUsernameOrEmailAndRolesExisted(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Failed! Email is already in use!' });
        expect(next).not.toHaveBeenCalled();
    });
    test('should return 400 if role does not exist', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                username: 'testUsername',
                email: 'test@email.com',
                roles: ['invalidRole'],
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        db.user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await checkDuplicateUsernameOrEmailAndRolesExisted(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Failed! Role invalidRole does not exist!' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next() if validation is successful', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                username: 'testUsername',
                email: 'test@email.com',
                roles: ['user'],
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        db.user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await checkDuplicateUsernameOrEmailAndRolesExisted(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(next).toHaveBeenCalled();
    });

});