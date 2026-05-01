const sendEmail = async (options) => {
  // Use console logging if no API Key is provided
  if (!process.env.EMAIL_PASS || !process.env.EMAIL_PASS.startsWith('xkeysib-')) {
    console.log("-----------------------------------------");
    console.log(`[TEST MODE] To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log("-----------------------------------------");
    return;
  }

  console.log(`🚀 Sending email via Brevo API to ${options.email}...`);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.EMAIL_PASS
      },
      body: JSON.stringify({
        sender: { 
          name: 'വിത്ത് (Vithu)', 
          email: 'vithu.market@gmail.com' 
        },
        to: [{ email: options.email }],
        subject: options.subject,
        textContent: options.message
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ Email sent successfully via Brevo:', data.messageId);
    } else {
      console.error('❌ Brevo API Error:', data);
    }
  } catch (error) {
    console.error('❌ Failed to connect to Brevo API:', error.message);
  }
};

module.exports = sendEmail;
