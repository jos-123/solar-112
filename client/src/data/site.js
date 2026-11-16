export const site = {
  phone: "9447853226",
  whatsapp: "917510373226",
  email: "hailmary@gmail.com",
  address: "Kerala, India",
  mapQuery: "Kerala, India",
  tagline: "Your trusted solar energy partner"
};
export const inr = value => Number(value || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const whatsappLink = message => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
