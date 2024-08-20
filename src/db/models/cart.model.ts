import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true } // Add price field
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export const Cart = mongoose.model('Cart', CartSchema);
