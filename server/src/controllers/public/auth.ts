import express from "express";
import passport from "../../utils/passport";

const router = express.Router();

// GitHub login route
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub callback route
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const { user, token }: any = req.user;
    res.json({ message: "GitHub Login Successful!", user, token });
  }
);

export default router;
