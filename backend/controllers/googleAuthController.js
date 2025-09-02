const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      success: true,
      payload,
    };
  } catch (error) {
    console.error("Google token verification error:", error);
    return {
      success: false,
      error: "Invalid Google token",
    };
  }
};

// Google authentication
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify Google token
    const verification = await verifyGoogleToken(token);

    if (!verification.success) {
      return res.status(401).json({
        success: false,
        message: verification.error,
      });
    }

    const { payload } = verification;
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists in mongo database (using email or googleId)
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.name = name || user.name;
        user.avatar = picture || user.avatar;
        user.isVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email,
        googleId,
        name: name || "",
        avatar: picture || "",
        isVerified: true,
      });
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during Google authentication",
    });
  }
};

module.exports = {
  googleAuth,
};
