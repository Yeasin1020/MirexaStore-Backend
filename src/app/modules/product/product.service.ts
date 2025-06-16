// services/product.service.ts

import { Types } from "mongoose";
import { TProduct } from "./product.interface";
import Product from "./product.model";
import { sendEmail } from "../../utils/sendEmail";

// const createProductIntoDb = async (productData: Partial<TProduct>) => {
// 	const newProduct = new Product(productData);
// 	await newProduct.save();
// 	return newProduct;
// };
const createProductIntoDb = async (productData: Partial<TProduct>) => {
	const newProduct = new Product(productData);
	await newProduct.save();

	// 🔔 Email to Seller
	if (newProduct.sellerEmail) {
		const sellerName = newProduct?.sellerName || 'Seller';
		const productName = newProduct?.name || 'your product';

		const subject = `📝 Product Submission Received: ${productName}`;
		const html = `
			<div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
				<h2>Hello ${sellerName},</h2>
				<p>Thank you for submitting <strong>${productName}</strong> to Mirexa Marketplace.</p>
				<p>✅ Your product is currently <strong>under review</strong> and will be reviewed by our admin team shortly.</p>
				<p>You’ll receive an email as soon as your product is approved and made live.</p>
				<br/>
				<p style="font-size: 14px; color: #888;">Regards,<br/>Mirexa Marketplace Team</p>
			</div>
		`;

		await sendEmail(newProduct?.sellerEmail, subject, html);
	}

	// 🔔 Email to Admin
	const adminEmail = "mdeasinsarkar1000@gmail.com"; // 📌 Set this in your .env
	if (adminEmail) {
		const productName = newProduct?.name || 'a product';
		const sellerName = newProduct?.sellerName || 'Unknown Seller';
		const sellerEmail = newProduct?.sellerEmail || 'No Email';

		const subject = `🔔 New Product Pending Review: ${productName}`;
		const html = `
			<div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
				<h2>New Product Submission</h2>
				<p><strong>Product:</strong> ${productName}</p>
				<p><strong>Seller:</strong> ${sellerName}</p>
				<p><strong>Email:</strong> ${sellerEmail}</p>
				<p>Please review and approve this product from the admin dashboard.</p>
				<br/>
				<p style="font-size: 14px; color: #888;">System Notification – Mirexa Marketplace</p>
			</div>
		`;

		await sendEmail(adminEmail, subject, html);
	}

	return newProduct;
};
const getProductsByCategory = async (category: string) => {
	const products = await Product.find({
		category,
		status: "active", // ✅ Only get active products
	})
		.lean()
		.exec();

	if (!products.length) {
		throw new Error("No products found for this category");
	}

	return products;
};



const getProductByCategorySlug = async (category: string, slug: string) => {
	const product = await Product.findOne({ category, slug }).lean().exec();

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};



const getFilteredProducts = async (category?: string, minPrice?: number, maxPrice?: number) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filter: { [key: string]: any } = {};

	if (category) {
		filter.category = category;
	}

	if (minPrice !== undefined || maxPrice !== undefined) {
		filter.price = {};
		if (minPrice !== undefined) {
			filter.price.$gte = minPrice;
		}
		if (maxPrice !== undefined) {
			filter.price.$lte = maxPrice;
		}
	}

	const products = await Product.find(filter);
	return products;
};


const getAllProductsFromDb = async () => {
	return await Product.aggregate([
		{
			$match: { status: 'active' } // Only active products
		},
		{
			$lookup: {
				from: 'reviews', // collection name in MongoDB
				localField: '_id',
				foreignField: 'productId',
				as: 'reviews'
			}
		},
		{
			$addFields: {
				averageRating: { $avg: '$reviews.rating' },
				totalReviews: { $size: '$reviews' }
			}
		},
		{
			$project: {
				reviews: 0 // exclude full reviews array if not needed
			}
		}
	]);
};

const getAffiliateProductsFromDb = async () => {
	return await Product.aggregate([
		{
			$match: {
				status: 'active',
				affiliateLink: { $exists: true, $ne: '' } // Only products with a non-empty affiliate link
			}
		},
		{
			$lookup: {
				from: 'reviews',
				localField: '_id',
				foreignField: 'productId',
				as: 'reviews'
			}
		},
		{
			$addFields: {
				averageRating: { $avg: '$reviews.rating' },
				totalReviews: { $size: '$reviews' }
			}
		},
		{
			$project: {
				reviews: 0
			}
		}
	]);
};


const getInactiveAndDraftProductsFromDb = async () => {
	return await Product.aggregate([
		{
			$match: {
				status: { $in: ['inactive', 'draft'] } // Match inactive or draft
			}
		},
		{
			$lookup: {
				from: 'reviews',
				localField: '_id',
				foreignField: 'productId',
				as: 'reviews'
			}
		},
		{
			$addFields: {
				averageRating: { $avg: '$reviews.rating' },
				totalReviews: { $size: '$reviews' }
			}
		},
		{
			$project: {
				reviews: 0
			}
		}
	]);
};


const getProductBySlug = async (slug: string) => {
	const product = await Product.findOne({ slug });
	if (!product) {
		throw new Error('Product not found');
	}
	return product;
};

const getProductById = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findById(id).lean().exec();

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};
// const getSearchSuggestionsService = async (query: string) => {
// 	const regex = new RegExp(query, "i"); // Case-insensitive match

// 	const suggestions = await Product.find(
// 		{ name: regex }, // ধরে নিচ্ছি আপনার প্রোডাক্টের নাম `name`
// 		"name" // শুধু নাম return করবো suggestion হিসেবে
// 	)
// 		.limit(10)
// 		.lean();

// 	return suggestions;
// };

const updateProductIntoDb = async (id: string, updateData: Partial<TProduct>) => {
	const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
	if (!updatedProduct) {
		throw new Error("Product not found");
	}
	return updatedProduct;
};

const deleteProductFromDb = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findByIdAndDelete(id);

	if (!product) {
		throw new Error("Product not found");
	}
	return product;
};


const getRelatedProducts = async (category: string, excludeId: string) => {
	const relatedProducts = await Product.find({
		category: category,
		_id: { $ne: excludeId }, // Exclude the current product
	}).limit(5); // Limit the number of related products to 5 (or any desired number)

	return relatedProducts;
};

// New service method to update product status to 'inactive'
// const updateProductStatus = async (id: string, newStatus: 'active' | 'inactive' | 'draft') => {
// 	if (!Types.ObjectId.isValid(id)) {
// 		throw new Error("Invalid product ID");
// 	}

// 	const allowedStatuses = ['active', 'inactive', 'draft'];
// 	if (!allowedStatuses.includes(newStatus)) {
// 		throw new Error("Invalid status value");
// 	}

// 	const updatedProduct = await Product.findByIdAndUpdate(
// 		id,
// 		{ status: newStatus },
// 		{ new: true }
// 	).lean().exec();

// 	if (!updatedProduct) {
// 		throw new Error("Product not found");
// 	}

// 	return updatedProduct;
// };

// New service method to update product status to 'inactive'
export const updateProductStatus = async (
	id: string,
	newStatus: 'active' | 'inactive' | 'draft'
) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error('Invalid product ID');
	}

	const allowedStatuses = ['active', 'inactive', 'draft'];
	if (!allowedStatuses.includes(newStatus)) {
		throw new Error('Invalid status value');
	}

	const updatedProduct = await Product.findByIdAndUpdate(
		id,
		{ status: newStatus },
		{ new: true }
	).lean().exec();

	if (!updatedProduct) {
		throw new Error('Product not found');
	}

	// ✅ Send email based on the new status
	if (updatedProduct.sellerEmail) {
		const sellerName = updatedProduct.sellerName || 'Seller';
		const productName = updatedProduct.name || 'Your product';

		// 🎨 Email content based on status
		let subject = '';
		let messageBody = '';

		switch (newStatus) {
			case 'active':
				subject = `✅ Product Approved: ${productName}`;
				messageBody = `
          <p>Great news! Your product <strong>${productName}</strong> has been approved and is now <strong>active</strong> on the marketplace.</p>
          <p>Customers can now view and purchase your product.</p>
        `;
				break;

			case 'inactive':
				subject = `⚠️ Product Inactivated: ${productName}`;
				messageBody = `
          <p>Your product <strong>${productName}</strong> has been marked as <strong>inactive</strong>.</p>
          <p>This means it’s currently not visible to customers. You can update it anytime from your seller dashboard.</p>
        `;
				break;

			case 'draft':
				subject = `📝 Product Moved to Draft: ${productName}`;
				messageBody = `
          <p>Your product <strong>${productName}</strong> has been moved back to <strong>draft</strong> status.</p>
          <p>Please review the listing and publish it again once ready.</p>
        `;
				break;
		}

		const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
        <h2>Hello ${sellerName},</h2>
        ${messageBody}
        <p>Thank you for using <strong>Mirexa Marketplace</strong>.</p>
        <br/>
        <p style="font-size: 14px; color: #888;">Regards,<br/>Mirexa Marketplace Team</p>
      </div>
    `;

		await sendEmail(updatedProduct.sellerEmail, subject, emailHtml);
	}

	return updatedProduct;
};

export const ProductService = {
	createProductIntoDb,
	getProductBySlug,
	getProductsByCategory,
	getProductByCategorySlug,
	getFilteredProducts,
	getAllProductsFromDb,
	getAffiliateProductsFromDb,
	getInactiveAndDraftProductsFromDb,
	getProductById,
	updateProductIntoDb,
	deleteProductFromDb,
	getRelatedProducts,
	updateProductStatus
};
