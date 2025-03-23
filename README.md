# prime-Backend

# AI-Powered Blog Backend

## 📌 Overview
This is the backend for an AI-powered blog application built with **TypeScript, Express.js, MongoDB, and Mongoose**. It supports authentication, blog management, comments, and AI-powered features using OpenAI.

---
## 📂 Folder Structure

```
server/
│── src/
│   ├── controllers/
│   │   ├── public/
│   │   │   ├── index.ts  # Public routes (Signup, Signin, etc.)
│   │   │   ├── auth.ts    # GitHub authentication
│   │   ├── private/
│   │   │   ├── blog.ts    # Blog management routes
│   │   │   ├── comment.ts # Comment management routes
│   │   │   ├── user.ts    # User profile routes
│   ├   | middleware/
│   │   |   ├── auth.ts        # Authentication middleware
│   ├── models/
│   │   ├── User.ts        # User schema
│   │   ├── Blog.ts        # Blog schema
│   │   ├── Comment.ts     # Comment schema
│   ├── utils/
│   │   ├── dbConnect.ts   # MongoDB connection
│   │   ├── passport.ts    # GitHub OAuth setup
|   |   ├── multer.ts
|   |   ├── sendEmail.ts   # Email send file
│   ├── app.ts             # Main Express app
│   ├── config/default.json # Configuration file
│── package.json
│── tsconfig.json
│── README.md
```

---
## 🚀 Features
✅ **User Authentication** (JWT-based authentication, Signup, Signin, GitHub OAuth)
✅ **AI-Powered Blogging** (Uses OpenAI API for content suggestions)
✅ **Blog Management** (Create, Read, Update, Delete blogs)
✅ **Comment System** (Add, delete comments)
✅ **Rate Limiting & Security** (Helmet.js, CORS, Express-rate-limit)
✅ **MongoDB Database** (Mongoose ORM)

---
## 🛠 Installation & Setup

### 1️⃣ Clone the repository:
```sh
git@github.com:syedomer17/prime-Backend.git
cd prime-Backend
```

### 2️⃣ Install dependencies:
```sh
npm install
```

### 3️⃣ Configure environment variables:
Create config folder a `default.json` file in the root directory and add:
```config
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4️⃣ Run the development server:
```sh
npm run dev
```

### 5️⃣ Build & Start the production server:
```sh
npm run dev
npm start
```

---
## 📡 API Endpoints

### Public Routes:
| Method | Endpoint          | Description        |
|--------|------------------|--------------------|
| POST   | `/api/public/signup` | User Signup |
| POST   | `/api/public/signin` | User Signin |
| GET    | `/api/public/auth/github` | GitHub OAuth |

### Private Routes (Require Authentication):
| Method | Endpoint          | Description        |
|--------|------------------|--------------------|
| POST   | `/api/private/blog` | Create Blog |
| GET    | `/api/private/blog/:id` | Get Blog by ID |
| PUT    | `/api/private/blog/:id` | Update Blog |
| DELETE | `/api/private/blog/:id` | Delete Blog |
| POST   | `/api/private/comment` | Add Comment |

---
## ⚡ Technologies Used
- **TypeScript** - Strongly-typed JavaScript
- **Express.js** - Fast backend framework
- **MongoDB & Mongoose** - NoSQL Database
- **JWT** - Authentication
- **Helmet.js** - Security
- **CORS** - Cross-Origin Resource Sharing
- **Multer** - File Uploads
- **OpenAI API** - AI-powered features
- **GitHub OAuth** - Social Authentication

---
## 💡 How It Works
1. Users can **sign up** or **log in** using email-password or GitHub OAuth.
2. Authenticated users can **create, edit, or delete blogs**.
3. Other users can **view blogs** and **comment**.
4. AI-powered features (like blog suggestions) are handled using OpenAI's API.
5. Rate limiting and security measures prevent abuse.
6. JWT tokens are used for authentication and stored in **HTTP-only cookies**.

---
## 🤖 Future Enhancements
- AI-powered **blog summarization**
- **Email notifications** for new comments
- **Admin dashboard** for managing blogs
- Support for **categories & tags**

---
## ✨ Contributing
Feel free to contribute! Fork the repo, make changes, and submit a pull request. 🚀

---
## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

