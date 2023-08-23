export function validateUsername(username: string) {
    if (!username) {
        return false; // Username cannot be empty
    }

    const validCharsRegex = /^[a-z0-9._-]+$/;

    if (!validCharsRegex.test(username)) {
        return false; // Username contains invalid characters
    }

    return true;
}

export function isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}