import { SubscriptionPlan, SubscriptionRequest } from "./subscription.model";
import { TSubscriptionPlan, TSubscriptionRequest } from "./subscription.interface";
import { Seller } from "../seller/seller.model";
import { sendEmail } from "../../utils/subscriptionEmail";
import config from "../../config";

const primaryColor = "#F6550C";

export const SubscriptionService = {
	getAllPlans: async () => {
		console.log("📦 Fetching all subscription plans...");
		return SubscriptionPlan.find({});
	},

	createPlan: async (data: TSubscriptionPlan) => {
		console.log("🛠 Creating new plan with data:", data);
		return SubscriptionPlan.create(data);
	},

	createRequest: async (data: TSubscriptionRequest) => {
		console.log("📥 New subscription request incoming...", data);

		const exists = await SubscriptionRequest.findOne({ transactionId: data.transactionId });
		if (exists) {
			console.error("⚠️ Duplicate transaction ID:", data.transactionId);
			throw new Error("Duplicate transaction ID. Already used.");
		}

		const request = await SubscriptionRequest.create(data);
		console.log("✅ Subscription request saved:", request._id);

		// Notify admin
		console.log("📧 Sending new request notification email to admin...");
		await sendEmail({
			to: config.admin_email!,
			subject: "📥 New Subscription Request Received",
			html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
        <div style="background-color: ${primaryColor}; padding: 20px; color: #fff; text-align: center;">
          <h1 style="margin: 0; font-weight: 700;">MirexaStore</h1>
          <p style="margin: 5px 0 0; font-size: 16px;">New Subscription Request</p>
        </div>
        <div style="padding: 25px; color: #333;">
          <h2 style="color: ${primaryColor}; border-bottom: 2px solid ${primaryColor}; padding-bottom: 8px;">Subscription Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: 600; width: 140px; border-bottom: 1px solid #eee;">Seller Name</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.sellerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600; border-bottom: 1px solid #eee;">Email</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.sellerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600; border-bottom: 1px solid #eee;">Plan ID</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.planId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600; border-bottom: 1px solid #eee;">Payment Method</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600;">Transaction ID</td>
              <td style="padding: 8px;">${data.transactionId}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            Please log into the admin panel to approve or reject this request.
          </p>
        </div>
        <div style="background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} MirexaStore. All rights reserved.
        </div>
      </div>
      `,
		});

		return request;
	},

	getRequestsBySeller: async (email: string) => {
		console.log(`📨 Fetching requests for seller: ${email}`);
		return SubscriptionRequest.find({ sellerEmail: email }).sort({ createdAt: -1 });
	},

	getPendingRequests: async () => {
		console.log("⏳ Fetching all pending subscription requests...");
		return SubscriptionRequest.find({ status: "pending" });
	},

	approveRequest: async (requestId: string) => {
		const req = await SubscriptionRequest.findById(requestId);
		if (!req) throw new Error("Request not found");

		req.status = "approved";
		await req.save();

		const seller = await Seller.findOne({ userEmail: req.sellerEmail });
		if (!seller) throw new Error("Seller not found");

		const plan = await SubscriptionPlan.findById(req.planId);
		if (!plan) throw new Error("Plan not found");

		const now = new Date();
		const validFrom =
			seller.validTill && new Date(seller.validTill) > now
				? new Date(seller.validTill)
				: now;

		validFrom.setDate(validFrom.getDate() + plan.days);
		seller.validTill = validFrom;
		await seller.save();

		console.log("📧 Sending approval email to seller...");
		await sendEmail({
			to: req?.sellerEmail,
			subject: "✅ Your Subscription Has Been Approved",
			html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
        <div style="background-color: ${primaryColor}; padding: 20px; color: #fff; text-align: center;">
          <h1 style="margin: 0; font-weight: 700;">MirexaStore</h1>
          <p style="margin: 5px 0 0; font-size: 16px;">Subscription Approved</p>
        </div>
        <div style="padding: 25px; color: #333;">
          <h2 style="color: ${primaryColor}; border-bottom: 2px solid ${primaryColor}; padding-bottom: 8px;">Hello ${req?.sellerName},</h2>
          <p>Your subscription request has been <strong style="color: ${primaryColor};">approved</strong>. Here are your subscription details:</p>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px; font-weight: 600; width: 150px;">Plan</td>
              <td style="padding: 8px;">${plan?.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px; font-weight: 600;">Transaction ID</td>
              <td style="padding: 8px;">${req?.transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: 600;">Valid Till</td>
              <td style="padding: 8px;">${seller?.validTill.toLocaleDateString("en-US", {
				year: "numeric", month: "long", day: "numeric",
			})}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">Thank you for subscribing with MirexaStore!</p>
        </div>
        <div style="background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} MirexaStore. All rights reserved.
        </div>
      </div>
    `,
		});

		return req;
	},

	rejectRequest: async (requestId: string) => {
		const req = await SubscriptionRequest.findById(requestId);
		if (!req) throw new Error("Request not found");

		req.status = "rejected";
		await req.save();

		console.log("📧 Sending rejection email to seller...");
		await sendEmail({
			to: req?.sellerEmail,
			subject: "❌ Your Subscription Request Was Rejected",
			html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
        <div style="background-color: ${primaryColor}; padding: 20px; color: #fff; text-align: center;">
          <h1 style="margin: 0; font-weight: 700;">MirexaStore</h1>
          <p style="margin: 5px 0 0; font-size: 16px;">Subscription Request Rejected</p>
        </div>
        <div style="padding: 25px; color: #333;">
          <h2 style="color: ${primaryColor}; border-bottom: 2px solid ${primaryColor}; padding-bottom: 8px;">Hello ${req?.sellerName},</h2>
          <p>We’re sorry, but your subscription request has been <strong style="color: ${primaryColor};">rejected</strong>.</p>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px; font-weight: 600; width: 150px;">Transaction ID</td>
              <td style="padding: 8px;">${req?.transactionId}</td>
            </tr>
          </table>
          <p>If you believe this was a mistake or want to try again, please contact support.</p>
          <p style="color: #999; font-size: 12px;">You may reapply anytime with valid details.</p>
        </div>
        <div style="background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} MirexaStore. All rights reserved.
        </div>
      </div>
    `,
		});

		return req;
	},
};
