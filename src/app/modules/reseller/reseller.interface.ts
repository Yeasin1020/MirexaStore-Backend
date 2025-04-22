// ✅ Interface (reseller.interface.ts)
export type TResellerProfile = {
	role: unknown;
	userEmail: string;
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