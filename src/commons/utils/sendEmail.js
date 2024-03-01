//* LIB
const nodeMailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

//* IMPORT
const {
  gmail: { port, host, service, mail, password },
} = require("../../commons/configs/gmail.config");

const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host,
      port,
      secure: true,
      service,
      auth: {
        user: mail,
        pass: password,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".html",
        partialsDir: path.resolve("./src/views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./src/views"),
      extName: ".html",
    };

    transporter.use("compile", hbs(handlebarOptions));

    const mailOptions = {
      from: mail,
      to: options.to,
      subject: options.subject,
      attachments: options.attachments,
      template: options.template,
      context: options.context,
      html: options.html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
