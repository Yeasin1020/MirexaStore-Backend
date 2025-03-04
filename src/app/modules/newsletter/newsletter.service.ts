import { NewsletterSubscriber } from "./newsletter.model";


export const subscribeToNewsletter = async (email: string) => {
	const existingSubscriber = await NewsletterSubscriber.findOne({ email });
	if (existingSubscriber) {
		throw new Error("You are already subscribed to the newsletter!");
	}

	const subscriber = await NewsletterSubscriber.create({ email });
	return subscriber;
};

export const getAllSubscribers = async () => {
	return await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
};
