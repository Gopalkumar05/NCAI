const orderConfirmationTemplate = (order, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .product-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #667eea; }
        .status { display: inline-block; padding: 5px 15px; background: #667eea; color: white; border-radius: 20px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Bloom & Blossom</h1>
          <p>Thank you for your order!</p>
        </div>
        <div class="content">
          <h2>Order Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Your order has been successfully placed. Here are your order details:</p>
          
          <div class="order-details">
            <h3>Order #${order._id}</h3>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span class="status">${order.orderStatus}</span></p>
            
            <h4>Order Items:</h4>
            ${order.orderItems.map(item => `
              <div class="product-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            
            <hr>
            <div class="product-item">
              <span>Subtotal</span>
              <span>$${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div class="product-item">
              <span>Shipping</span>
              <span>$${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div class="product-item">
              <span>Tax</span>
              <span>$${order.taxPrice.toFixed(2)}</span>
            </div>
            <div class="product-item total">
              <span>Total</span>
              <span>$${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <h4>Shipping Address:</h4>
          <p>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
            ${order.shippingAddress.country} ${order.shippingAddress.zipCode}
          </p>
          
          <p>You can track your order using this link:</p>
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">Track Order</a>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>The Bloom & Blossom Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const welcomeEmailTemplate = (user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .welcome-bonus { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .discount { font-size: 32px; color: #f5576c; font-weight: bold; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Welcome to Bloom & Blossom!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name}!</h2>
          <p>Welcome to Bloom & Blossom! We're thrilled to have you join our community of flower lovers.</p>
          
          <div class="welcome-bonus">
            <h3>🎁 Welcome Gift!</h3>
            <p>Use this code on your first order:</p>
            <p class="discount">WELCOME10</p>
            <p>Get 10% off on your first purchase!</p>
          </div>
          
          <p>Here's what you can do with your account:</p>
          <ul>
            <li>Browse our beautiful collection of flowers</li>
            <li>Save your favorite bouquets to wishlist</li>
            <li>Track your orders easily</li>
            <li>Save multiple shipping addresses</li>
            <li>Get exclusive member-only offers</li>
          </ul>
          
          <p>Start exploring now:</p>
          <a href="${process.env.FRONTEND_URL}/products" class="button">Shop Now</a>
          
          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
          
          <p>Happy shopping!<br>The Bloom & Blossom Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const passwordResetTemplate = (resetToken, user) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>We received a request to reset your password for your Bloom & Blossom account.</p>
          
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="note">
            <p><strong>Note:</strong> This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          
          <p>If the button above doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          
          <p>Best regards,<br>The Bloom & Blossom Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const orderShippedTemplate = (order, user, trackingNumber) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .tracking-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .tracking-number { font-size: 24px; letter-spacing: 2px; color: #43e97b; font-weight: bold; padding: 10px; border: 2px dashed #43e97b; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .estimated-delivery { background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Your Order is on the Way!</h1>
        </div>
        <div class="content">
          <h2>Good news, ${user.name}!</h2>
          <p>Your order #${order._id} has been shipped and is on its way to you!</p>
          
          <div class="tracking-box">
            <h3>Tracking Number</h3>
            <div class="tracking-number">${trackingNumber}</div>
            <p>Use this number to track your package</p>
          </div>
          
          <div class="estimated-delivery">
            <h4>📅 Estimated Delivery</h4>
            <p>${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} (within 3 business days)</p>
          </div>
          
          <p>Track your order:</p>
          <a href="${process.env.FRONTEND_URL}/track/${trackingNumber}" class="button">Track Package</a>
          
          <p><strong>Delivery Instructions:</strong></p>
          <ul>
            <li>Please ensure someone is available to receive the delivery</li>
            <li>Flowers should be placed in water immediately upon arrival</li>
            <li>Keep away from direct sunlight and heat sources</li>
          </ul>
          
          <p>If you have any questions about your delivery, please contact our support team.</p>
          
          <p>Best regards,<br>The Bloom & Blossom Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  orderConfirmationTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
  orderShippedTemplate
};