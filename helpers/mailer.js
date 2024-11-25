require('dotenv').config();
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

// Email sender function
const sendMail = async (email, subject, content) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_SENDER_EMAIL,
            to: email,
            subject: subject,
            html: content
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

module.exports = {
    sendMail
};
