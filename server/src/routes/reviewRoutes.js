
import { Router } from "express";
import Review from "../models/Review.js";
import { requireCustomer } from "../middleware/requireCustomer.js";

const router = Router();

// Display genuine customer reviews
router.get("/", async (_req, res, next) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .select("customerName rating comment createdAt");

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// Submit a review - customer login required
router.post("/", requireCustomer, async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Please select a rating from 1 to 5 stars."
      });
    }

    if (comment.length < 5 || comment.length > 1000) {
      return res.status(400).json({
        message: "Your review must contain 5 to 1000 characters."
      });
    }

    const review = await Review.create({
      customerId: req.customer.id,
      customerName: req.customer.name,
      rating,
      comment
    });

    res.status(201).json({
      message: "Thank you! Your review has been submitted.",
      review: {
        _id: review._id,
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
