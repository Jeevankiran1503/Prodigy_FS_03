import express  from "express";
import Product from "../models/product.model.js";
// import Cart from '../models/cart.model.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/add', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Image upload failed. Please select a file.' });
    }

    const { name, description, price, category, sizes, colors } = req.body;
    const imageUrl = req.file.path;

    // When using FormData, arrays might be sent as comma-separated strings.
    const parsedSizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes;
    const parsedColors = typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors;

    const newProduct = new Product({
        name,
        description,
        price,
        category,
        sizes: parsedSizes || [],
        colors: parsedColors || [],
        imageUrl
    });

    newProduct.save()
        .then(product => res.status(201).json({ message: 'Product added successfully!', product }))
        .catch(err => {
            console.error('Error saving product:', err.message);
            res.status(400).json({ message: 'Error saving product to the database.', error: err.message });
        });
});

router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let products;

    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i'); 
      products = await Product.find({
        $or: [
          { name: regex },
          { category: regex },
          { description: regex }
        ]
      });
    } else {
      products = await Product.find();
    }

    res.json(products);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Delete the product
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the product from all carts
        await Cart.updateMany(
            { 'items.productId': productId },
            { $pull: { items: { productId: productId } } }
        );

        res.json({ message: 'Product deleted and carts updated!' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', error: err.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
      const { name, description, price, category, sizes, colors } = req.body;
  
      // Find the existing product
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Update fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
  
      // Check if new image is uploaded
      if (req.file) {
        product.imageUrl = req.file.path; // Cloudinary URL
      }
  
      await product.save();
      res.json('Product updated!');
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  });
  
export default router;
