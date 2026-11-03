const express = require("express");
const router = express.Router();

const {
  sendEnquiryEmail,
} = require("../controllers/emailController");

router.post("/send", sendEnquiryEmail);

module.exports = router;