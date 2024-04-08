import mongoose from "mongoose";

const data_schema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      index: true,
    },
    tariff: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    interval: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      required: true,
      index: true,
    },
    data_clarification: {
      type: Array,
      required: true,
      index: true,
    },
    energy_date: {
      type: Date,
      required: true,
      index: true,
    },
    fetched_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const data =
  mongoose.models.data || mongoose.model("data", data_schema);

export default data;