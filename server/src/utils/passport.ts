import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import config from "config";
import userModel, { IUser } from "../models/User/User"; // Ensure IUser is exported
import jwt from "jsonwebtoken";
import { VerifyCallback } from "passport-oauth2";

const JWT_SECRET: string = config.get<string>("JWT_SECRET");

passport.use(
  new GitHubStrategy(
    {
      clientID: config.get<string>("CLIENT_ID"),
      clientSecret: config.get<string>("CLIENT_SECRET"),
      callbackURL: "http://localhost:5173/auth/getAccessToken",
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in GitHub profile"), false);
        }

        let user: IUser | null = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            avatar: profile.photos?.[0]?.value || "",
            password: "", // OAuth users won't have passwords
            userVerified: { email: true },
          });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        return done(null, { user, token }); // TypeScript should accept this now
      } catch (err) {
        // Explicitly cast err as an Error before passing to done
        const error = err instanceof Error ? err : new Error(String(err));
        return done(error, false);
      }
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export default passport;
