const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductService {
  static async getRecommendedProducts(productId, limit = 5) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          recommendedWith: true
        }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Get products in the same category
      const similarProducts = await prisma.product.findMany({
        where: {
          category: product.category,
          id: { not: productId }
        },
        take: limit
      });

      return similarProducts;
    } catch (error) {
      console.error('Error getting recommended products:', error);
      throw error;
    }
  }

  static async updateInventory(productId, quantity, operation = 'decrease') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const updatedQuantity = operation === 'decrease' 
        ? Math.max(0, product.inventory - quantity)
        : product.inventory + quantity;

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { inventory: updatedQuantity }
      });

      // Check if inventory is low
      if (updatedProduct.inventory < 10) {
        // Here you could implement notification logic
        console.log(`Low inventory alert for product ${productId}`);
      }

      return updatedProduct;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }

  static async updateProductTranslations(productId, translations) {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { translations }
      });
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product translations:', error);
      throw error;
    }
  }

  static async getProductInventoryStatus() {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          inventory: true,
          category: true
        }
      });

      const status = {
        lowStock: products.filter(p => p.inventory < 10),
        outOfStock: products.filter(p => p.inventory === 0),
        inStock: products.filter(p => p.inventory >= 10)
      };

      return status;
    } catch (error) {
      console.error('Error getting inventory status:', error);
      throw error;
    }
  }
}

module.exports = ProductService;