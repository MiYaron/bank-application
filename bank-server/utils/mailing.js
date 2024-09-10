import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendVerificationCode(email, client, link) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailTemplate = handlebars.compile(
        fs.readFileSync(__dirname + "/varification_template.html", "utf-8")
    );

    const mailData = {
        client,
        link,
    };

    const builtHTML = mailTemplate(mailData);

    const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: email,
        subject: "ILRD-Bank: Email Verification Required",
        html: builtHTML,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve("Verification email was sent");
            }
        });
    });
}
