# Scalable MERN E-commerce System

A scalable **E-commerce web application** built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.
This project demonstrates **clean backend architecture, authentication flows, modular folder structure, and scalable development practices** rather than focusing heavily on UI design.

The system supports a full **E-commerce workflow**, including product management, shopping cart functionality, order placement, invoice generation, and email notifications.

---

# 🚀 Features

## User Features

* User Registration and Login
* JWT-based Authentication
* Browse Products
* Add/Remove items from Cart
* Place Orders
* View Order History
* Receive Order Confirmation Email
* Download Invoice (PDF)

## Admin Features

* Admin Authentication
* Create / Update / Delete Products
* Upload Multiple Product Images
* Manage Orders
* Update Order Status
* View All Users

---

# 🏗️ Tech Stack

### Frontend

* React
* React Router
* Redux Toolkit / RTK Query
* TailwindCSS (optional)
* Axios / Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* HTTP-only Cookies

### File Upload

* Multer

### Email Service

* Nodemailer

### PDF Generation

* PDFKit / Puppeteer

---

# 📂 Project Structure

```
project-root
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── utils
│   ├── config
│   ├── uploads
│   └── server.js
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── features
│   │   ├── hooks
│   │   ├── services
│   │   └── utils
│   │
│   └── package.json
│
└── README.md
```

This modular architecture ensures **maintainability, scalability, and separation of concerns**.

---

# 🔐 Authentication & Authorization

Authentication is implemented using **JWT (JSON Web Tokens)**.

### Public Routes

* User Registration
* User Login
* Product Listing
* Product Details

### Protected Routes

* Add to Cart
* Place Order
* View Profile
* View Order History

### Admin Only Routes

* Create Product
* Update Product
* Delete Product
* Manage Orders

Role-based access control is implemented using a **`role` field** in the user schema.

Example:

```json
{
  "role": "admin"
}
```

---

# 🛒 E-commerce Workflow

```
User Registration / Login
        ↓
Browse Products
        ↓
Add Products to Cart
        ↓
Checkout
        ↓
Order Creation
        ↓
PDF Invoice Generation
        ↓
Order Confirmation Email
```

---

# 🧾 Invoice Generation

When an order is placed:

1. The backend generates a **PDF invoice**.
2. The invoice includes:

   * Order ID
   * Customer Details
   * Product List
   * Quantity
   * Price per Product
   * Total Amount

The PDF is generated using:

* **PDFKit** or
* **Puppeteer**

---

# 📧 Email Notification

After a successful order:

1. The server generates the invoice.
2. The invoice PDF is attached to an email.
3. Email is sent using **Nodemailer**.

Example Email Content:

```
Subject: Order Confirmation

Your order has been successfully placed.

Please find the invoice attached.
```

---

# 🖼️ Product Image Upload

Product images are uploaded using **Multer** middleware.

Features:

* Multiple images per product
* Stored in `/uploads`
* Image path saved in MongoDB

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:5173
```

---

# ▶️ Installation

### Clone the repository

```
git clone https://github.com/yourusername/mern-ecommerce.git
```

### Install backend dependencies

```
cd backend
npm install
```

### Install frontend dependencies

```
cd frontend
npm install
```

---

# ▶️ Run the Application

### Start Backend

```
cd backend
npm run dev
```

### Start Frontend

```
cd frontend
npm run dev
```

---

# 📊 Scalability Considerations

This project is structured to scale for **large applications**.

Key design practices:

* Layered architecture
* Modular services
* Separation of concerns
* Reusable middleware
* Role-based authorization
* Stateless authentication with JWT
* Clean folder structure

---

# 🧪 Testing API

You can test APIs using:

* Postman
* Thunder Client

Example endpoints:

```
POST /api/auth/register
POST /api/auth/login
GET  /api/products
POST /api/orders
GET  /api/orders/my-orders
```

---

# 📌 Future Improvements

Possible enhancements:

* Payment Gateway Integration (Stripe/Razorpay)
* Redis for caching carts
* Product search with Elasticsearch
* Image storage using AWS S3
* Microservices architecture
* Docker deployment
* CI/CD pipeline

---

# 👨‍💻 Author

Developed as part of a **MERN Stack Backend Architecture Assignment**.

Focus areas:

* Clean architecture
* Scalable backend design
* Authentication flow
* Modular project structure
