

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const sendVerificationEmail = async (
    reciever,
    subject = "Confirm Registraion",
    userName = "anoymnous",
  html,
    text=""
) => {

  
  try {
    const response = await resend.emails.send({
      from: "Ahsan Hafeez <ahsanhafeez883@gmail.com>",
      to: [reciever],
      subject: reciever,
      html: html,
      text:text
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const as = () => {
  
}
export { sendVerificationEmail };
