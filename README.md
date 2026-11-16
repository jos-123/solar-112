# HAIL MARY Solar Website

A simple React + Express + MongoDB website with separate Solar, Batteries and Inverters sections, customer accounts, and a protected administrator panel.

## Local setup (Windows PowerShell)

### 1. Backend

```powershell
cd server
Copy-Item .env.example .env   # only if .env does not already exist
npm install
npm run dev
```

Edit `server/.env` before starting. Keep `MONGO_URI` pointed at your MongoDB database, set a long random `JWT_SECRET`, and set your private `ADMIN_EMAIL` and `ADMIN_PASSWORD` (at least 12 characters). The server syncs the configured admin password into the admin account every time it starts. Restart the backend after changing these values.

### 2. Frontend (new terminal)

```powershell
cd client
Copy-Item .env.example .env   # only if .env does not already exist
npm install
npm run dev
```

Open `http://localhost:5173`.

## Login paths

- Customer login/register: `/login`. Customers register with name, email and password. Their account is stored in MongoDB; after login they return to the home page and see their name and a Logout button in the header.
- Admin login: `/admin/login`. Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`. Admin login only accepts accounts with the admin role. The dashboard has a Logout button that returns to the home page.

## Before making the site public

1. Deploy the React client to a static hosting provider and the Express server to a Node hosting provider.
2. Use MongoDB Atlas (or another managed MongoDB service); do not expose a local MongoDB database to the internet.
3. Set production environment variables in the backend hosting dashboard: `MONGO_URI`, `JWT_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`, and `PORT` (usually supplied by the host). Set `CLIENT_URL` to the exact public frontend origin, without a trailing slash.
4. Set the frontend build variable `VITE_API_URL` to the public backend API URL ending in `/api`, then rebuild/redeploy the frontend.
5. Use HTTPS, a unique strong admin password and a randomly generated JWT secret. Never publish `.env` files or commit them to Git.
6. Replace sample products, prices, image links, testimonials and project gallery items with accurate business information before launch.
7. Test customer registration/login/logout, admin login/logout, product enquiry links, mobile layout and admin create/update/delete actions on the deployed site.

The customer account is for website login/session identity. It does not currently include order history or online payment processing.
