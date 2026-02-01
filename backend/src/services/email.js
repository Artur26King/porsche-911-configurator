import sgMail from '@sendgrid/mail';

/**
 * Initialize SendGrid with API key from environment
 */
function initSendGrid() {
  const apiKey = process.env.EMAIL_API_KEY || process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.error('SendGrid API key not configured. Email sending will fail.');
    return false;
  }
  sgMail.setApiKey(apiKey);
  return true;
}

/**
 * Parse and format the from email address for SendGrid
 * Handles various formats:
 * - "Name <email@example.com>" → { name: "Name", email: "email@example.com" }
 * - "email@example.com" → { email: "email@example.com" }
 * - "Name email@example.com" → { name: "Name", email: "email@example.com" }
 */
function parseFromEmail(fromString) {
  if (!fromString) {
    return { email: 'noreply@example.com', name: 'Porsche 911 Dream' };
  }

  // Format: "Name <email@example.com>"
  const bracketMatch = fromString.match(/^(.+?)\s*<(.+@.+)>$/);
  if (bracketMatch) {
    return { name: bracketMatch[1].trim(), email: bracketMatch[2].trim() };
  }

  // Format: just "email@example.com"
  const emailOnlyMatch = fromString.match(/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/);
  if (emailOnlyMatch) {
    return { email: fromString.trim() };
  }

  // Format: "Name email@example.com" (without brackets)
  const spaceMatch = fromString.match(/^(.+?)\s+([\w.+-]+@[\w.-]+\.[a-zA-Z]{2,})$/);
  if (spaceMatch) {
    return { name: spaceMatch[1].trim(), email: spaceMatch[2].trim() };
  }

  // Fallback: try to extract any email
  const anyEmailMatch = fromString.match(/([\w.+-]+@[\w.-]+\.[a-zA-Z]{2,})/);
  if (anyEmailMatch) {
    const email = anyEmailMatch[1];
    const name = fromString.replace(email, '').trim();
    return name ? { name, email } : { email };
  }

  // Last fallback
  return { email: 'noreply@example.com', name: 'Porsche 911 Dream' };
}

/**
 * Send verification email with 4-digit code using SendGrid
 * Subject: "Your verification code"
 * Body: "Your 4-digit verification code is: XXXX"
 */
export async function sendVerificationEmail(toEmail, code) {
  try {
    if (!initSendGrid()) {
      throw new Error('SendGrid not configured');
    }

    // Parse the from email from environment variable
    const fromRaw = process.env.EMAIL_FROM;
    const from = parseFromEmail(fromRaw);
    
    console.log('Sending email from:', from);
    console.log('Sending email to:', toEmail);

    const msg = {
      to: toEmail,
      from: from, // SendGrid accepts { email: string, name?: string }
      subject: 'Your verification code',
      text: `Your 4-digit verification code is: ${code}`,
      html: `<p>Your 4-digit verification code is: <strong>${code}</strong></p>`,
    };

    await sgMail.send(msg);
    console.log(`Verification email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    if (error.response) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body, null, 2));
    }
    throw error;
  }
}
