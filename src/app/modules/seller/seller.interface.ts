export type TSellerProfile = {
	role: unknown;
	userEmail: string;

	// ⏰ Seller account expiry
	validTill: Date;

	brand: {
		name: string;
		slug: string;
		logo: string;
		banner: string;
		tagline: string;
		description: string;
		location: string;
		phone: string;
		whatsapp: string;
		bkash: string;

		socialLinks: {
			facebook?: string;
			instagram?: string;
		};

		rating?: number;
		totalReviews?: number;
		verified?: boolean;
		joinedAt?: Date;
	};
};
