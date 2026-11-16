
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerApi } from "../api.js";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("hm_customer_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const customerToken = localStorage.getItem("hm_customer_token");

  async function loadReviews() {
    try {
      const data = await customerApi("/reviews");
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function submitReview(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!customerToken || !customer) {
      setError("Please log in with your customer account first.");
      return;
    }

    if (comment.trim().length < 5) {
      setError("Please write at least 5 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await customerApi("/reviews", {
        method: "POST",
        body: JSON.stringify({
          rating,
          comment: comment.trim()
        })
      });

      setReviews(previous => [result.review, ...previous]);
      setComment("");
      setRating(5);
      setMessage("Thank you! Your review has been submitted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section container customer-reviews">
      <div className="section-heading">
        <span className="eyebrow">CUSTOMER EXPERIENCES</span>
        <h2>What Our Customers Say</h2>
        <p>
          Read genuine feedback from HAIL MARY customers
          and share your own experience.
        </p>
      </div>

      {/* Review form */}
      <div className="review-form-card">
        <h3>Write a Review</h3>

        {customer && customerToken ? (
          <form onSubmit={submitReview}>
            <p className="review-user">
              Reviewing as <strong>{customer.name}</strong>
            </p>

            <label className="review-label">
              Your rating
            </label>

            <div className="review-stars" role="group" aria-label="Choose a rating">
              {[1, 2, 3, 4, 5].map(number => (
                <button
                  key={number}
                  type="button"
                  className={number <= rating ? "star selected" : "star"}
                  onClick={() => setRating(number)}
                  aria-label={`${number} star${number > 1 ? "s" : ""}`}
                  aria-pressed={rating === number}
                >
                  ★
                </button>
              ))}
            </div>

            <label className="review-label" htmlFor="review-comment">
              Your comment
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell us about your experience with HAIL MARY..."
              rows="5"
              minLength="5"
              maxLength="1000"
              required
            />

            <div className="review-form-footer">
              <small>{comment.length}/1000 characters</small>

              <button
                type="submit"
                className="button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        ) : (
          <div className="review-login-message">
            <p>Please log in to your customer account to write a review.</p>
            <Link className="button" to="/login">
              Customer Login
            </Link>
          </div>
        )}

        {message && <p className="review-success">{message}</p>}
        {error && <p className="review-error">{error}</p>}
      </div>

      {/* Genuine reviews from MongoDB */}
      <div className="review-list">
        <h3>Customer Feedback ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No customer reviews yet.</p>
            <span>Be the first to share your experience!</span>
          </div>
        ) : (
          <div className="review-grid">
            {reviews.map(review => (
              <article className="review-card" key={review._id}>
                <div className="review-card-stars" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(review.rating)}
                  <span>{"☆".repeat(5 - review.rating)}</span>
                </div>

                <p className="review-comment">{review.comment}</p>

                <div className="review-author">
                  <strong>{review.customerName}</strong>
                  <small>
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
