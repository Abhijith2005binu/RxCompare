const nodemailer = require("nodemailer");

let transporterPromise = null;
let usingEthereal = false;

/**
 * SMTP if configured, otherwise an automatic Ethereal test inbox.
 * Ethereal needs no credentials and exposes a preview URL for each message.
 */
async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST;
    if (host) {
      return nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || "false") === "true",
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });
    }

    const account = await nodemailer.createTestAccount();
    usingEthereal = true;
    console.log("[email] SMTP not configured — using Ethereal test inbox");
    console.log(`[email] Ethereal account: ${account.user}`);
    return nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    });
  })().catch((err) => {
    // Do not cache a failed transporter: allow the next request to retry.
    transporterPromise = null;
    throw err;
  });

  return transporterPromise;
}

async function sendMail({ to, subject, html, text }) {
  const from =
    process.env.MAIL_FROM || "Jan Aushadhi RxCompare <no-reply@rxcompare.gov.in>";
  const transporter = await getTransporter();
  const info = await transporter.sendMail({ from, to, subject, html, text });

  const previewUrl = usingEthereal ? nodemailer.getTestMessageUrl(info) : null;
  if (previewUrl) {
    console.log(`[email] Preview: ${previewUrl}`);
  }
  console.log(`[email] Sent "${subject}" to ${to} (id: ${info.messageId})`);
  return { messageId: info.messageId, previewUrl };
}

function verificationEmailTemplate({ name, role, link }) {
  const roleLabel = role === "kendra_owner" ? "Jan Aushadhi Kendra owner" : "customer";
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f1f5f9; padding:28px;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#0f766e,#16a34a); padding:26px 28px; color:#fff;">
        <h1 style="margin:0; font-size:21px;">Jan Aushadhi RxCompare</h1>
        <p style="margin:6px 0 0; font-size:13px; opacity:.9;">PMBJP · ABDM Network</p>
      </div>
      <div style="padding:28px;">
        <h2 style="margin:0 0 10px; color:#0f172a; font-size:19px;">Verify your ${roleLabel} account</h2>
        <p style="margin:0 0 16px; color:#475569; line-height:1.6; font-size:14px;">
          Hi ${name || "there"}, thanks for registering with RxCompare. Click the button below to
          confirm your email address. This link is valid for 24 hours.
        </p>
        <p style="text-align:center; margin:24px 0;">
          <a href="${link}" style="background:#16a34a; color:#fff; text-decoration:none; padding:12px 26px; border-radius:8px; font-weight:700; font-size:14px; display:inline-block;">
            Verify Email Address
          </a>
        </p>
        <p style="margin:0 0 6px; color:#64748b; font-size:12px;">If the button does not work, copy this link into your browser:</p>
        <p style="margin:0; word-break:break-all; font-size:12px; color:#0f766e;">${link}</p>
        ${
          role === "kendra_owner"
            ? `<p style="margin:18px 0 0; color:#92400e; background:#fffbeb; border:1px solid #fde68a; padding:10px 12px; border-radius:8px; font-size:12.5px;">
                 After email verification, your Kendra application will be reviewed by the PMBJP administrator before your shop goes live.
               </p>`
            : ""
        }
      </div>
      <div style="padding:14px 28px; background:#f8fafc; color:#94a3b8; font-size:11px; text-align:center;">
        If you did not create this account, you can safely ignore this email.
      </div>
    </div>
  </div>`;
}

async function sendVerificationEmail({ to, name, role, link }) {
  return sendMail({
    to,
    subject: "Verify your RxCompare account",
    html: verificationEmailTemplate({ name, role, link }),
    text: `Hi ${name || "there"}, verify your RxCompare account: ${link} (valid for 24 hours).`,
  });
}

async function sendKendraDecisionEmail({ to, name, kendraName, approved, reason }) {
  const subject = approved
    ? `Your Kendra "${kendraName}" is now live on RxCompare`
    : `Update on your Kendra application "${kendraName}"`;
  const body = approved
    ? `<p>Good news! Your Jan Aushadhi Kendra <strong>${kendraName}</strong> has been approved and is now live on the RxCompare network.</p>
       <p>You can sign in with your registered email to manage inventory and customer orders.</p>`
    : `<p>Your application for <strong>${kendraName}</strong> was not approved.</p>
       <p><strong>Reason:</strong> ${reason || "Incomplete documentation"}</p>
       <p>You may contact the PMBJP administrator for further assistance.</p>`;

  return sendMail({
    to,
    subject,
    html: `<div style="font-family:Arial,sans-serif;padding:24px;color:#0f172a;">
      <h2 style="color:${approved ? "#15803d" : "#b91c1c"};">${subject}</h2>
      <p>Hi ${name || "there"},</p>
      ${body}
      <p style="color:#64748b;font-size:12px;">Jan Aushadhi RxCompare · PMBJP Network</p>
    </div>`,
    text: `${subject}. ${approved ? "Your Kendra is live." : `Reason: ${reason || "Incomplete documentation"}`}`,
  });
}

module.exports = { sendMail, sendVerificationEmail, sendKendraDecisionEmail, getTransporter };
