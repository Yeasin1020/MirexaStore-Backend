import { Schema, model, Types } from 'mongoose';
import { TCategory } from './category.interface';
import slugify from 'slugify';

const categorySchema = new Schema<TCategory>(
	{
		name: { type: String, required: true, unique: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		image: { type: String },
		bannerImage: { type: String },
		description: { type: String },
		isFeatured: { type: Boolean, default: false },
		status: { type: String, enum: ['active', 'inactive'], default: 'active' },
		createdBy: { type: Types.ObjectId, ref: 'User' },
		updatedBy: { type: Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
);

categorySchema.pre('validate', function (next) {
	if (this.name) {
		// Slugify the name and limit it to a maximum length of 60 characters
		const slugifiedName = slugify(this.name, { lower: true, remove: /[^\w\s-]/g }); // Remove special characters
		this.slug = slugifiedName.slice(0, 60); // Limit the slug to 60 characters
	}
	next();
});

const Category = model<TCategory>('Category', categorySchema);

export default Category;
