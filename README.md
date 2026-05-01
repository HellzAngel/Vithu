# Delveri - Farmer to Customer Marketplace

A full-stack web application connecting farmers directly with customers.

## Features

*   **User Roles:** Customer, Farmer, Admin.
*   **Farmer Dashboard:** Manage products, view incoming orders, and update order statuses.
*   **Customer Dashboard:** Browse products, search & filter, add to cart, and place orders.
*   **Admin Panel:** Manage users, approve farmer listings, view all orders, and view dashboard statistics.

## Tech Stack

*   **Frontend:** React, Tailwind CSS, Three.js (for immersive 3D background effects)
*   **Backend:** Node.js, Express
*   **Database:** MongoDB
*   **Authentication:** JWT

## Setup Instructions

1.  **Clone the repository.**
2.  **Backend Setup:**
    *   Navigate to the `backend` directory: `cd backend`
    *   Install dependencies: `npm install`
    *   Start the MongoDB service locally (ensure it's running on `mongodb://localhost:27017`).
    *   Start the development server: `npm run dev`
3.  **Frontend Setup:**
    *   Navigate to the `frontend` directory: `cd frontend`
    *   Install dependencies: `npm install`
    *   Start the frontend development server: `npm start`
    *   The app will be available at `http://localhost:3000`.

## Directory Structure

```text
delveri/
├── backend/
│   ├── config/      # Database config
│   ├── middleware/  # Auth middleware
│   ├── models/      # Mongoose schema models
│   ├── routes/      # Express routes
│   └── server.js    # Entry point
└── frontend/
    ├── public/      # Static assets
    └── src/         # React application code
```
