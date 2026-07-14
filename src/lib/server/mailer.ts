import nodemailer from "nodemailer";
import { env } from "$env/dynamic/private";

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

function getTransporter() {
	if (!transporter) {
		if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
			throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");
		}

		transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: env.GMAIL_USER,
				pass: env.GMAIL_APP_PASSWORD
			}
		});
	}

	return transporter;
}

async function sendMail(to: string, subject: string, html: string, text: string) {
	const from = env.GMAIL_USER;
	await getTransporter().sendMail({ from: `SxE <${from}>`, to, subject, html, text });
}

export async function sendConfirmationEmail(email: string, token: string, origin: string) {
	const confirmUrl = `${origin}/confirm?token=${token}`;

	await sendMail(
		email,
		"Confirm your SxE newsletter subscription",
		`<p>Hi,</p>
		<p>Please confirm your subscription to the SxE newsletter by clicking the link below:</p>
		<p><a href="${confirmUrl}">${confirmUrl}</a></p>
		<p>If you didn't request this, you can ignore this email — you won't be subscribed.</p>`,
		`Please confirm your subscription to the SxE newsletter: ${confirmUrl}\n\nIf you didn't request this, you can ignore this email — you won't be subscribed.`
	);
}

export async function sendWelcomeEmail(email: string, token: string, origin: string) {
	const unsubscribeUrl = `${origin}/unsubscribe?token=${token}`;

	await sendMail(
		email,
		"You're subscribed to the SxE newsletter",
		`<p>Hi,</p>
		<p>You're now subscribed to the SxE newsletter. We'll email you about new podcast episodes, resources and formats around science and entrepreneurship.</p>
		<p>You can unsubscribe and delete your data at any time here: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a></p>`,
		`You're now subscribed to the SxE newsletter.\n\nYou can unsubscribe and delete your data at any time here: ${unsubscribeUrl}`
	);
}
