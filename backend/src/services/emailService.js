const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendAbandonedCartEmail(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          cart: {
            include: { product: true }
          }
        }
      });

      if (!user || user.cart.length === 0) return;

      const cartTotal = user.cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Complete Your Purchase!',
        html: `
          <h2>Hello ${user.name},</h2>
          <p>We noticed you left some items in your cart. Here's what you're missing out on:</p>
          <ul>
            ${user.cart
              .map(
                item =>
                  `<li>${item.product.name} (${item.quantity}x) - $${(
                    item.product.price * item.quantity
                  ).toFixed(2)}</li>`
              )
              .join('')}
          </ul>
          <p>Cart Total: $${cartTotal.toFixed(2)}</p>
          <p><a href="${process.env.FRONTEND_URL}/cart">Complete your purchase now!</a></p>
          <p>Don't miss out on these great items!</p>
        `
      };

      await this.transporter.sendMail(mailOptions);

      // Record the abandoned cart notification
      await prisma.abandonedCart.create({
        data: {
          userId: user.id,
          cartTotal,
          emailSent: true,
          sentAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error sending abandoned cart email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();