import nodemailer from "nodemailer";

interface OrderItem {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_id?: any;
	productId: string;
	quantity: number;
	price: number;
}

export const sendOrderConfirmationEmail = async (
	to: string, name: string, orderId: string, items: OrderItem[], totalAmount: number, shippingCost: number, discountApplied: number, grandTotal: number, totalPrice: number) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "mdeasinsarkar01@gmail.com",
			pass: "jbhj tcjz jckg nhny",
		},
	});

	// 🛒 Products table তৈরি
	const itemsTableRows = items
		.map(
			(item, index) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item._id.toString().slice(-6)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">৳${item.price.toFixed(2)}</td>
      </tr>
    `
		)
		.join("");

	const mailOptions = {
		from: '"MirexaStore" <mdeasinsarkar01@gmail.com>',
		to,
		subject: "🛒 Your MirexaStore Order Confirmation",
		html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${name},</h2>
        <p>Thank you for your order from <strong>MirexaStore</strong>!</p>
        <p>Your Order ID is <strong>${orderId}</strong>.</p>

        <h3>🛍️ Order Summary:</h3>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">#</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Product ID</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>

        <h3 style="margin-top: 20px;">💰 Payment Summary:</h3>
        <p>Subtotal: ৳${totalAmount.toFixed(2)}</p>
        <p>Shipping Cost: ৳${shippingCost.toFixed(2)}</p>
        <p>Discount Applied: ৳${discountApplied.toFixed(2)}</p>
        <p><strong>Grand Total: ৳${grandTotal.toFixed(2)}</strong></p>
        <p><strong> Total Amount: ৳${totalPrice.toFixed(2)}</strong></p>

        <p>We will notify you once your order has been shipped. You can always contact us if you have any questions.</p>

        <br/>
        <p>Best regards,<br/>The MirexaStore Team</p>
      </div>
    `,
	};

	await transporter.sendMail(mailOptions);
};
