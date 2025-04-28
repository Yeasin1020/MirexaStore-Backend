import axios from "axios";
import { Courier } from "./courier.model";
import { ICourierRequest } from "./courier.interface";

export const createCourierRequest = async (data: ICourierRequest) => {
  const webhookPayload = {
    recipient_name: data.customer.fullName,
    recipient_phone: data.customer.phone,
    recipient_email: data.customer.email,
    recipient_address: `${data.customer.address}, ${data.customer.city}, ${data.customer.district}, ${data.customer.country}`,
    delivery_note: data.customer.deliveryNote || "",
    cod_amount: data.codAmount,
    seller_name: data.seller.name,
    seller_email: data.seller.email,
    seller_phone: data.seller.phone,
    seller_location: data.seller.location,
    seller_whatsapp: data.seller.whatsapp || "",
    seller_social_links: data.seller.socialLinks || {},
    order_items: data.orderItems.map((item) => ({
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      color: item.color || "",
      size: item.size || "",
      product_image: item.productImage,
    })),
  };

  // 1. Webhook e data pathai
  const courierRes = await axios.post(
    "https://webhook.site/f6aed20f-957c-4090-8c47-69837f8cf5e7",
    webhookPayload,
    {
      headers: {
        Authorization: `Bearer YOUR_API_KEY`, // <-- replace with actual
      },
    }
  );

  // 2. MongoDB te original data save kori
  const courierRequest = await Courier.create({
    ...data,
    orderItems: data.orderItems.map((item) => ({
      ...item,
      productImage: Array.isArray(item.productImage) ? item.productImage : [item.productImage],
    })),
    trackingId: courierRes.data.tracking_id || "",
    responsePayload: courierRes.data,
  });

  return courierRequest;
};

export const getCourierByOrder = async (orderId: string) => {
  return await Courier.findOne({ orderId });
};
