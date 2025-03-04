// routes/checkout.route.ts

import express from "express";
import * as NewsletterController from "./newsletter.controller";

const router = express.Router();

router.post("/subscribe", NewsletterController.subscribe);
router.get("/subscribers", NewsletterController.getSubscribers);

export const NewsLetterRoute = router;
