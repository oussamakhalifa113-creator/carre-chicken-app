const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.name}${item.spiceChoice ? " - " + item.spiceChoice : ""}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/stripe-success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe Checkout :", error.message);

    res.status(500).json({
      message: "Erreur Stripe Checkout",
      error: error.message,
    });
  }
});

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    const amount = items.reduce((sum, item) => {
      return sum + Math.round(item.price * 100) * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erreur Stripe PaymentIntent :", error.message);

    res.status(500).json({
      message: "Erreur Stripe PaymentIntent",
      error: error.message,
    });
  }
});

module.exports = router;