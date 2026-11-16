import Product from '../models/product.js';
import { isAdmin } from './userController.js';

// Create a new product
export async function createProduct(req, res) {
    
    if(!isAdmin(req)) {
        res.status(403).json({
            message: 'Access denied. Admins only.',
        });
        return;
    }
    try {
        const productData = req.body;

        const product = new Product(productData);

        await product.save()

        res.json({
            message: 'Product created successfully',
            product: product
        })
    } catch {
        console.error(err);
        res.status(500).json({
            message: 'Error creating product',
        })
    }
}

export async function getProducts(req, res) {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching products',
        })
    }
}

// Update a product by ID
export async function updateProduct(req, res) {
    if(!isAdmin(req)) {
        res.status(403).json({
            message: 'You are not authorized to update products. Admins only.',
        });
        return;
    }
    try {
        const productID = req.params.productID;
        const updatedData = req.body;
        await Product.updateOne(
            { productID: productID },
            updatedData
        );
        res.json({
            message: 'Product updated successfully',
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Error updating product',
        })
    }
}

// Delete a product by ID
export async function deleteProduct(req, res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message: 'You are not authorized to delete products. Admins only.',
        });
        return;
    }
    try {
        const productID = req.params.productID;

        await Product.deleteOne({
            productID: productID
        })
        res.json({
            message: 'Product deleted successfully',
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting product',
        })
    }
}

// Get a product by ID
export async function getProductById(req, res) {
    try {
        const productID = req.params.productID;

        const product = await Product.findOne(
            {
                productID: productID
            }
        )
        if(product == null) {
            res.status(404).json({
                message: 'Product not found',
            })
        } else {
            res.json(product);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching product',
        })
    }
}