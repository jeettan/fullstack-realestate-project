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

### 🔐 Authentication

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
