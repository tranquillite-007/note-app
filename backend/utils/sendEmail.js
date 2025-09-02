const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Using Gmail service");
    console.log("FROM_EMAIL:", process.env.FROM_EMAIL);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_API_KEY,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Send email
    const info = await transporter.sendMail({
      from: `"Note Taking App" <${process.env.FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);

    if (error.code === "EAUTH") {
      console.error("Authentication failed. Check your Gmail app password.");
    } else if (error.code === "EENVELOPE") {
      console.error("Invalid recipient email address.");
    }

    return false;
  }
};

const sendOTPEmail = async (email, otpCode) => {
  const subject = "Your OTP for Note Taking App";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">Note Taking App</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
      <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="color: #4CAF50; letter-spacing: 8px; margin: 0; font-size: 32px;">
          ${otpCode}
        </h1>
      </div>
      <p style="font-size: 14px; color: #666;">This OTP will expire in 10 minutes.</p>
      <p style="font-size: 14px; color: #666;">If you didn't request this OTP, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        This is an automated message from Note Taking App. Please do not reply to this email.
      </p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
};
