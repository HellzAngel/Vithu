const sendEmail = async (options) => {
  // Use console logging if no API Key is provided
  if (!process.env.EMAIL_PASS || !process.env.EMAIL_PASS.startsWith('re_')) {
    console.log("-----------------------------------------");
    console.log(`[TEST MODE] To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log("-----------------------------------------");
    return;
  }

  console.log(`🚀 Sending email via Resend API to ${options.email}...`);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_PASS}`
      },
      body: JSON.stringify({
        from: 'വിത്ത് <onboarding@resend.dev>',
        to: options.email,
        subject: options.subject,
        text: options.message
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ Email sent successfully via API:', data.id);
    } else {
      console.error('❌ Resend API Error:', data);
    }
  } catch (error) {
    console.error('❌ Failed to connect to Resend API:', error.message);
  }
};

module.exports = sendEmail;
