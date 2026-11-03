const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  path: "/",
};

// Generate Access and Refresh Tokens
const generateTokens = (adminId) => {
  const accessToken = jwt.sign(
    {
      id: adminId,
      type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: adminId,
      type: "refresh",
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Set Both Cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("adminAccessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("adminRefreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Clear Both Cookies
const clearAuthCookies = (res) => {
  res.clearCookie("adminAccessToken", cookieOptions);
  res.clearCookie("adminRefreshToken", cookieOptions);
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = generateTokens(admin._id);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (!refreshToken) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token missing. Please login again.",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (decoded.type !== "refresh") {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    // Check whether admin still exists
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(admin._id);

    setAuthCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
    });
  } catch (error) {
    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid. Please login again.",
    });
  }
};

// Admin Logout
const adminLogout = (req, res) => {
  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

const getAdminSession = async (req, res) => {
  const admin = await Admin.findById(req.adminId).select("name email");
  if (!admin) return res.status(401).json({ success: false, message: "Admin session is invalid." });
  return res.status(200).json({ success: true, admin });
};

module.exports = {
  adminLogin,
  refreshAccessToken,
  adminLogout,
  getAdminSession,
};
