const User = require("../models/User");
const { sendOTPEmail } = require("../utils/sendEmail");
const { generateToken } = require("../middleware/auth");
const { validateEmail, validateOTP } = require("../middleware/validation");

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP
const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user's OTP
      user.otp = {
        code: otpCode,
        expiresAt: otpExpires,
      };
      await user.save();
    } else {
      // Create new user with OTP
      user = await User.create({
        email,
        otp: {
          code: otpCode,
          expiresAt: otpExpires,
        },
      });
    }

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otpCode);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please request a new OTP.",
      });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please request a new one.",
      });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP code
    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code.",
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
};
