const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: Number,
  cartKey: String,
  name: String,
  price: Number,
  quantity: Number,
  spiceChoice: String,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMode: {
      type: String,
      required: true,
      enum: ["apple-pay", "carte", "comptoir"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Payée", "À payer au comptoir"],
    },
    status: {
      type: String,
      enum: ["En attente", "Prête"],
      default: "En attente",
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
