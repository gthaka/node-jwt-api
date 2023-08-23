/*
import { expect } from 'chai';
import sinon from 'sinon';
import authController from '../src/controllers/authController';
import userService from '../src/services/userService';
import { mockEmptyUser, mockUser } from '../src/mockData';

describe('Signin Endpoint', () => {
    beforeEach(() => {
        async () => {
            const req: any = {
                body: {
                    username: mockUser.username,
                    email: mockUser.email,
                    password: mockUser.password,
                },
            };
            const res: any = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(userService, 'createUser').resolves(mockUser);

            await authController.signup(req, res);
        }
    })
    afterEach(() => {
        sinon.restore();
    });

    it('should successfully signin a user with valid credentials', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // const mockUserN = {
        //     id: 'testUserId',
        //     username: 'testuser',
        //     password: bcrypt.hashSync('password', 10),
        //     is_verified: true,
        // };

        const getUserStub = sinon.stub(userService, 'getUserByUsernameOrEmail').resolves(mockUser);

        await authController.signin(req, res);

        expect(getUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Signin successful' })).to.be.true;
        expect(res.json.args[0][0]).to.have.property('token');
    });

    it('should return 400 if required fields are missing', async () => {
        const req: any = {
            body: {},
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        await authController.signin(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'All fields are required' })).to.be.true;
    });

    it('should return 401 if user is not found', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const getUserStub = sinon.stub(userService, 'getUserByUsernameOrEmail').resolves(mockEmptyUser as User);

        await authController.signin(req, res);

        expect(getUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Unauthorized' })).to.be.true;
    });

    it('should return 401 if password is incorrect', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                password: 'incorrectpassword',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // const mockUser = {
        //     id: 'testUserId',
        //     username: 'testuser',
        //     password: bcrypt.hashSync('password', 10),
        //     is_verified: true,
        // };

        const getUserStub = sinon.stub(userService, 'getUserByUsernameOrEmail').resolves(mockUser as User);

        await authController.signin(req, res);

        expect(getUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Unauthorized' })).to.be.true;
    });

    it('should return 401 if user is not verified', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // const mockUser = {
        //     id: 'testUserId',
        //     username: 'testuser',
        //     password: bcrypt.hashSync('password', 10),
        //     is_verified: false,
        // };

        const getUserStub = sinon.stub(userService, 'getUserByUsernameOrEmail').resolves(mockUser);

        await authController.signin(req, res);

        expect(getUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Unauthorized' })).to.be.true;
    });

    it('should handle internal server error', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const getUserStub = sinon.stub(userService, 'getUserByUsernameOrEmail').throws(new Error('Database error'));

        await authController.signin(req, res);

        expect(getUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Internal server error' })).to.be.true;
    });
});
*/