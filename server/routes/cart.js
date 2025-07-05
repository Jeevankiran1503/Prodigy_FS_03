import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/users.models.js';

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.productId');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(req.user.id);

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Product already in cart, update quantity
            user.cart[itemIndex].quantity = quantity;
        } else {
            // Product not in cart, add new item
            user.cart.push({ productId, quantity });
        }

        await user.save();
        await user.populate('cart.productId');
        res.status(201).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update cart item
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', protect, async (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    try {
        const user = await User.findById(req.user.id);

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity = quantity;
            await user.save();
            await user.populate('cart.productId');
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    const { productId } = req.params;

    try {
        const user = await User.findById(req.user.id);

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        await user.populate('cart.productId');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
