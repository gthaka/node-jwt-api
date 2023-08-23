import { expect } from 'chai';
import sinon from 'sinon';
import authController from '../src/controllers/authController';
import userService from '../src/services/userService';
import { mockUser } from '../src/mockData';

describe('Signup Endpoint', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should successfully create a new user on valid input', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const createUserStub = sinon.stub(userService, 'createUser').resolves(mockUser);

        await authController.signup(req, res);
        expect(createUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Signup successful. You should recieve an email with a verification token' })).to.be.true;
    });


    /*
    it('should return 409 if username or email already exists', async () => {
        const req: any = {
            body: {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Simulate the case where the username or email already exists
        const createUserStub = sinon.stub(userService, 'createUser').rejects(new Error('Username or email already taken'));

        await authController.signup(req, res);

        console.info("😎😎", createUserStub.calledOnce)

        expect(createUserStub.calledOnce).to.be.true;
        // expect(res.status.calledWith(409)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Username or email already taken' })).to.be.true;
    });
    */


    it('should handle internal server error', async () => {
        const req: any = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password',
            },
        };
        const res: any = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const createUserStub = sinon.stub(userService, 'createUser').throws(new Error('Database error'));

        await authController.signup(req, res);

        expect(createUserStub.calledOnce).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Internal server error' })).to.be.true;
    });
});


