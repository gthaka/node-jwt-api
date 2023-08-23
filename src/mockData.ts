import User from '../src/models/User';

export const mockUser: User = {
    id: 'testUserId',
    username: 'testuser',
    email: 'test@example.com',
    password: 'my😎password',
    is_verified: true,
    emailVerificationToken: null,
    resetToken: null,
    resetTokenCreatedAt: null,
};

export const mockEmptyUser: User = {
    id: '',
    username: '',
    email: '',
    password: '',
    is_verified: false,
    emailVerificationToken: null,
    resetToken: null,
    resetTokenCreatedAt: null,
};