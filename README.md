# Fullstack Real Estate Project Deployment Guide

This guide explains how to deploy this fullstack application (Vite + React frontend, Express + Prisma backend) to Vercel.

## 1. Prerequisites

Before you begin, ensure you have the following:

*   **GitHub Account:** The project code must be pushed to a GitHub repository.
*   **Vercel Account:** Sign up at [vercel.com](https://vercel.com).
*   **Cloud Database (PostgreSQL):** Since Vercel functions are serverless, you need a cloud-hosted database.
    *   **Recommended:** [Neon](https://neon.tech/) (Best for Vercel), [Supabase](https://supabase.com/), or [Railway](https://railway.app/).
    *   *Note: Your local `localhost` database will NOT work.*
*   **Cloudinary Account:** For image hosting.
*   **OpenCage API Key:** For geocoding addresses.

## 2. Database Setup (Neon - PostgreSQL)

1.  **Create a Neon Project:** Go to [neon.tech](https://neon.tech) and create a project.
2.  **Get Connection String:** Copy the `DATABASE_URL` (it starts with `postgres://...`).
    *   *Tip: Use the "Pooled" connection string if available for better performance on Vercel.*
3.  **Run Migrations:** Apply your Prisma schema to the Neon database.
    ```bash
    # Replace with your ACTUAL Neon connection string
    DATABASE_URL="postgres://user:password@host/neondb?sslmode=require" npx prisma db push --schema=./backend/prisma/schema.prisma
    ```

## 3. Vercel Deployment Steps

1.  **Push to GitHub:** Ensure your latest code is pushed to your repository.
2.  **Import Project in Vercel:**
    *   Go to your Vercel Dashboard.
    *   Click **"Add New..."** -> **"Project"**.
    *   Select your GitHub repository and click **Import**.

3.  **Configure Project:**
    *   **Framework Preset:** Vercel should automatically detect **Vite**.
    *   **Root Directory:** Leave as `./` (default).
    *   **Build Command:** Leave as `npm run build` (default).
    *   **Output Directory:** Leave as `dist` (default).
    *   **Install Command:** Leave as `npm install` (default).

4.  **Environment Variables:**
    Expand the **"Environment Variables"** section and add the following. You can copy values from your local `.env` file, but **update `DATABASE_URL`** to your cloud database URL.

    | Key | Value Description |
    | :--- | :--- |
    | `DATABASE_URL` | **Crucial:** Your Neon PostgreSQL connection string. |
    | `CLOUD_NAME` | Your Cloudinary cloud name. |
    | `CLOUDINARY_API_KEY` | Your Cloudinary API key. |
    | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret. |
    | `JWT_SECRET` | A secure random string for tokens. |
    | `GEO_API` | Your OpenCage API key. |
    | `SALTVALUE` | e.g., `10` |
    | `expires` | e.g., `1d` |
    | `VITE_API_URL` | Set this to `/api` (This is important for Vercel rewrites). |

5.  **Deploy:**
    *   Click **Deploy**.
    *   Vercel will install dependencies, generate the Prisma client (via the `postinstall` script), build the frontend, and deploy the backend as serverless functions.

## 4. Troubleshooting

*   **Database Connection Errors:** Ensure your `DATABASE_URL` is correct and your database provider allows connections from Vercel (usually "Allow all IPs" or similar setting).
*   **Prisma Client Error:** If you see errors about Prisma Client not being initialized, ensure the `postinstall` script in `package.json` is running correctly: `"postinstall": "npx prisma generate --schema=./backend/prisma/schema.prisma"`.
*   **CORS Issues:** The backend is configured to accept requests from the frontend via Vercel rewrites (`/api/...`), so CORS issues should be minimal if `VITE_API_URL` is set to `/api`.

## 5. Project Structure for Vercel

*   **`vercel.json`**: Configures rewrites so requests to `/api/*` are handled by `backend/index.js`.
*   **`package.json`**: Merged dependencies so Vercel installs both frontend and backend packages.
*   **`backend/index.js`**: Adapted to run as a serverless function (exports `app`) and uses `/tmp` for temporary file storage.

## 6. Understanding the Code Changes for Deployment

This section explains *why* we made specific changes to the codebase. This is helpful for understanding how the app differs from a standard local setup.

### 1. `backend/index.js`
*   **Change:** Replaced local file storage with `os.tmpdir()`.
    *   **Reason:** Vercel Serverless Functions run in a read-only environment. We cannot save uploaded files to the project folder. The only writable location is the system's temporary directory (`/tmp`), which we use to store files briefly before uploading them to Cloudinary.
*   **Change:** Added `/api` prefix to all routes (e.g., `/login` $\rightarrow$ `/api/login`).
    *   **Reason:** We serve both the Frontend and Backend from the same domain. The `/api` prefix helps Vercel distinguish between a request for a webpage (Frontend) and a request for data (Backend).
*   **Change:** Exported the app (`module.exports = app`).
    *   **Reason:** Vercel doesn't run the server using `node index.js`. Instead, it imports the `app` instance and turns it into a serverless function handler.

### 2. `src/config.ts`
*   **Change:** Updated endpoint to `import.meta.env.VITE_API_URL || "http://localhost:3000"`.
    *   **Reason:**
        *   **Locally:** We want to point to `http://localhost:3000`.
        *   **Production:** We want to point to `/api`. Using a relative path (`/api`) avoids CORS (Cross-Origin Resource Sharing) issues because the browser treats the frontend and backend as the same site.

### 3. `package.json` (Root)
*   **Change:** Merged `backend/package.json` dependencies into the root `package.json`.
    *   **Reason:** Vercel installs dependencies from the root. By moving backend packages (like `express`, `prisma`, `cloudinary`) to the root, we ensure they are available when Vercel builds the app.
*   **Change:** Added `"postinstall": "npx prisma generate..."`.
    *   **Reason:** Prisma Client is code that is *generated* based on your schema. When Vercel downloads your code, that generated code doesn't exist yet. This script forces Vercel to generate it before trying to build the React app, preventing "Module not found" errors.

### 4. `vercel.json`
*   **Change:** Created this configuration file.
    *   **Reason:** This file tells Vercel how to route traffic. The `rewrites` section is the most important: it tells Vercel "If a user visits `/api/...`, don't look for a React page. Instead, send that request to `backend/index.js`".

### 5. `backend/prisma/schema.prisma`
*   **Change:** Changed `provider` from `mysql` to `postgresql`.
    *   **Reason:** To support **Neon**, a serverless PostgreSQL database. Serverless databases are recommended for Vercel because they handle connection scaling much better than traditional servers.
