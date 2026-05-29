const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Carré Chicken fonctionne" });
});

app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");

    app.listen(process.env.PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erreur MongoDB :", error.message);
  });
