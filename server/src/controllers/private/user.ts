import express, { Request, Response, Router } from "express";
import userModel from "../../models/User/User";
import multer from "multer";
import path from "path";

const router: Router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads/")); // Store files in "src/uploads"
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Multer File Upload Middleware
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            return cb(new Error("Only images are allowed!"));
        }
    },
});

// Get All Users
router.get("/getall", async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get User by ID
router.get("/getbyid/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete All Users
router.delete("/deleteall", async (req: Request, res: Response): Promise<void> => {
    try {
        await userModel.deleteMany({});
        res.status(200).json({ message: "All users deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete User by ID
router.delete("/deletebyid/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Edit User by ID
router.put("/edit/:id", upload.single("avatar"), async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedData: any = { ...req.body };
        if (req.file) {
            updatedData.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Upload Avatar
router.post("/upload-avatar/:id", upload.single("avatar"), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { avatar: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "Avatar uploaded successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
