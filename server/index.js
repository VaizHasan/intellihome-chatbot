require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000; 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    const keywords = {
        // IntelliHome-specific keywords
        price: "The prices for our gadgets range from $10 to $500.",
        warranty: "We offer a 1-year warranty on all our products.",
        shipping: "We offer free shipping on orders above $50.",
        return: "You can return your products within 30 days for a full refund.",
        support: "For support, you can contact us at support@intellihome.com.",
        hours: "We are open Monday to Friday, from 9 AM to 6 PM.",
        stock: "Most of our gadgets are in stock, but some popular items may be on backorder. Please check the product page for availability.",
        payment: "We accept Visa, MasterCard, PayPal, and Apple Pay for payment.",
        discounts: "We offer discounts ranging from $25 to $500, which can be used to purchase any product from our store.",
        compatibility: "Our gadgets are compatible with most modern devices, including smartphones, tablets, and laptops.",

        // General keywords
        hello: "Hello! How can I assist you today?",
        help: "I'm here to help! You can ask me about prices, shipping, returns, and more.",
        thank: "You're welcome! Let me know if you need any further assistance.",
        bye: "Goodbye! Feel free to come back if you need help.",
        "store policy": "Our store policies include a 30-day return policy, a 1-year warranty on gadgets, and free shipping for orders over $50.",
        "refund policy": "If you're not satisfied with your product, you can return it within 30 days for a full refund. Please check our website for detailed steps.",
        "order status": "To check the status of your order, please visit our 'Order Tracking' page or contact our support team at support@intellihome.com.",
        "store locations": "Currently, we operate online only, but you can reach us at our customer service email: support@intellihome.com.",
        "working hours": "Our customer support is available from 9 AM to 6 PM, Monday to Friday.",
        "contact us": "You can contact us via email at support@intellihome.com, or visit our website for live chat support during business hours.",
        "feedback": "We value your feedback! Please share your thoughts with us by emailing feedback@intellihome.com.",
        "FAQ": "You can find answers to common questions on our FAQ page at www.intellihome.com/faq.",
        "product details": "Please visit the product page for detailed specifications, features, and pricing of our gadgets.",
    };


    // Check if the message matches any keyword
    for (let keyword in keywords) {
        if (userMessage.toLowerCase().includes(keyword)) {
            return res.json({ response: keywords[keyword] });
        }
    }

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText", // Correct Gemini API URL
            {
                prompt: { text: userMessage },
                max_tokens: 50,
            },
            {
                headers: {
                    Authorization: `Bearer ${GEMINI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const aiResponse = response.data.candidates?.[0]?.output || "Sorry, I couldn't generate a response.";
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ response: "Sorry, I couldn't connect to the AI service." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

