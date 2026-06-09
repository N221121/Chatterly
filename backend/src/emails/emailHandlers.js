import { resendClient, sender } from "../lib/resend.js";
import { welcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (
  email,
  name,
  clientURL
) => {
  try {
    const { data, error } =
      await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Connectify 🚀",
        html: welcomeEmailTemplate(
          name,
          clientURL
        ),
      });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(
        "FULL RESEND ERROR:",
        JSON.stringify(error, null, 2)
      );

      return;
    }

    console.log(
      "Welcome email sent successfully"
    );

  } catch (err) {
    console.error(
      "ACTUAL ERROR:",
      err
    );
  }
};