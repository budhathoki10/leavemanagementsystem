const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendMail = async (checkid) => {
  try {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: checkid.studentdetail.email,
      subject: 'Leave Application Reply',
      html: `
        <p>Dear <strong>${checkid.studentdetail.studentname || 'Student'}</strong>,</p>
        <p>
          We would like to inform you that your application for a 
          <strong>${checkid.leaveType}</strong> leave has been 
          <strong style="color:${checkid.status === 'approve' ? 'green' : 'red'};">
            ${checkid.status.toUpperCase()}
          </strong>.
        </p>
        <p>Thank you for notifying us.</p>
        <p>Best regards,<br/>Herald College Kathmandu</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(` Email sent: ${info.response}`);
  } catch (error) {
    console.error(' Error sending email:', error.message);
  }
};

module.exports = sendMail;
