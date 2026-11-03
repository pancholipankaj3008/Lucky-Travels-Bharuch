const jwt = require("jsonwebtoken");

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminAccessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing or expired.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    req.adminId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid.",
    });
  }
};

module.exports = protectAdmin;