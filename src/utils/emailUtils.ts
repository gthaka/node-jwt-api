import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const config = process.env

const transporter = nodemailer.createTransport({
    host: config.MAILER_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.MAILER_MAIL,
        pass: config.MAILER_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendResetTokenEmail(toEmail: string, resetToken: string): Promise<void> {
    const mailOptions = {
        from: config.SYS_MAIL,
        to: toEmail,
        subject: 'Password Reset',
        text: `Your password reset token is: ${resetToken}`,
    };

    console.log("📬", mailOptions)
    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset token email sent successfully');
    } catch (error) {
        console.error('Error sending reset token email:', error);
    }
}

async function sendVerificationEmail(toEmail: string, verificationToken: string): Promise<void> {
    const mailOptions = {
        from: config.SYS_MAIL,
        to: toEmail,
        subject: 'Email Verification',
        text: `Your verification token is: ${verificationToken}`,
    };

    console.log("📬", mailOptions)
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

function isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

export { sendResetTokenEmail, sendVerificationEmail, isValidEmailFormat };
