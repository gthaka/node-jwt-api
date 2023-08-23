interface User {
    id: string;
    username: string;
    email?: string;
    password: string;
    is_verified?: boolean;
    emailVerificationToken?: string | null
    resetToken?: string | null;
    resetTokenCreatedAt?: Date | null;
}

export default User;
