import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 0, default: 0 },
        category: { type: String, required: true, trim: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ createdBy: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
