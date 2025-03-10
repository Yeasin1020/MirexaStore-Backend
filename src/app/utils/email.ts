import nodemailer from "nodemailer";
import { OrderEmailData, OrderItem } from "../interface/email";

export const sendOrderConfirmationEmail = async ({
  to,
  name,
  phone,
  orderId,
  address,
  deliveryNote,
  country,
  district,
  city,
  items,
  totalAmount,
  shippingCost,
  discountApplied,
  grandTotal,
  totalPrice,
}: OrderEmailData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mdeasinsarkar01@gmail.com",
      pass: "jbhj tcjz jckg nhny",
    },
  });

  // ✅ Product Table Generator
  const generateItemsTable = (items: OrderItem[]) =>
    items
      .map(
        (item, index) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.productId.toString().slice(-6)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">৳${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

  const itemsTableRows = generateItemsTable(items);

  // ✅ Shared Payment Summary
  const paymentSummary = `
    <p>Subtotal: ৳${totalAmount.toFixed(2)}</p>
    <p>Shipping Cost: ৳${shippingCost.toFixed(2)}</p>
    <p>Discount Applied: ৳${discountApplied.toFixed(2)}</p>
    <p><strong>Grand Total: ৳${grandTotal.toFixed(2)}</strong></p>
    <p><strong>Total Amount to be Paid(After Discount): ৳${totalPrice.toFixed(2)}</strong></p>
  `;

  // ✅ User Email HTML
  const userEmailHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 700px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background: #f9f9f9;">
    <h2 style="text-align: center; color: #F85606;">🎉 Thank You for Your Order, ${name}!</h2>
    <p style="text-align: center;">Your order has been successfully placed. Below are your order details:</p>

    <div style="background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-top: 20px;">
      <h3 style="border-bottom: 2px solid #F85606; padding-bottom: 8px;">🛒 Order ID: <span style="color: #555;">${orderId}</span></h3>

      <h3 style="margin-top: 20px; color: #333;">🛍️ Order Summary:</h3>
      <table style="border-collapse: collapse; width: 100%; margin-top: 10px; text-align: center;">
        <thead style="background: #F85606; color: white;">
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd;">#</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Product ID</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsTableRows}</tbody>
      </table>

      <h3 style="margin-top: 20px; color: #333;">💰 Payment Summary:</h3>
      <div style="padding: 10px; background: #f2f2f2; border-radius: 8px; margin-bottom: 20px;">
        <p>Subtotal: <strong>৳${totalAmount.toFixed(2)}</strong></p>
        <p>Shipping Cost: <strong>৳${shippingCost.toFixed(2)}</strong></p>
        <p>Discount Applied: <strong>৳${discountApplied.toFixed(2)}</strong></p>
        <p><strong>Grand Total: ৳${grandTotal.toFixed(2)}</strong></p>
        <p style="font-size: 16px; color: #F85606;"><strong>Total Amount to be Paid (After Discount): ৳${totalPrice.toFixed(2)}</strong></p>
      </div>

      <h3 style="margin-top: 20px; color: #333;">📦 Shipping Details:</h3>
      <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${to}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${address}, ${city}, ${district}, ${country}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Delivery Note:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${deliveryNote}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; color: #555;">🚚 <strong>Delivery Status:</strong> Pending</p>

      <p style="margin-top: 20px; text-align: center; font-size: 16px;">We will notify you once your order has been shipped. If you have any questions, feel free to contact us. 😊</p>

      <p style="text-align: center; margin-top: 30px;">❤️ Thank you for shopping with <strong>MirexaStore</strong>!</p>
    </div>

    <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">© 2025 MirexaStore. All rights reserved.</p>
  </div>
`;


  // ✅ Admin Email HTML
  const adminEmailHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>🛒 New Order Received!</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Order Date:</strong> ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</p>
    <p><strong>Customer Name:</strong> ${name}</p>
    <p><strong>Customer Email:</strong> ${to}</p>
    <h3>🚚 Shipping Details:</h3>
    <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${to}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${address}, ${city}, ${district}, ${country}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Delivery Note:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${deliveryNote || "N/A"}</td>
      </tr>
    </table>

    <h3 style="margin-top: 20px;">🛍️ Ordered Products:</h3>
    <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <thead>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">#</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Product ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsTableRows}</tbody>
    </table>

    <h3 style="margin-top: 20px;">💰 Payment Summary:</h3>
    ${paymentSummary}

    <h3 style="margin-top: 20px;">📦 Delivery Status: <span style="color: orange;">Pending</span></h3>
    <p><strong>Discount Applied:</strong> ৳${discountApplied.toFixed(2)}</p>
    <p><strong>Grand Total (After Discount):</strong> ৳${grandTotal.toFixed(2)}</p>
    <p><strong>Total Amount to be Paid (After Discount):</strong> ৳${totalPrice.toFixed(2)}</p>

    <p style="margin-top: 20px;">Please process this order as soon as possible.</p>
    <br/>
    <p>Regards,<br/>MirexaStore System</p>
  </div>
`;


  // ✅ Email Options
  const userMailOptions = {
    from: '"MirexaStore" <mdeasinsarkar01@gmail.com>',
    to,
    subject: "🛒 Your MirexaStore Order Confirmation",
    html: userEmailHtml,
  };

  const adminMailOptions = {
    from: '"MirexaStore" <mdeasinsarkar01@gmail.com>',
    to: "mdeasinsarkar1000@gmail.com",
    subject: `🛒 New Order Alert! Order ID: ${orderId}`,
    html: adminEmailHtml,
  };

  // ✅ Send Mails
  await Promise.all([
    transporter.sendMail(userMailOptions),
    transporter.sendMail(adminMailOptions),
  ]);
};
