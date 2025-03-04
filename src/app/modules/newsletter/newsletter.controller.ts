import { Request, Response } from "express";
import * as NewsletterService from "./newsletter.service";

export const subscribe = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required!" });
		}

		const result = await NewsletterService.subscribeToNewsletter(email);

		res.status(201).json({
			message: "Subscribed successfully! 🎉",
			data: result,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const getSubscribers = async (req: Request, res: Response) => {
	try {
		const subscribers = await NewsletterService.getAllSubscribers();
		res.status(200).json({ data: subscribers });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch subscribers!" });
	}
};
