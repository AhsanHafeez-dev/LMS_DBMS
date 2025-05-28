import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


const sendVerificationEmail = async (
  reciever,
  subject = "Confirm Registraion",
    userName = "anoymnous",
    emailType = "register",
    courseName = "abc",
  amount=300
) => {
    let html = "";
    const registrationEmailHTML = `
<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
  <h2 style='color: #2d89ef;'>Welcome to Duet Learn!</h2>
  <p>Hi ${userName},</p>
  <p>Thank you for registering with us. We're excited to have you onboard!</p>
  <p>You can now explore our courses, track your progress, and grow your skills.</p>
  <p>If you have any questions, feel free to reach out to our support team.</p>
  <p>Happy learning!</p>
  <br>
  <p>– The Duet Learn Team</p>
</div>
`;
    
const paymentConfirmationEmailHTML = `
<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
  <h2 style='color: #28a745;'>Payment Successful – Thank You!</h2>
  <p>Hi ${userName},</p>
  <p>Thank you for enrolling in <strong>${courseName}</strong>.</p>
  <p>Your payment of <strong>${amount}</strong> has been successfully received.</p>
  <p>You can now access your course materials anytime from your dashboard.</p>
  <p>We wish you the best in your learning journey!</p>
  <br>
  <p>– The Duet Learning Team</p>
</div>
`;

    if (emailType == 'registration') { html = registrationEmailHTML; }
    else { html = paymentConfirmationEmailHTML; }
    console.log("sending email to : ", reciever," with subject : ",subject);

  await resend.emails.send({
    from: "ahsanhafeez883@gmail.com",
    to: reciever,
    subject: subject,
    html: html,
  });
    console.log("return from resend");
  return;
};
export { sendVerificationEmail };
