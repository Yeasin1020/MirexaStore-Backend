import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
	try {
		const info = await transporter.sendMail({
			from: `"Subscription System" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html,
		});

		console.log("✅ Email sent successfully!");
		console.log("📨 Message ID:", info.messageId);
		console.log("📤 Email To:", to);
	} catch (error) {
		console.error("❌ Failed to send email.");
		console.error("Error:", error);
	}
};
