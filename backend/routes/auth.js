const express = require("express");
const { requestOTP, verifyOTP } = require("../controllers/authController");
const {
  validateRequest,
  validateOTPRequest,
} = require("../middleware/validation");

const router = express.Router();

router.post("/request-otp", validateRequest, requestOTP);
router.post("/verify-otp", validateOTPRequest, verifyOTP);

const googleAuthRoutes = require("./googleAuth");
router.use("/", googleAuthRoutes);

module.exports = router;
