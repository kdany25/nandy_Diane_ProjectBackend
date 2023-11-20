const ResetPasswordEmail = ({ resetLink }) => {
	return `
    <body>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f2f2f2">
        <tr>
          <td align="center" valign="top">
            <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border-radius: 6px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1); margin-top: 25px; margin-bottom: 25px;">
              <tr>
                <td valign="top" style="padding: 0 20px;">
                  <h1>Password Reset</h1>
                  <p>Hello,</p>
                  <p>We received a request to reset your password.</p>
                  <p>To reset your password, please click the link below:</p>
                  <p><a href="${resetLink}" target="_blank" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 15px; border-radius: 5px;">Reset Password</a></p>
                  <p>If you didn't request this change, you can ignore this email.</p>
                  <p>Thank you!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;
};

export { ResetPasswordEmail };
