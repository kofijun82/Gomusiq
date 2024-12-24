import axios from "axios";
import { Purchase } from "../models/purchase.model.js";

export const initializePayment = async (req, res) => {
    try {
        const { email, amount, songId } = req.body;

        // Validate required fields
        if (!email || !amount || !songId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: email, amount, or songId.",
            });
        }

        // Validate amount (must be a positive number)
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount. Amount must be a positive number.",
            });
        }

        // Convert amount to kobo (for NGN payments)
        const amountInKobo = Math.round(amount * 100);

        // Paystack API details
        const paystackUrl = "https://api.paystack.co/transaction/initialize";
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!paystackSecretKey) {
            return res.status(500).json({
                success: false,
                message: "Paystack secret key is not configured. Please check environment variables.",
            });
        }

        // Make a request to Paystack to initialize payment
        const response = await axios.post(
            paystackUrl,
            {
                email,
                amount: amountInKobo,
                metadata: {
                    songId,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const { authorization_url, reference } = response.data.data;

        // Save the transaction to the database
        const purchase = new Purchase({
            userId: req.user.id, // Assuming `req.user` contains the authenticated user's ID
            musicId: songId,
            amount,
            reference,
            status: "pending",
        });
        await purchase.save();

        // Respond with Paystack payment page URL
        res.status(200).json({
            success: true,
            message: "Payment initialized successfully",
            data: { authorization_url, reference },
        });
    } catch (error) {
        console.error("Error initializing payment:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "An error occurred while initializing payment.",
            error: error.response?.data || error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;

        // Validate reference
        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "Transaction reference is required.",
            });
        }

        // Paystack API details
        const paystackUrl = `https://api.paystack.co/transaction/verify/${reference}`;
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!paystackSecretKey) {
            return res.status(500).json({
                success: false,
                message: "Paystack secret key is not configured. Please check environment variables.",
            });
        }

        // Verify the transaction using Paystack API
        const response = await axios.get(paystackUrl, {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
            },
        });

        const { status, data } = response.data;

        if (status && data.status === "success") {
            // Update the purchase record in the database
            const purchase = await Purchase.findOne({ reference });
            if (purchase) {
                purchase.status = "success";
                await purchase.save();
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                data,
            });
        } else {
            // Payment failed or is still pending
            const purchase = await Purchase.findOne({ reference });
            if (purchase) {
                purchase.status = data.status === "failed" ? "failed" : "pending";
                await purchase.save();
            }

            return res.status(400).json({
                success: false,
                message: "Payment verification failed or is still pending.",
                data,
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "An error occurred while verifying payment.",
            error: error.response?.data || error.message,
        });
    }
};
