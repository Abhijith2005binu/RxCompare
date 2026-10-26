const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true },
    drugCode: { type: String, default: "" },
    genericName: { type: String, required: true },
    packSize: { type: String, default: "" },
    genericMrp: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, trim: true, default: "" },
    deliveryAddress: { type: String, trim: true, default: "Counter Pickup" },
    deliveryType: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
    kendraCode: { type: String, required: true, index: true },
    kendraName: { type: String, required: true },
    kendraPhone: { type: String, default: "" },
    kendraAddress: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "confirmed", "ready", "out_for_delivery", "completed", "cancelled"],
      default: "placed",
      index: true,
    },
    paymentMethod: { type: String, default: "Cash / UPI on Delivery" },
    paymentStatus: { type: String, default: "simulated_paid" },
    transactionId: { type: String, default: null },
    paymentSimulationMethod: { type: String, default: "UPI" },
    notes: { type: String, default: "" },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true }
);

orderSchema.virtual("id").get(function () {
  return this.orderNumber;
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
