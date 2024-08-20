import { Category } from '../db/models/category.model';
import { Product } from '../db/models/product.model';


// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new product
export const createProduct = async (req, res) => {
    const { name, price, quantity } = req.body;
    const newProduct = new Product({ name, price, quantity });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product by name
export const updateProductByName = async (req, res) => {
    const { name, price, quantity } = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { name: req.params.name }, // Find the product by name
            { name, price, quantity },  // Update the product fields
            { new: true }               // Return the updated document
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a product by name
export const deleteProductByName = async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ name: req.params.name }); // Find and delete the product by name
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const linkProductToCategory = async (req, res) => {
    const { productId, categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (category.products.includes(productId)) {
            return res.status(400).json({ message: "Product already linked to this category" });
        }

        category.products.push(productId);
        await category.save();

        res.status(200).json({ message: "Product linked to category successfully", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const unlinkProductFromCategory = async (req, res) => {
    const { productId, categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (!category.products.includes(productId)) {
            return res.status(400).json({ message: "Product not linked to this category" });
        }

        category.products = category.products.filter(id => id.toString() !== productId);
        await category.save();

        res.status(200).json({ message: "Product unlinked from category successfully", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


