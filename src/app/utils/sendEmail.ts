import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,  // e.g. your Gmail address
			pass: process.env.EMAIL_PASS   // app password or regular password with less secure access
		}
	});

	await transporter.sendMail({
		from: `"MirexaStore" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
	});
};
