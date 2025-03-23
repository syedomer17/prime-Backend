import express, { Request, Response, Router } from "express";
import config from "config";
import bcrypt from "bcrypt";
import userModel from "../../models/User/User";
import sendEmail from "../../utils/sendEmail";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";

const router: Router = express.Router();
const JWT_SECRET: string = config.get<string>("JWT_SECRET");
const URL: string = config.get<string>("SERVER_URL");

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is not defined in environment variables.");
}


const app = express();
app.use(cookieParser());

//signup
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const harshPassword = await bcrypt.hash(password, 10);
    const emailToken = Math.random().toString(36).substring(2);

    const newUser = await userModel.create({
      name,
      email,
      password: harshPassword,
      userVerifiedToken: { email: emailToken },
    });
    await sendEmail({
      subject: "Email Verification",
      to: email,
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Email Verification</title>
        </head>
        <body
          style="
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="max-width: 600px; margin: auto; background-color: #ffffff"
          >
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #1e3a8a">
                <h2 style="color: #ffffff; margin: 0">Verify Your Email</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center">
                <p style="font-size: 16px; color: #374151">
                  Click the button below to verify your email address and activate
                  your account.
                </p>
                <a
                  href="${URL}/api/public/emailverify/${emailToken}"
                  style="
                    display: inline-block;
                    padding: 12px 24px;
                    margin-top: 12px;
                    background-color: #1e3a8a;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 6px;
                  "
                >
                  Verify Email
                </a>
                <p style="margin-top: 20px; font-size: 14px; color: #6b7280">
                  If the button doesn't work, copy and paste this URL:
                </p>
                <p
                  style="
                    font-size: 14px;
                    color: #1e3a8a;
                    word-break: break-all;
                    text-align: center;
                  "
                >
                  ${URL}/api/public/emailverify/${emailToken}
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="padding: 20px; text-align: center; background-color: #f3f4f6"
              >
                <p style="font-size: 12px; color: #6b7280">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
    });

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ SIGNIN - Set Cookie on Login
router.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    // 🔹 Ensure user exists and has a valid password before checking bcrypt
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // 🔹 Ensure email is verified
    if (!user.userVerified?.email) {
      res.status(400).json({ message: "Please verify your email first" });
      return;
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // 🔹 Store token in HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "User Logged In Successfully", userId: user._id });
  } catch (error) {
    console.error("Error in /signin route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get(
  "/emailverify/:token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      const user = await userModel.findOne({
        "userVerifiedToken.email": token,
      });

      if (!user) {
        res.status(400).json({ message: "Invalid verification token" });
        return;
      }

      user.userVerified.email = true;
      user.userVerifiedToken!.email = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/resetpassword",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const newPassword = Math.random().toString(36).slice(-8);
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      await sendEmail({
        subject: "Password Reset",
        to: email,
        html: `<p>Your new password: <strong>${newPassword}</strong></p>`,
      });

      res.status(200).json({ message: "New password sent to your email" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ✅ CHECK AUTH - Read Token from Cookie
router.get("/check-auth", (req: Request, res: Response): void => {
    try {
      const token = req.cookies.token; // ✅ Read token from cookies
  
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }
  
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  
      if (!decoded.id) {
        res.status(401).json({ message: "Invalid Token: Missing user ID" });
        return;
      }
  
      res.status(200).json({ message: "User is authenticated", userId: decoded.id });
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  });

/* ✅ LOGOUT (Clears Cookie) */
// ✅ LOGOUT - Clears Cookie
router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  });

export default router;