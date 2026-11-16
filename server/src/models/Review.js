
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
