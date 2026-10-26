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
  const startedAt = Date.now();
  const transporter = await getTransporter();
  const info = await transporter.sendMail({ from, to, subject, html, text });

  const previewUrl = usingEthereal ? nodemailer.getTestMessageUrl(info) : null;
  if (previewUrl) {
    console.log(`[email] Preview: ${previewUrl}`);
  }
  console.log(
    `[email] "${subject}" -> ${to} accepted by server in ${Date.now() - startedAt}ms (id: ${info.messageId})`
  );
  return { messageId: info.messageId, previewUrl };
}

function otpEmailTemplate({ name, role, otp, expiresInMinutes }) {
  const roleLabel = role === "kendra_owner" ? "Jan Aushadhi Kendra owner" : "customer";
  const digits = String(otp).split("").join("&nbsp;&nbsp;");
  return `
  <div style="margin:0; padding:0; background:#eef2f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <tr>
              <td style="background:#0f766e; background-image:linear-gradient(135deg,#0f766e,#15803d); padding:28px 32px; color:#ffffff;">
                <p style="margin:0; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; opacity:.85;">Pradhan Mantri Bhartiya Janaushadhi Pariyojana</p>
                <h1 style="margin:8px 0 0; font-size:24px; font-weight:700;">RxCompare</h1>
                <p style="margin:6px 0 0; font-size:12.5px; opacity:.9;">Prescription-to-Generic Medicine Comparator · ABDM / UHI</p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 12px;">
                <h2 style="margin:0 0 12px; color:#0f172a; font-size:20px;">Verify your email address</h2>
                <p style="margin:0 0 18px; color:#475569; font-size:14.5px; line-height:1.65;">
                  Hello ${name || "there"},<br />
                  Thank you for registering as a ${roleLabel} on RxCompare. Use the one-time
                  password (OTP) below to verify your email address.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; max-width:360px; background:#f8fafc; border:1px dashed #94a3b8; border-radius:12px;">
                  <tr>
                    <td align="center" style="padding:22px 16px;">
                      <p style="margin:0 0 10px; color:#64748b; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Your verification code</p>
                      <p style="margin:0; font-family:'Courier New', Courier, monospace; font-size:38px; font-weight:700; letter-spacing:10px; color:#0f766e;">${digits}</p>
                      <p style="margin:14px 0 0; color:#64748b; font-size:12px;">This code expires in ${expiresInMinutes} minutes.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 32px 8px;">
                <p style="margin:0 0 14px; color:#334155; font-size:14px; line-height:1.65;">
                  Enter this code on the verification page to activate your account.
                  For your security, never share this OTP with anyone — RxCompare staff
                  will never ask you for it.
                </p>
                ${
                  role === "kendra_owner"
                    ? `<p style="margin:0 0 14px; color:#92400e; background:#fffbeb; border:1px solid #fde68a; padding:12px 14px; border-radius:8px; font-size:13px; line-height:1.6;">
                         After verification, your Kendra application will be reviewed by the PMBJP administrator before your shop goes live.
                       </p>`
                    : ""
                }
                <p style="margin:0; color:#64748b; font-size:13px; line-height:1.6;">
                  If you did not create this account, you can safely ignore this email —
                  no account will be activated without the code above.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 24px;">
                <hr style="border:none; border-top:1px solid #e2e8f0; margin:0 0 16px;" />
                <p style="margin:0; color:#94a3b8; font-size:11.5px; line-height:1.6;">
                  Jan Aushadhi RxCompare · PMBJP Network · Department of Pharmaceuticals,
                  Ministry of Chemicals &amp; Fertilizers, Government of India.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

async function sendVerificationEmail({ to, name, role, otp, expiresInMinutes = 10 }) {
  return sendMail({
    to,
    subject: `Your RxCompare verification code: ${otp}`,
    html: otpEmailTemplate({ name, role, otp, expiresInMinutes }),
    text: `Hello ${name || "there"},\n\nYour RxCompare verification code is ${otp}.\nIt expires in ${expiresInMinutes} minutes.\n\nIf you did not create this account, ignore this email.`,
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
