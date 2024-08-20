import { Cart } from "../db/models/cart.model";
import { Product } from "../db/models/product.model";


export const createCart = async (req, res) => {
    const { userId } = req.body;

    try {
        // let cart = await Cart.findOne({ userId });

        // if (cart) {
        //     return res.status(400).json({ message: "Cart already exists for this user" });
        // }

        const cart = new Cart({ userId, items: [] });
        await cart.save();

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const price = product.price;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const result = await Cart.updateOne(
            { userId },
            { $pull: { items: { productId: productId } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const updatedCart = await Cart.findOne({ userId });
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductQuantityInCart = async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCartTotal = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        let total = 0;

        for (const item of cart.items) {
            total += item.price * item.quantity;
        }

        res.status(200).json({ total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




