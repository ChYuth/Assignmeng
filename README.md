# Shop Eco

## Run the shop

Use Node.js 22.5 or later. From this folder, install dependencies and start the frontend and SQL-backed API together:

```powershell
npm install
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). Keep the terminal open while using the app.

## Admin account

Open **Login** and choose **Admin? ចូលទីនេះ**, or visit `/admin/login`. On its first start, the API creates one admin account and prints the email and a randomly generated password in the terminal. Save that password; it is only printed once. To set credentials before the first start, define `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the terminal environment. A configured password must have at least 12 characters.

Admins can add clothing and upload JPG, PNG, or WebP images (up to 5 MB) from `/admin`. Product details and admin sessions are stored in the SQLite database at `server/data/shop.sqlite`; uploaded images are stored in `server/uploads`. Both folders are ignored by Git.

The admin password is stored as a scrypt hash, and admin sessions use an HttpOnly cookie. The initial account is created only for local development; deploy behind HTTPS and configure production secrets before exposing this app publicly.
