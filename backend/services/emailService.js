import nodemailer from 'nodemailer';

/**
 * Sends notification emails to the portfolio owner when a user fills out the contact form.
 */
export const sendContactEmail = async (contactDetails) => {
  const { name, email, subject, message } = contactDetails;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const toEmail = process.env.NOTIFICATION_EMAIL || user;

  if (!host || !user || !pass) {
    console.log('--- MOCK EMAIL OUTBOX ---');
    console.log(`To: ${toEmail || 'Portfolio Owner'}`);
    console.log(`From: ${email} (${name})`);
    console.log(`Subject: [New Portfolio message] ${subject}`);
    console.log(`Message:\n${message}`);
    console.log('-------------------------');
    return { success: true, message: 'Message logged (No SMTP credentials found)' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: toEmail,
      subject: `Portfolio Contact: ${subject}`,
      text: `You have received a new message from your Developer Portfolio contact form.\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Subject: ${subject}\n\n` +
            `Message:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw new Error('Failed to send email notification.');
  }
};
