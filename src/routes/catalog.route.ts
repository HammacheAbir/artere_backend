import express from 'express';
import {
    createProduct,
    updateProductByName,
    deleteProductByName,
    getAllProducts,
    linkProductToCategory,
    unlinkProductFromCategory
} from '../controllers/product.controler';

import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    linkCategoryToCategory,
    unlinkCategoryFromCategory
} from '../controllers/category.controller';

export const router = express.Router();

// Product Routes
router.get('/products', getAllProducts);  
router.post('/products', createProduct);          
router.put('/products/:name', updateProductByName);       
router.delete('/products/:name', deleteProductByName); 
router.post('/categories/:categoryId/products/:productId', linkProductToCategory);
router.delete('/categories/:categoryId/products/:productId', unlinkProductFromCategory);

// Category Routes
router.get('/categories', getAllCategories);  
router.post('/categories', createCategory);       
router.put('/categories/:id', updateCategory);    
router.delete('/categories/:id', deleteCategory); 
router.post('/categories/:parentCategoryId/subcategories/:subcategoryId', linkCategoryToCategory);
router.delete('/categories/:parentCategoryId/subcategories/:subcategoryId', unlinkCategoryFromCategory);

