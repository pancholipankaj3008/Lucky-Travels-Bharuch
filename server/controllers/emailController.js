const transporter = require("../config/email");
const Car = require("../models/Car");

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

/* ------------------------------------------------------------------ */
/*  EMAIL UI (sirf design, koi logic nahi)                             */
/*  Email clients ke liye table + inline CSS use kiya hai.             */
/*  Optional .env:  EMAIL_LOGO_URL (public https logo URL)             */
/*                  SUPPORT_PHONE  (customer ko dikhane ke liye)       */
/* ------------------------------------------------------------------ */
const C = {
  red: "#e3252d",
  redSoft: "#fde8e9",
  redLine: "#f3c5c8",
  dark: "#14171d",
  navy: "#0f1b3d",
  bg: "#f4f6f9",
  line: "#eceef3",
  muted: "#6b7280",
};

const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const detailRow = (label, value) => `
  <tr>
    <td style="padding:13px 18px; width:36%; border-bottom:1px solid ${C.line}; vertical-align:top; font-size:12px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:${C.muted};">${label}</td>
    <td style="padding:13px 18px; border-bottom:1px solid ${C.line}; vertical-align:top; font-size:15px; font-weight:600; color:${C.navy}; white-space:pre-wrap;">${value}</td>
  </tr>`;

const detailsTable = (safe) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.redLine}; border-radius:12px; border-collapse:separate; border-spacing:0; overflow:hidden; background:#ffffff;">
    ${detailRow("Name", safe.name)}
    ${detailRow("Email", safe.email)}
    ${detailRow("Phone", safe.phone)}
    ${detailRow("Car", safe.car || "Not selected")}
    ${detailRow("Pickup", safe.pickupLocation || "Not provided")}
    ${detailRow("Destination", safe.destination || "Not provided")}
    ${detailRow("Travel Date", safe.travelDate || "Not provided")}
    ${detailRow("Message", safe.message || "No message")}
  </table>`;

const button = (href, label, filled = true) => `
  <a href="${href}" style="display:inline-block; margin:0 8px 8px 0; padding:12px 22px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none; ${
    filled
      ? `background:${C.red}; color:#ffffff; border:1px solid ${C.red};`
      : `background:#ffffff; color:${C.red}; border:1px solid ${C.red};`
  }">${label}</a>`;

const emailShell = ({ preheader, badge, body }) => {
  const logo = process.env.EMAIL_LOGO_URL
    ? `<img src="${escapeHtml(process.env.EMAIL_LOGO_URL)}" alt="Lucky Travels" height="48" style="display:block; margin:0 auto 10px; height:48px; width:auto;" />`
    : `<div style="font-size:26px; font-weight:800; letter-spacing:1.5px; color:#ffffff;">LUCKY <span style="color:${C.red};">TRAVELS</span></div>`;

  return `
  <div style="margin:0; padding:0; background:${C.bg};">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}; padding:28px 12px; font-family:${FONT};">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 28px rgba(15,27,61,0.12);">

            <!-- Header -->
            <tr>
              <td style="background:${C.dark}; padding:30px 24px 26px; text-align:center;">
                ${logo}
                <div style="font-size:11px; letter-spacing:3px; color:#c9ccd3; text-transform:uppercase;">Your journey, our priority</div>
              </td>
            </tr>
            <tr><td style="height:5px; background:${C.red}; line-height:5px; font-size:0;">&nbsp;</td></tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 28px 8px; color:#334155;">
                ${
                  badge
                    ? `<div style="display:inline-block; margin-bottom:14px; padding:6px 14px; border-radius:999px; background:${C.redSoft}; color:${C.red}; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">${badge}</div>`
                    : ""
                }
                ${body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 24px; background:${C.dark}; text-align:center; color:#c9ccd3; font-size:12px; line-height:1.7;">
                Thank you for travelling with <b style="color:#ffffff;">Lucky Travels</b><br/>
                Bharuch, Gujarat, India
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
};

const buildAdminEmail = ({ safe, formType, phone }) => {
  const telHref = `tel:${String(phone).replace(/[^\d+]/g, "")}`;
  const receivedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  return emailShell({
    preheader: `New enquiry from ${safe.name} - ${safe.car || "no car selected"}`,
    badge: escapeHtml(String(formType || "Enquiry").slice(0, 80)),
    body: `
      <h2 style="margin:0 0 6px; font-size:24px; color:${C.navy};">New Customer Enquiry</h2>
      <p style="margin:0 0 22px; font-size:14px; color:${C.muted};">Received on ${escapeHtml(receivedAt)} (IST)</p>

      ${detailsTable(safe)}

      <div style="margin-top:24px;">
        ${button(`mailto:${safe.email}`, "Reply by Email")}
        ${button(telHref, "Call Customer", false)}
      </div>
      <p style="margin:6px 0 24px; font-size:12px; color:${C.muted};">Customer ko 24 ghante ke andar contact karna hai.</p>
    `,
  });
};

const buildCustomerEmail = ({ safe }) => {
  const supportLine = process.env.SUPPORT_PHONE
    ? `<p style="margin:0 0 6px; font-size:14px;">Need help right away? Call us at <b style="color:${C.navy};">${escapeHtml(process.env.SUPPORT_PHONE)}</b>.</p>`
    : "";

  return emailShell({
    preheader: "We have received your request. Our team will contact you within 24 hours.",
    badge: "Request received",
    body: `
      <h2 style="margin:0 0 12px; font-size:24px; color:${C.navy};">Thank You, ${safe.name}!</h2>
      <p style="margin:0 0 22px; font-size:15px; line-height:1.7;">Thank you for choosing Lucky Travels. We have successfully received your request.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.redSoft}; border:1px solid ${C.redLine}; border-left:5px solid ${C.red}; border-radius:10px; margin-bottom:26px;">
        <tr>
          <td style="padding:18px 20px;">
            <div style="font-size:13px; font-weight:700; color:${C.red}; letter-spacing:0.5px;">&#10003; REQUEST RECEIVED</div>
            <div style="margin:6px 0; font-size:22px; font-weight:800; color:${C.navy};">Within 24 Hours</div>
            <div style="font-size:14px; line-height:1.6; color:#475569;">Our team will contact you within 24 hours to discuss your travel requirements.</div>
          </td>
        </tr>
      </table>

      <h3 style="margin:0 0 12px; font-size:16px; color:${C.navy};">Your request summary</h3>
      ${detailsTable(safe)}

      <div style="margin-top:26px;">
        ${supportLine}
        <p style="margin:0 0 6px; font-size:15px; line-height:1.7;">We look forward to making your journey comfortable and memorable!</p>
        <p style="margin:22px 0 24px; font-size:15px;">Warm Regards,<br/><b style="color:${C.navy};">Team Lucky Travels</b></p>
      </div>
    `,
  });
};

/* ------------------------------------------------------------------ */
/*  CONTROLLER (logic wahi hai, sirf html ab upar ke templates se)     */
/* ------------------------------------------------------------------ */
const sendEnquiryEmail = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      car,
      pickupLocation,
      destination,
      travelDate,
      message,
      formType,
    } = req.body;

    if (!name || !email || !phone || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required.",
      });
    }

    if (car && !(await Car.exists({ name: car }))) {
      return res.status(400).json({ success: false, message: "Selected car is unavailable. Please choose another car." });
    }
    const safe = Object.fromEntries(Object.entries({ name, email, phone, car, pickupLocation, destination, travelDate, message }).map(([key, value]) => [key, escapeHtml(value || "")]));

    const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (
      !process.env.BREVO_USER ||
      !process.env.BREVO_PASS ||
      !process.env.EMAIL_USER ||
      !adminRecipient
    ) {
      console.error(
        "Email configuration missing: set BREVO_USER, BREVO_PASS, EMAIL_USER (verified sender), and ADMIN_EMAIL (or use EMAIL_USER as recipient)."
      );
      return res.status(503).json({ success: false, message: "Email service is not configured. Please contact us by phone." });
    }

    // Admin notification is the primary enquiry delivery.
    try {
      await transporter.sendMail({
        from: `"Lucky Travels" <${process.env.EMAIL_USER}>`,
        to: adminRecipient,
        replyTo: { name: String(name).slice(0, 80), address: email },
        subject: `New Customer Enquiry - ${String(formType || "Enquiry").slice(0, 80)} - ${String(name).slice(0, 80)}`,
        html: buildAdminEmail({ safe, formType, phone }),
      });
    } catch (error) {
      console.error("Admin enquiry email failed:", error.code || error.name, error.message);
      return res.status(502).json({ success: false, message: "We could not deliver your enquiry right now. Please call us or try again later." });
    }

    // Customer confirmation is secondary; an SMTP hiccup here must not lose the enquiry.
    try {
      await transporter.sendMail({
        from: `"Lucky Travels" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "We've Received Your Request - Lucky Travels",
        html: buildCustomerEmail({ safe }),
      });
    } catch (error) {
      console.error("Customer confirmation email failed after admin delivery:", error.code || error.name, error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Your request has been submitted successfully!",
    });

  } catch (error) {
    console.error("Email request failed:", error.code || error.name, error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send your request. Please try again.",
    });
  }
};

module.exports = { sendEnquiryEmail };
