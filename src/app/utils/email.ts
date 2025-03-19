import nodemailer from "nodemailer";
import { OrderEmailData, OrderItem } from "../interface/email";

export const sendOrderConfirmationEmail = async ({
  to,
  name,
  phone,
  orderId,
  address,
  status,
  deliveryNote,
  country,
  district,
  city,
  items,
  totalAmount,
  shippingCost,
  discountApplied,
  totalPrice,
}: OrderEmailData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Environment variable for Gmail user
      pass: process.env.EMAIL_PASS,  // Environment variable for Gmail password
    },
  });

  // ✅ Product Table Generator
  const generateItemsTable = (items: OrderItem[]) =>
    items
      .map(
        (item, index) => `
     <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.productId?.toString().slice(-6) || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.color}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.size}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">৳${item.price ? item.price.toFixed(2) : '0.00'}</td>
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
    <p><strong>Total Amount to be Paid (After Discount): ৳${totalPrice.toFixed(2)}</strong></p>
  `;

  // ✅ User Email HTML
  const userEmailHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
    <h2 style="text-align: center; color: #F85606;">🎉 Thank You for Your Order, ${name}!</h2>
    <p>Your order has been successfully placed. Below are your order details:</p>

    <h3>🛒 Order ID: ${orderId}</h3>

    <h3>🛍️ Order Summary:</h3>
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      <thead style="background: #F85606; color: white;">
        <tr>
          <th>#</th>
          <th>Product ID</th>
          <th>Name</th>
          <th>Color</th>
          <th>Size</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>${itemsTableRows}</tbody>
    </table>

    <h3>💰 Payment Summary:</h3>
    ${paymentSummary}

    <h3>📦 Shipping Details:</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${to}</p>
    <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
    <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

    <p style="color: orange;">🚚 Delivery Status: ${status}</p>
    <p style="text-align: center; margin-top: 30px;">❤️ Thank you for shopping with <strong>MirexaStore</strong>!</p>
  </div>
`;

  // ✅ Admin Email HTML
  const adminEmailHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 10px;">
    <h2>🛒 New Order Received!</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Order Date:</strong> ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</p>
    <p><strong>Customer Name:</strong> ${name}</p>
    <p><strong>Customer Email:</strong> ${to}</p>

    <h3>📦 Shipping Details:</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${to}</p>
    <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
    <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

    <h3>🛍️ Ordered Products:</h3>
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      <thead>
        <tr>
          <th>#</th>
          <th>Product ID</th>
          <th>Name</th>
          <th>Color</th>
          <th>Size</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>${itemsTableRows}</tbody>
    </table>

    <h3>💰 Payment Summary:</h3>
    ${paymentSummary}

    <h3>🚚 Delivery Status: <span style="color: orange;">Pending</span></h3>
  </div>
`;

  // ✅ Shipment Email HTML
  //   const shipmentEmailHtml = `
  // <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
  //   <h2 style="text-align: center; color: #F85606;">🚚 Your Order is On the Way, ${name}!</h2>
  //   <p>We are pleased to inform you that your order is now being shipped.</p>

  //   <h3>🛒 Order ID: ${orderId}</h3>

  //   <h3>📦 Shipping Details:</h3>
  //   <p><strong>Name:</strong> ${name}</p>
  //   <p><strong>Phone:</strong> ${phone}</p>
  //   <p><strong>Email:</strong> ${to}</p>
  //   <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
  //   <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

  //   <h3>🛍️ Ordered Products:</h3>
  //   <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
  //     <thead style="background: #F85606; color: white;">
  //       <tr>
  //         <th>#</th>
  //         <th>Product ID</th>
  //         <th>Name</th>
  //         <th>Color</th>
  //         <th>Size</th>
  //         <th>Qty</th>
  //         <th>Price</th>
  //       </tr>
  //     </thead>
  //     <tbody>${itemsTableRows}</tbody>
  //   </table>

  //   <h3>💰 Payment Summary:</h3>
  //   ${paymentSummary}

  //   <p style="color: orange;">🚚 Current Status: Shipped</p>
  //   <p style="text-align: center; margin-top: 30px;">📦 Your order is on the way and will arrive soon!</p>
  // </div>
  // `;

  // ✅ Delivery Email HTML
  //   const deliveryEmailHtml = `
  // <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
  //   <h2 style="text-align: center; color: #F85606;">🎉 Your Order Has Been Delivered, ${name}!</h2>
  //   <p>We are delighted to inform you that your order has been successfully delivered to the address you provided.</p>

  //   <h3>🛒 Order ID: ${orderId}</h3>

  //   <h3>📦 Delivery Details:</h3>
  //   <p><strong>Name:</strong> ${name}</p>
  //   <p><strong>Phone:</strong> ${phone}</p>
  //   <p><strong>Email:</strong> ${to}</p>
  //   <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
  //   <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

  //   <h3>🛍️ Ordered Products:</h3>
  //   <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
  //     <thead style="background: #F85606; color: white;">
  //       <tr>
  //         <th>#</th>
  //         <th>Product ID</th>
  //         <th>Name</th>
  //         <th>Color</th>
  //         <th>Size</th>
  //         <th>Qty</th>
  //         <th>Price</th>
  //       </tr>
  //     </thead>
  //     <tbody>${itemsTableRows}</tbody>
  //   </table>

  //   <h3>💰 Payment Summary:</h3>
  //   ${paymentSummary}

  //   <p style="color: green; font-weight: bold;">🎉 Your order has been successfully delivered!</p>
  // </div>
  // `;

  try {
    // Send email based on the order status
    await transporter.sendMail({
      from: process.env.GMAIL_USER,  // Using environment variable for the sender email
      to,
      subject: "MirexaStore Order Confirmation",
      html: userEmailHtml,
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,  // Using environment variable for the sender email
      to: "admin@mirexastore.com",  // Admin email address
      subject: `New Order Received: ${orderId}`,
      html: adminEmailHtml,
    });

    // if (status === "Shipped") {
    //   await transporter.sendMail({
    //     from: process.env.GMAIL_USER,  // Using environment variable for the sender email
    //     to,
    //     subject: "Your Order is On the Way!",
    //     html: shipmentEmailHtml,
    //   });
    // } else if (status === "Delivered") {
    //   await transporter.sendMail({
    //     from: process.env.GMAIL_USER,  // Using environment variable for the sender email
    //     to,
    //     subject: "Your Order Has Been Delivered",
    //     html: deliveryEmailHtml,
    //   });
    // }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export const sendOrderStatusConfirmationEmail = async ({
  to,
  name,
  phone,
  orderId,
  address,
  status,
  deliveryNote,
  country,
  district,
  city,
  items,
  totalAmount,
  shippingCost,
  discountApplied,
  totalPrice,
}: OrderEmailData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Environment variable for Gmail user
      pass: process.env.EMAIL_PASS,  // Environment variable for Gmail password
    },
  });

  // ✅ Product Table Generator
  const generateItemsTable = (items: OrderItem[]) =>
    items
      .map(
        (item, index) => `
     <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.productId?.toString().slice(-6) || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.color}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.size}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">৳${item.price ? item.price.toFixed(2) : '0.00'}</td>
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
    <p><strong>Total Amount to be Paid (After Discount): ৳${totalPrice.toFixed(2)}</strong></p>
  `;

  // ✅ User Email HTML
  //   const userEmailHtml = `
  //   <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
  //     <h2 style="text-align: center; color: #F85606;">🎉 Thank You for Your Order, ${name}!</h2>
  //     <p>Your order has been successfully placed. Below are your order details:</p>

  //     <h3>🛒 Order ID: ${orderId}</h3>

  //     <h3>🛍️ Order Summary:</h3>
  //     <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
  //       <thead style="background: #F85606; color: white;">
  //         <tr>
  //           <th>#</th>
  //           <th>Product ID</th>
  //           <th>Name</th>
  //           <th>Color</th>
  //           <th>Size</th>
  //           <th>Qty</th>
  //           <th>Price</th>
  //         </tr>
  //       </thead>
  //       <tbody>${itemsTableRows}</tbody>
  //     </table>

  //     <h3>💰 Payment Summary:</h3>
  //     ${paymentSummary}

  //     <h3>📦 Shipping Details:</h3>
  //     <p><strong>Name:</strong> ${name}</p>
  //     <p><strong>Phone:</strong> ${phone}</p>
  //     <p><strong>Email:</strong> ${to}</p>
  //     <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
  //     <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

  //     <p style="color: orange;">🚚 Delivery Status: ${status}</p>
  //     <p style="text-align: center; margin-top: 30px;">❤️ Thank you for shopping with <strong>MirexaStore</strong>!</p>
  //   </div>
  // `;

  // ✅ Admin Email HTML
  //   const adminEmailHtml = `
  //   <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 10px;">
  //     <h2>🛒 New Order Received!</h2>
  //     <p><strong>Order ID:</strong> ${orderId}</p>
  //     <p><strong>Order Date:</strong> ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</p>
  //     <p><strong>Customer Name:</strong> ${name}</p>
  //     <p><strong>Customer Email:</strong> ${to}</p>

  //     <h3>📦 Shipping Details:</h3>
  //     <p><strong>Name:</strong> ${name}</p>
  //     <p><strong>Phone:</strong> ${phone}</p>
  //     <p><strong>Email:</strong> ${to}</p>
  //     <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
  //     <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

  //     <h3>🛍️ Ordered Products:</h3>
  //     <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
  //       <thead>
  //         <tr>
  //           <th>#</th>
  //           <th>Product ID</th>
  //           <th>Name</th>
  //           <th>Color</th>
  //           <th>Size</th>
  //           <th>Qty</th>
  //           <th>Price</th>
  //         </tr>
  //       </thead>
  //       <tbody>${itemsTableRows}</tbody>
  //     </table>

  //     <h3>💰 Payment Summary:</h3>
  //     ${paymentSummary}

  //     <h3>🚚 Delivery Status: <span style="color: orange;">Pending</span></h3>
  //   </div>
  // `;

  // ✅ Shipment Email HTML
  const shipmentEmailHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
  <h2 style="text-align: center; color: #F85606;">🚚 Your Order is On the Way, ${name}!</h2>
  <p>We are pleased to inform you that your order is now being shipped.</p>

  <h3>🛒 Order ID: ${orderId}</h3>
  
  <h3>📦 Shipping Details:</h3>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Email:</strong> ${to}</p>
  <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
  <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

  <h3>🛍️ Ordered Products:</h3>
  <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
    <thead style="background: #F85606; color: white;">
      <tr>
        <th>#</th>
        <th>Product ID</th>
        <th>Name</th>
        <th>Color</th>
        <th>Size</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>${itemsTableRows}</tbody>
  </table>

  <h3>💰 Payment Summary:</h3>
  ${paymentSummary}

  <p style="color: orange;">🚚 Current Status: Shipped</p>
  <p style="text-align: center; margin-top: 30px;">📦 Your order is on the way and will arrive soon!</p>
</div>
`;

  // ✅ Delivery Email HTML
  const deliveryEmailHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
  <h2 style="text-align: center; color: #F85606;">🎉 Your Order Has Been Delivered, ${name}!</h2>
  <p>We are delighted to inform you that your order has been successfully delivered to the address you provided.</p>

  <h3>🛒 Order ID: ${orderId}</h3>

  <h3>📦 Delivery Details:</h3>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Email:</strong> ${to}</p>
  <p><strong>Address:</strong> ${address}, ${city}, ${district}, ${country}</p>
  <p><strong>Delivery Note:</strong> ${deliveryNote || "N/A"}</p>

  <h3>🛍️ Ordered Products:</h3>
  <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
    <thead style="background: #F85606; color: white;">
      <tr>
        <th>#</th>
        <th>Product ID</th>
        <th>Name</th>
        <th>Color</th>
        <th>Size</th>
        <th>Qty</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>${itemsTableRows}</tbody>
  </table>

  <h3>💰 Payment Summary:</h3>
  ${paymentSummary}

  <p style="color: green; font-weight: bold;">🎉 Your order has been successfully delivered!</p>
</div>
`;

  try {
    // Send email based on the order status
    // await transporter.sendMail({
    //   from: process.env.GMAIL_USER,  // Using environment variable for the sender email
    //   to,
    //   subject: "MirexaStore Order Confirmation",
    //   html: userEmailHtml,
    // });

    // await transporter.sendMail({
    //   from: process.env.GMAIL_USER,  // Using environment variable for the sender email
    //   to: "admin@mirexastore.com",  // Admin email address
    //   subject: `New Order Received: ${orderId}`,
    //   html: adminEmailHtml,
    // });

    if (status === "Shipped") {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,  // Using environment variable for the sender email
        to,
        subject: "Your Order is On the Way!",
        html: shipmentEmailHtml,
      });
    } else if (status === "Delivered") {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,  // Using environment variable for the sender email
        to,
        subject: "Your Order Has Been Delivered",
        html: deliveryEmailHtml,
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
