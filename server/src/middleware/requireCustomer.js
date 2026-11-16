
import jwt from "jsonwebtoken";

export function requireCustomer(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in with your customer account to submit a review."
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "customer") {
      return res.status(403).json({
        message: "Only customer accounts can submit reviews."
      });
    }

    req.customer = {
      id: payload.id,
      name: payload.name
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Your customer session has expired. Please log in again."
    });
  }
}
