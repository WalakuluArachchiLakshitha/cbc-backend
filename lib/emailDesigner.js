export default function getDesignedEmail({ otp, firstName, brandName, supportEmail, colors }) {
    const accent = (colors && colors.accent) || "#fa812f";
    const primary = (colors && colors.primary) || "#fef3e2";
    const secondary = (colors && colors.secondary) || "#393e46";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:${accent};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">${brandName}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;color:${secondary};">
              <p style="font-size:18px;font-weight:600;margin:0 0 12px;">Hi ${firstName}! 👋</p>
              <p style="font-size:15px;color:#555;margin:0 0 24px;line-height:1.6;">
                We received a request to reset your password. Use the OTP below to proceed.
                This code is valid for <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background-color:${primary};border:2px dashed ${accent};border-radius:10px;padding:28px;text-align:center;margin:0 0 28px;">
                <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:2px;">Your One-Time Password</p>
                <p style="margin:0;font-size:42px;font-weight:800;color:${accent};letter-spacing:10px;">${otp}</p>
              </div>

              <p style="font-size:14px;color:#888;margin:0 0 8px;">
                If you did not request a password reset, please ignore this email or contact us immediately.
              </p>
              <p style="font-size:14px;color:#888;margin:0;">
                Need help? <a href="mailto:${supportEmail}" style="color:${accent};text-decoration:none;">${supportEmail}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#aaa;">
                © ${new Date().getFullYear()} ${brandName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
