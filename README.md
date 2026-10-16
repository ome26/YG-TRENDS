# YG Trends – Online Clothing and Stitching Management System

YG Trends is a web-based clothing and stitching management system that allows customers to explore clothing products, book stitching services, and manage their orders through a simple interface.

## Features

- Browse clothing products with images.
- User registration and login.
- Book stitching services.
- Shopping cart and checkout.
- View customer orders.
- Admin dashboard for managing orders and stitching requests.
- Backend APIs for application functionality.
- Generate PDF documents using PDFKit.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- CORS
- PDFKit

## Project Structure

```text
YG-TRENDS/
├── Backend/
│   ├── package.json
│   └── server.js
├── images/
├── admin.html
├── admin-login.html
├── booking.html
├── checkout.html
├── index.html
├── login.html
├── myorders.html
├── signup.html
├── script.js
├── style.css
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database

### Backend Setup

1. Open a terminal.
2. Navigate to the `Backend` folder.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file inside the `Backend` folder and configure your MongoDB connection string:

   ```env
   MONGO_URI=your_mongodb_connection_string
   ```

5. Start the backend:

   ```bash
   node server.js
   ```

Configure the database connection and any other required environment variables before running the application.

## Security

- Database credentials and secrets should be stored in environment variables.
- The `.env` file should not be committed to GitHub.

## Author

Om Yengupatla
