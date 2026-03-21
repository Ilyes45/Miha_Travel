const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReservationNotif = async (reservation) => {
  const nom    = reservation.voyage?.title || reservation.hotel?.nom || "N/A";
  const client = reservation.user?.nom     || "Client inconnu";
  const email  = reservation.user?.email   || "N/A";
  const type   = reservation.voyage        ? "Voyage" : "Hôtel";
  const date   = new Date(reservation.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

      <div style="background: linear-gradient(135deg, #cc0000, #8b0000); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 1.5rem;">Miha Travel</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Nouvelle réservation reçue</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #f0f0f0;">
        <h2 style="color: #1a2535; margin-top: 0;">Nouvelle réservation !</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem; width: 40%;">Client</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${client}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Email client</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Type</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${type}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">${type}</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${nom}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Prix total</td>
            <td style="padding: 12px 0; font-weight: 700; color: #cc0000;">${reservation.prixTotal} DT</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Date</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${date}</td>
          </tr>
        </table>

        <div style="margin-top: 28px; text-align: center;">
          <a href="${process.env.CLIENT_URL}/admin"
             style="background: #cc0000; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.95rem;">
            Voir dans l'admin
          </a>
        </div>
      </div>

      <div style="background: #f9fafb; padding: 16px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0; border-top: none;">
        <p style="color: #aab0c0; font-size: 0.8rem; margin: 0;">Miha Travel Agency — 32 Rue Mongi Slim, Gabès, Tunisie</p>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from:    `"Miha Travel" <${process.env.EMAIL_USER}>`,
    to:      process.env.ADMIN_EMAIL,
    subject: `Nouvelle réservation — ${client} — ${nom}`,
    html,
  });
};
const sendReponseContact = async ({ nom, email, messageOriginal, reponse }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #cc0000, #8b0000); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 1.5rem;">Miha Travel</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Réponse à votre message</p>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #f0f0f0;">
        <h2 style="color: #1a2535; margin-top: 0;">Bonjour ${nom},</h2>
        <p style="color: #6b7a99; font-size: 0.9rem;">Merci de nous avoir contactés. Voici notre réponse à votre message :</p>
        
        <div style="background: #f9fafb; border-left: 3px solid #e8ecf4; padding: 14px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #aab0c0; font-size: 0.78rem; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 1px;">Votre message</p>
          <p style="color: #6b7a99; font-size: 0.88rem; margin: 0; line-height: 1.6;">${messageOriginal}</p>
        </div>

        <div style="background: #fff5f5; border-left: 3px solid #cc0000; padding: 14px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #cc0000; font-size: 0.78rem; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 1px;">Notre réponse</p>
          <p style="color: #1a2535; font-size: 0.92rem; margin: 0; line-height: 1.6;">${reponse}</p>
        </div>

        <p style="color: #6b7a99; font-size: 0.88rem; margin-top: 24px;">
          Pour toute question supplémentaire, n'hésitez pas à nous recontacter.<br/>
          <strong style="color: #1a2535;">L'équipe Miha Travel</strong>
        </p>
      </div>
      <div style="background: #f9fafb; padding: 16px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0; border-top: none;">
        <p style="color: #aab0c0; font-size: 0.8rem; margin: 0;">Miha Travel Agency — 32 Rue Mongi Slim, Gabès, Tunisie</p>
        <p style="color: #aab0c0; font-size: 0.8rem; margin: 4px 0 0;">+216 57 093 791 · contact@mihatravel.com</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"Miha Travel" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `Réponse à votre message — Miha Travel`,
    html,
  });
};
const sendContactMessage = async ({ nom, email, telephone, message }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #cc0000, #8b0000); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 1.5rem;">Miha Travel</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Nouveau message de contact</p>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #f0f0f0;">
        <h2 style="color: #1a2535; margin-top: 0;">Nouveau message !</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem; width: 40%;">Nom</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${nom}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Email</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Téléphone</td>
            <td style="padding: 12px 0; font-weight: 700; color: #1a2535;">${telephone || "Non renseigné"}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #6b7a99; font-size: 0.9rem;">Message</td>
            <td style="padding: 12px 0; color: #1a2535; line-height: 1.6;">${message}</td>
          </tr>
        </table>
        <div style="margin-top: 28px; text-align: center;">
          <a href="${process.env.CLIENT_URL}/admin"
             style="background: #cc0000; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700;">
            Voir dans l'admin
          </a>
        </div>
      </div>
      <div style="background: #f9fafb; padding: 16px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #f0f0f0; border-top: none;">
        <p style="color: #aab0c0; font-size: 0.8rem; margin: 0;">Miha Travel Agency — 32 Rue Mongi Slim, Gabès, Tunisie</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"Miha Travel" <${process.env.EMAIL_USER}>`,
    to:      process.env.ADMIN_EMAIL,
    subject: `Nouveau message de ${nom}`,
    html,
  });
};

module.exports = { sendReservationNotif, sendContactMessage, sendReponseContact };
