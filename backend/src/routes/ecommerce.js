const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Add item to cart
router.post('/cart', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity,
        userId: req.user.id,
        productId
      },
      include: { product: true }
    });
    res.json(cartItem);
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// Get user's cart
router.get('/cart', auth, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    res.json(cartItems);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Create order from cart
router.post('/orders', auth, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        orderItems: {
          create: cartItems.map(item => ({
            quantity: item.quantity,
            price: item.product.price,
            productId: item.product.id
          }))
        }
      },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });

    // Clear cart after order creation
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;