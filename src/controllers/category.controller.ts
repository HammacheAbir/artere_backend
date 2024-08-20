import { Category } from '../db/models/category.model';
import { Product } from '../db/models/product.model';

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('subcategories').populate('products');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new category with subcategories and products
export const createCategory = async (req, res) => {
    const { name, description, subcategories, products } = req.body;

    try {
        // Step 1: Create the products
        const createdProducts = await Promise.all(products.map(async productData => {
            const product = new Product(productData);
            return await product.save();
        }));

        // Step 2: Create the subcategories, each with potential child products
        const createdSubcategories = await Promise.all(subcategories.map(async subcategoryData => {
            const { name, description, products: subcategoryProducts } = subcategoryData;

            const createdSubcategoryProducts = await Promise.all(subcategoryProducts.map(async productData => {
                const product = new Product(productData);
                return await product.save();
            }));

            const subcategory = new Category({
                name,
                description,
                products: createdSubcategoryProducts.map(product => product._id)
            });

            return await subcategory.save();
        }));

        // Step 3: Create the main category
        const newCategory = new Category({
            name,
            description,
            subcategories: createdSubcategories.map(subcategory => subcategory._id),
            products: createdProducts.map(product => product._id)
        });

        const savedCategory = await newCategory.save();

        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateCategory = async (req, res) => {
    const { name, description, subcategories, products } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, subcategories, products },
            { new: true }
        ).populate('subcategories').populate('products');
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const linkCategoryToCategory = async (req, res) => {
    const { parentCategoryId, subcategoryId } = req.params;

    try {
        const parentCategory = await Category.findById(parentCategoryId);
        if (!parentCategory) return res.status(404).json({ message: "Parent category not found" });

        const subcategory = await Category.findById(subcategoryId);
        if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

        if (parentCategory.subcategories.includes(subcategoryId)) {
            return res.status(400).json({ message: "Subcategory already linked to this parent category" });
        }

        parentCategory.subcategories.push(subcategoryId);
        await parentCategory.save();

        res.status(200).json({ message: "Subcategory linked to parent category successfully", parentCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unlinkCategoryFromCategory = async (req, res) => {
    const { parentCategoryId, subcategoryId } = req.params;

    try {
        const parentCategory = await Category.findById(parentCategoryId);
        if (!parentCategory) return res.status(404).json({ message: "Parent category not found" });

        if (!parentCategory.subcategories.includes(subcategoryId)) {
            return res.status(400).json({ message: "Subcategory not linked to this parent category" });
        }

        parentCategory.subcategories = parentCategory.subcategories.filter(id => id.toString() !== subcategoryId);
        await parentCategory.save();

        res.status(200).json({ message: "Subcategory unlinked from parent category successfully", parentCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


