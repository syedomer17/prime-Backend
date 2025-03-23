import express, { Request, Response, Router } from "express";
import commentModel from "../../models/Comment/Comment";

const router: Router = express.Router();

// Add Comment
router.post("/add", async (req: Request, res: Response): Promise<void> => {
    try {
        const { blogId, userId, content } = req.body;

        const newComment = new commentModel({ blogId, userId, content });
        await newComment.save();

        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Comments by Blog ID
router.get("/getbyblog/:blogId", async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await commentModel.find({ blogId: req.params.blogId }).populate("userId", "name email");
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Comment by ID
router.delete("/delete/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedComment = await commentModel.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
