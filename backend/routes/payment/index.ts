import express from "express";
import { authenticateUser } from "../../middleware/useAuthenticate";
import { checkPaymentStatus, createCheckoutSession, handleWebhook } from "../../controllers/Payment/PaymentsController";

const router = express.Router();

/**
 * @swagger
 * /payments/checkout:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Checkout session created
 *       500:
 *         description: Server error
 */
router.post("/checkout", authenticateUser, createCheckoutSession);

/**import Stripe from "stripe";
import admin from "firebase-admin";
import config from "../../../config";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/useAuthenticate"; // Ensure this is the correct path

const stripe = new Stripe(config.stripeSecretKey, { apiVersion: "2023-10-16" });
const db = admin.firestore();

export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        if (!req.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer_email: email,
            line_items: [
                {
                    price: config.stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${config.frontendUrl}/success`,
            cancel_url: `${config.frontendUrl}/cancel`,
            metadata: { userId: req.userId }, // Now TypeScript recognizes `userId`
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
};

 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Stripe webhook to handle payment success
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       400:
 *         description: Webhook error
 */
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

/**
 * @swagger
 * /payments/check-payment:
 *   get:
 *     summary: Check if the user has an active subscription
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's payment status
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/check-payment", authenticateUser, checkPaymentStatus);

export default router;
