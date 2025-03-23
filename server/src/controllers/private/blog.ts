import express, { Request, Response, Router } from "express";
import blogModel from "../../models/Blog/Blog";

const router: Router = express.Router();

// Create Blog
router.post("/create", async (req: Request, res: Response): Promise<void> => {
    try {
        const { author, title, content, summary, tags, category } = req.body;

        const newBlog = new blogModel({
            author,
            title,
            content,
            summary,
            tags,
            category
        });

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get All Blogs
router.get("/getall", async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await blogModel.find().populate("author", "name email");
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Blog by ID
router.get("/getbyid/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const blog = await blogModel.findById(req.params.id).populate("author", "name email");
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Edit Blog by ID
router.put("/edit/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedBlog = await blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Blog by ID
router.delete("/deletebyid/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
