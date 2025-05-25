import cron from 'node-cron';
import { Seller } from '../modules/seller/seller.model';
import Product from '../modules/product/product.model';

// ⏰ Run every minute to check seller status
cron.schedule('*/5 * * * *', async () => {
	console.log('🔄 Checking seller statuses...');

	const now = new Date();

	try {
		// 1️⃣ Find expired sellers
		const expiredSellers = await Seller.find({ validTill: { $lt: now } });
		console.log(`🧮 Found ${expiredSellers.length} expired seller(s)`);

		for (const seller of expiredSellers) {
			const email = seller.userEmail;
			console.log(`⛔ Expired: ${email}`);

			// Inactivate all products from this seller
			const result = await Product.updateMany(
				{ sellerEmail: email, status: 'active' },
				{ $set: { status: 'inactive' } }
			);

			console.log(`🔻 ${result.modifiedCount} product(s) set to 'inactive'`);
		}

		// 2️⃣ Find valid sellers
		const validSellers = await Seller.find({ validTill: { $gte: now } });
		console.log(`🧮 Found ${validSellers.length} valid seller(s)`);

		for (const seller of validSellers) {
			const email = seller.userEmail;
			console.log(`✅ Valid: ${email}`);

			// Reactivate all previously inactive products for this seller
			const result = await Product.updateMany(
				{ sellerEmail: email, status: 'inactive' },
				{ $set: { status: 'active' } }
			);

			console.log(`🔺 ${result.modifiedCount} product(s) set to 'active'`);
		}
	} catch (err) {
		console.error('❌ Error in cron job:', err);
	}
});
