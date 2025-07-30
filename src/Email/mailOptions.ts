import config from "../config";

const mailOptions = (payload: any) => {
  return {
    from: `"Portfolio Contact" <${config.email.user}>`,
    to: config.email.user,          
    replyTo: payload.email,
    subject: `📩 New Inquiry from ${payload.name} via Portfolio Contact Form`,
    text: `
      You have received a new contact message via your portfolio website.

      Details:
      -------------------------
      Name   : ${payload.name}
      Email  : ${payload.email}

      Message:
      ${payload.message}
      -------------------------
    `,
    html: `
      <p>You have received a new contact message via your portfolio website.</p>
      <h3>Details:</h3>
      <hr />
      <p>👤 <strong>Name:</strong> ${payload.name}</p>
      <p>📧 <strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
      <p>💬 <strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br>")}</p>
      <hr />
    `,
  };
};

export default mailOptions;