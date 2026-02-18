# Real Estate Marketplace

A modern, full-stack real estate marketplace application built with React, Express, and PostgreSQL. Users can browse properties, list new properties, manage their profile, and reset passwords securely.

## 🎯 Project Overview

This application is a comprehensive real estate marketplace platform that enables users to:

- **Browse** available properties with advanced filtering capabilities
- **List** new properties with detailed information and multiple images
- **Manage** property listings with full CRUD operations
- **View** properties on an interactive map with location data
- **Authenticate** securely with JWT-based authentication
- **Manage** user accounts with password reset functionality

## ✨ Key Features

### User Management

- **User Registration & Login** - Secure authentication with JWT tokens
- **Password Management** - Change password, forget password, and password reset via email
- **User Profile** - View and update user details (name, email, username)
- **Token Verification** - Secure endpoint protection with JWT middleware

### Property Management

- **Browse Properties** - View all available properties with filtering options
  - Filter by property type, price range, location, and amenities
  - Pagination support for large datasets
- **Add Listings** - Create new property listings with:
  - Multiple images (multi-file upload)
  - Detailed property information (bedrooms, parking, plot size, etc.)
  - Agent details and contact information
  - Automatic geolocation with latitude/longitude
- **Edit Listings** - Modify existing property details
- **Delete Listings** - Remove properties from the marketplace
- **View Details** - Access comprehensive property information

### Property Features

- **Featured Properties** - Display premium/featured listings
- **Recommended Properties** - Personalized property suggestions
- **Rental & Sales Options** - Support for both rental and sales listings
- **Lease Management** - Specialized lease property handling
- **Image Gallery** - Multiple images per property with cloud storage

### Advanced Features

- **Interactive Maps** - View properties on a map using Leaflet
- **Cloudinary Integration** - Secure cloud-based image hosting
- **Geolocation** - OpenCage API integration for address-to-coordinates conversion
- **Email Notifications** - Password reset emails via Nodemailer
- **Responsive Design** - Mobile-friendly UI with Material-UI and Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Leaflet** - Map integration
- **React Toastify** - Toast notifications
- **Emotion** - CSS-in-JS styling

### Backend

- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image management
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### External Services

- **Cloudinary** - Image hosting and optimization
- **OpenCage API** - Geocoding service
- **Email Service** - Password reset notifications
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (local or cloud-hosted)
- **Cloudinary Account** (for image hosting)
- **OpenCage API Key** (optional, for geocoding)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fullstack-realestate-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/realestate"

   # Cloudinary
   CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # JWT & Security
   JWT_SECRET=your_secret_key_here
   SALTVALUE=10
   expires=1d

   # API
   PORT=3000
   VITE_API_URL=http://localhost:3000

   # OpenCage (optional)
   GEO_API=your_opencage_api_key

   # Email (optional)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Environment
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server

# Build & Preview
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma db push        # Sync schema with database
npx prisma generate       # Generate Prisma client
npx prisma studio        # Open Prisma Studio GUI
```

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

1. User logs in with credentials
2. Server returns a JWT token
3. Token stored in cookies/local storage
4. Token sent with subsequent requests in `Authorization` header
5. Middleware verifies token before accessing protected routes

### Protected Routes

- User profile access
- Adding/editing/deleting properties
- Password changes
- Update user details

## 🚢 Deployment

### Deploying to Vercel

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables, add:
   - `DATABASE_URL` (use cloud database like Neon, Supabase, or Railway)
   - `CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `JWT_SECRET`, `SALTVALUE`, `expires`
   - `VITE_API_URL=/api` (important for production)
   - `GEO_API` (optional)

4. **Deploy**
   - Vercel automatically builds and deploys on push to main

### Important Notes for Vercel

- Use a **cloud database** (local database won't work)
- Set `VITE_API_URL=/api` for production
- Cloudinary must be configured for image uploads
- The `postinstall` script automatically generates Prisma client

## 🐛 Troubleshooting

### Database Connection Error

- Ensure `DATABASE_URL` is correct
- Check database credentials
- Verify database is accessible from your network

### Prisma Client Error

- Run `npx prisma generate`
- Delete `node_modules/.prisma` and reinstall dependencies

### CORS Issues

- Verify `VITE_API_URL` matches your backend URL
- Check backend CORS configuration in `api/index.js`

### Image Upload Issues

- Verify Cloudinary credentials
- Check file size limits in Multer configuration
- Ensure temporary directory is writable

### Authentication Issues

- Verify JWT_SECRET in environment variables
- Check token expiration time
- Clear browser cookies and retry login

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Material-UI](https://mui.com)

## 📄 License

This project is licensed under the ISC License. See LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, feature requests, or questions, please create an issue in the repository.

---

**Last Updated:** February 2026

## 2. Database Setup (Neon - PostgreSQL)

1.  **Create a Neon Project:** Go to [neon.tech](https://neon.tech) and create a project.
2.  **Get Connection String:** Copy the `DATABASE_URL` (it starts with `postgres://...`).
    - _Tip: Use the "Pooled" connection string if available for better performance on Vercel._
3.  **Run Migrations:** Apply your Prisma schema to the Neon database.
    ```bash
    # Replace with your ACTUAL Neon connection string
    DATABASE_URL="postgres://user:password@host/neondb?sslmode=require" npx prisma db push --schema=./backend/prisma/schema.prisma
    ```

## 3. Vercel Deployment Steps

1.  **Push to GitHub:** Ensure your latest code is pushed to your repository.
    - _Note:_ If you are working on a branch (e.g., `vercel-deploy`), push that branch: `git push origin vercel-deploy`.
2.  **Import Project in Vercel:**
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your GitHub repository and click **Import**.
    - _Important:_ If you haven't merged your branch to `main` yet, Vercel might try to deploy the old `main` branch first. You can change the **Production Branch** in Vercel settings later, or simply merge your code to `main` before importing.

3.  **Configure Project:**
    - **Framework Preset:** Vercel should automatically detect **Vite**.
    - **Root Directory:** Leave as `./` (default).
    - **Build Command:** Leave as `npm run build` (default).
    - **Output Directory:** Leave as `dist` (default).
    - **Install Command:** Leave as `npm install` (default).

4.  **Environment Variables:**
    Expand the **"Environment Variables"** section and add the following. You can copy values from your local `.env` file, but **update `DATABASE_URL`** to your cloud database URL.

    | Key                     | Value Description                                           |
    | :---------------------- | :---------------------------------------------------------- |
    | `DATABASE_URL`          | **Crucial:** Your Neon PostgreSQL connection string.        |
    | `CLOUD_NAME`            | Your Cloudinary cloud name.                                 |
    | `CLOUDINARY_API_KEY`    | Your Cloudinary API key.                                    |
    | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret.                                 |
    | `JWT_SECRET`            | A secure random string for tokens.                          |
    | `GEO_API`               | Your OpenCage API key.                                      |
    | `SALTVALUE`             | e.g., `10`                                                  |
    | `expires`               | e.g., `1d`                                                  |
    | `VITE_API_URL`          | Set this to `/api` (This is important for Vercel rewrites). |

5.  **Deploy:**
    - Click **Deploy**.
    - Vercel will install dependencies, generate the Prisma client (via the `postinstall` script), build the frontend, and deploy the backend as serverless functions.

## 4. Troubleshooting

- **Database Connection Errors:** Ensure your `DATABASE_URL` is correct and your database provider allows connections from Vercel (usually "Allow all IPs" or similar setting).
- **Prisma Client Error:** If you see errors about Prisma Client not being initialized, ensure the `postinstall` script in `package.json` is running correctly: `"postinstall": "npx prisma generate --schema=./backend/prisma/schema.prisma"`.
- **CORS Issues:** The backend is configured to accept requests from the frontend via Vercel rewrites (`/api/...`), so CORS issues should be minimal if `VITE_API_URL` is set to `/api`.

## 5. Project Structure for Vercel

- **`vercel.json`**: Configures rewrites so requests to `/api/*` are handled by `backend/index.js`.
- **`package.json`**: Merged dependencies so Vercel installs both frontend and backend packages.
- **`backend/index.js`**: Adapted to run as a serverless function (exports `app`) and uses `/tmp` for temporary file storage.

## 6. Understanding the Code Changes for Deployment

This section explains _why_ we made specific changes to the codebase. This is helpful for understanding how the app differs from a standard local setup.

### 1. `backend/index.js`

- **Change:** Replaced local file storage with `os.tmpdir()`.
  - **Reason:** Vercel Serverless Functions run in a read-only environment. We cannot save uploaded files to the project folder. The only writable location is the system's temporary directory (`/tmp`), which we use to store files briefly before uploading them to Cloudinary.
- **Change:** Added `/api` prefix to all routes (e.g., `/login` $\rightarrow$ `/api/login`).
  - **Reason:** We serve both the Frontend and Backend from the same domain. The `/api` prefix helps Vercel distinguish between a request for a webpage (Frontend) and a request for data (Backend).
- **Change:** Exported the app (`module.exports = app`).
  - **Reason:** Vercel doesn't run the server using `node index.js`. Instead, it imports the `app` instance and turns it into a serverless function handler.

### 2. `src/config.ts`

- **Change:** Updated endpoint to `import.meta.env.VITE_API_URL || "http://localhost:3000"`.
  - **Reason:**
    - **Locally:** We want to point to `http://localhost:3000`.
    - **Production:** We want to point to `/api`. Using a relative path (`/api`) avoids CORS (Cross-Origin Resource Sharing) issues because the browser treats the frontend and backend as the same site.

### 3. `package.json` (Root)

- **Change:** Merged `backend/package.json` dependencies into the root `package.json`.
  - **Reason:** Vercel installs dependencies from the root. By moving backend packages (like `express`, `prisma`, `cloudinary`) to the root, we ensure they are available when Vercel builds the app.
- **Change:** Added `"postinstall": "npx prisma generate..."`.
  - **Reason:** Prisma Client is code that is _generated_ based on your schema. When Vercel downloads your code, that generated code doesn't exist yet. This script forces Vercel to generate it before trying to build the React app, preventing "Module not found" errors.

### 4. `vercel.json`

- **Change:** Created this configuration file.
  - **Reason:** This file tells Vercel how to route traffic. The `rewrites` section is the most important: it tells Vercel "If a user visits `/api/...`, don't look for a React page. Instead, send that request to `backend/index.js`".

### 5. `backend/prisma/schema.prisma`

- **Change:** Changed `provider` from `mysql` to `postgresql`.
  - **Reason:** To support **Neon**, a serverless PostgreSQL database. Serverless databases are recommended for Vercel because they handle connection scaling much better than traditional servers.
