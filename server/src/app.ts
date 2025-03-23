import express, { Request, Response } from "express";
import config from "config";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";  // ✅ Import Morgan for logging
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleWare from "./controllers/middleware/auth";
import publicRouter from "./controllers/public/index";
import githubRouter from "./controllers/public/auth";
import blogRouter from "./controllers/private/blog";
import commentRouter from "./controllers/private/comment";
import userRouter from "./controllers/private/user";
import "./utils/dbConnect";

const app = express();
const PORT: number = config.get<number>("PORT") || 5000;

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images and PDFs are allowed!"));
    }
  },
});

// ✅ Security & Logging Middleware
app.use(helmet()); // 🚀 Adds security headers
app.use(morgan("dev")); // 📜 Logs requests
app.use(
  cors({
    origin: ["http://localhost:5173"], // ✅ Allow React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // ✅ Each IP can make a maximum of 100 requests
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ✅ Public Routes
app.use("/api/public", publicRouter);
app.use("/api/public/auth", githubRouter);

// ✅ Protected Routes (Require Authentication)
app.use(authMiddleWare);
app.use("/api/private/user", userRouter);
app.use("/api/private/blog", blogRouter);
app.use("/api/private/comment", commentRouter);

// ✅ Upload Route
app.post("/api/private/upload", upload.single("file"), (req: Request, res: Response):void => {
  try {
    if (!req.file) {
       res.status(400).json({ message: "No file uploaded" });
       return;
    }

    res.status(200).json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "✅ Server is running and working" });
  } catch (error) {
    res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

// 404 Middleware for Unknown Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "❌ Not Found Router" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
