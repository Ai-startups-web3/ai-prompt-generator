import Razorpay from "razorpay";
import admin from "firebase-admin";
import config from "../../../config";
import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/useAuthenticate";


const db = admin.firestore();

const razorpay = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret,
});

/**
 * Create a Razorpay order
 */
export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            res.status(400).json({ error: "Amount and currency are required" });
            return;
        }

        if (!req.userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const options = {
            amount: amount * 100, // Convert to paise
            currency,
            receipt: `receipt_${req.userId}`,
            payment_capture: 1, // Auto capture payment
        };

        const order = await razorpay.orders.create(options);

        res.json({ orderId: order.id });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: error });
    }
};

/**
 * Handle Razorpay Webhook
 */
export const handleWebhook = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const event = req.body;

        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            const userId = payment.notes?.userId;

            if (userId) {
                await db.collection("users").doc(userId).set(
                    { isPaidUser: true, lastPaymentId: payment.id },
                    { merge: true }
                );
            }
        }

        res.json({ received: true });
    } catch (err) {
        console.error("Webhook Error:", err);
        res.status(400).send(`Webhook Error: ${err}`);
    }
};

/**
 * Check if the user has completed payment
 */
export const checkPaymentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const userDoc = await db.collection("users").doc(req.userId).get();

        if (!userDoc.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const userData = userDoc.data();

        res.json({ isPaidUser: userData?.isPaidUser || false });
    } catch (error) {
        console.error("Check Payment Status Error:", error);
        res.status(500).json({ error: error });
    }
};
