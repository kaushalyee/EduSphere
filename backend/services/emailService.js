const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const brandHeader = `
  <div style="background-color:#1a73e8;padding:24px 32px;text-align:center;">
    <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:1px;font-family:Arial,sans-serif;">
      EduSphere
    </h1>
    <p style="margin:4px 0 0;color:#d0e8ff;font-size:13px;font-family:Arial,sans-serif;">
      Your Learning, Verified.
    </p>
  </div>
`;

const brandFooter = `
  <div style="background-color:#f1f5f9;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;color:#64748b;font-size:12px;font-family:Arial,sans-serif;">
      &copy; ${new Date().getFullYear()} EduSphere Team &nbsp;|&nbsp; This is an automated message, please do not reply.
    </p>
  </div>
`;

function wrapEmail(bodyHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin:0;padding:0;background-color:#f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0"
                style="background-color:#ffffff;border-radius:8px;overflow:hidden;
                       box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;width:100%;">
                <tr><td>${brandHeader}</td></tr>
                <tr>
                  <td style="padding:36px 40px;font-family:Arial,sans-serif;color:#1e293b;">
                    ${bodyHtml}
                  </td>
                </tr>
                <tr><td>${brandFooter}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function sendRegistrationEmail(studentEmail, studentName) {
  const body = `
    <h2 style="margin:0 0 16px;color:#1a73e8;font-size:20px;">Registration Received</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Hi <strong>${studentName}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Thank you for registering with EduSphere! We've received your account and documents.
    </p>
    <div style="background-color:#eff6ff;border-left:4px solid #1a73e8;
                padding:16px 20px;border-radius:4px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#1e40af;">
        <strong>Your account is currently pending verification.</strong>
      </p>
      <ul style="margin:8px 0 0;padding-left:18px;font-size:14px;line-height:1.8;color:#1e40af;">
        <li>Our admin team will review your submitted documents within <strong>24–48 hours</strong>.</li>
        <li>You will receive another email once your account has been reviewed.</li>
      </ul>
    </div>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;">
      If you have any questions in the meantime, please contact your institution's support team.
    </p>
    <p style="margin:24px 0 0;font-size:15px;">
      Warm regards,<br>
      <strong style="color:#1a73e8;">The EduSphere Team</strong>
    </p>
  `;

  await transporter.sendMail({
    from: `"EduSphere" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'EduSphere — Registration Received',
    html: wrapEmail(body),
  });
}

async function sendApprovalEmail(studentEmail, studentName) {
  console.log('sendApprovalEmail called for:', studentEmail);
  const body = `
    <h2 style="margin:0 0 16px;color:#16a34a;font-size:20px;">Account Approved! 🎉</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Hi <strong>${studentName}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Congratulations! Your EduSphere student account has been successfully verified.
    </p>
    <div style="background-color:#f0fdf4;border-left:4px solid #16a34a;
                padding:16px 20px;border-radius:4px;margin:20px 0;">
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#166534;">
        <li>Your student account has been <strong>verified and approved</strong>.</li>
        <li>You now have <strong>full access</strong> to all EduSphere features.</li>
        <li>Log in now to start your learning journey!</li>
      </ul>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="#"
        style="background-color:#1a73e8;color:#ffffff;padding:12px 32px;
               border-radius:6px;text-decoration:none;font-size:15px;
               font-weight:bold;display:inline-block;">
        Log In to EduSphere
      </a>
    </div>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;">
      We're excited to have you on board. Good luck with your studies!
    </p>
    <p style="margin:24px 0 0;font-size:15px;">
      Warm regards,<br>
      <strong style="color:#1a73e8;">The EduSphere Team</strong>
    </p>
  `;

  const mailOptions = {
    from: `"EduSphere" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'EduSphere — Account Approved! 🎉',
    html: wrapEmail(body),
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
}

async function sendRejectionEmail(studentEmail, studentName, rejectionReason) {
  const body = `
    <h2 style="margin:0 0 16px;color:#dc2626;font-size:20px;">Verification Rejected</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Hi <strong>${studentName}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Unfortunately, your EduSphere account verification was not approved at this time.
    </p>
    <div style="background-color:#fef2f2;border-left:4px solid #dc2626;
                padding:16px 20px;border-radius:4px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#991b1b;">
        Reason for rejection:
      </p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#991b1b;">
        ${rejectionReason}
      </p>
    </div>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">
      You can log in and resubmit your documents. Please ensure they meet the following requirements:
    </p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;
                padding:16px 20px;border-radius:4px;margin:12px 0 20px;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#475569;">
        Accepted documents:
      </p>
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#475569;">
        <li>Exam Timetable</li>
        <li>Student Enrollment Letter</li>
        <li>Course Registration Document</li>
      </ul>
      <p style="margin:12px 0 0;font-size:13px;color:#94a3b8;">
        Documents must be issued within the last 6 months.
      </p>
    </div>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;">
      If you believe this decision was made in error, please contact your institution's support team.
    </p>
    <p style="margin:24px 0 0;font-size:15px;">
      Regards,<br>
      <strong style="color:#1a73e8;">The EduSphere Team</strong>
    </p>
  `;

  await transporter.sendMail({
    from: `"EduSphere" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'EduSphere — Account Verification Rejected',
    html: wrapEmail(body),
  });
}

async function sendResubmissionEmail(studentEmail, studentName, resubmissionNote) {
  const body = `
    <h2 style="margin:0 0 16px;color:#d97706;font-size:20px;">Document Resubmission Required</h2>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Hi <strong>${studentName}</strong>,
    </p>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
      Our admin team has reviewed your verification documents and requires a resubmission before your
      account can be approved.
    </p>
    <div style="background-color:#fffbeb;border-left:4px solid #d97706;
                padding:16px 20px;border-radius:4px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#92400e;">
        Admin note:
      </p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#92400e;">
        ${resubmissionNote}
      </p>
    </div>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">
      Please log in and resubmit your documents. Make sure they meet the following requirements:
    </p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;
                padding:16px 20px;border-radius:4px;margin:12px 0 20px;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#475569;">
        Accepted documents:
      </p>
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#475569;">
        <li>Exam Timetable</li>
        <li>Student Enrollment Letter</li>
        <li>Course Registration Document</li>
      </ul>
      <p style="margin:12px 0 0;font-size:13px;color:#94a3b8;">
        Documents must be issued within the last 6 months.
      </p>
    </div>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;">
      Once you've resubmitted, our team will review your documents promptly.
    </p>
    <p style="margin:24px 0 0;font-size:15px;">
      Regards,<br>
      <strong style="color:#1a73e8;">The EduSphere Team</strong>
    </p>
  `;

  await transporter.sendMail({
    from: `"EduSphere" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'EduSphere — Document Resubmission Required',
    html: wrapEmail(body),
  });
}

module.exports = {
  sendRegistrationEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendResubmissionEmail,
};
