const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { customerName, paymentMode, paymentStatus, items, total } = req.body;

    if (!customerName || !paymentMode || !paymentStatus || !items || !total) {
      return res.status(400).json({ message: "Donnees de commande incompletes" });
    }

    const orderNumber = `CC-${Date.now().toString().slice(-6)}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      paymentMode,
      paymentStatus,
      items,
      total,
      status: "En attente",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Erreur creation commande",
      error: error.message,
    });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const paidOrders = orders.filter((order) => order.paymentStatus === "Payée");
    const counterOrders = orders.filter((order) => order.paymentMode === "comptoir");
    const readyOrders = orders.filter((order) => order.status === "Prête");
    const waitingOrders = orders.filter((order) => order.status !== "Prête");

    res.json({
      totalOrders,
      revenue,
      paidCount: paidOrders.length,
      paidRevenue: paidOrders.reduce((sum, order) => sum + order.total, 0),
      counterCount: counterOrders.length,
      counterRevenue: counterOrders.reduce((sum, order) => sum + order.total, 0),
      readyCount: readyOrders.length,
      waitingCount: waitingOrders.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur stats",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Erreur recuperation commandes",
      error: error.message,
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["En attente", "Prête"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Erreur mise a jour statut",
      error: error.message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "Toutes les commandes ont ete supprimees" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur suppression commandes",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json({ message: "Commande supprimee" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur suppression commande",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Erreur recuperation commande",
      error: error.message,
    });
  }
});

module.exports = router;
