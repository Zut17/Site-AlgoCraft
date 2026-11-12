// ═══════════════════════════════════════════════════════════════════════
//  Réglages du site AlgoCraft — à compléter avant la mise en ligne
// ═══════════════════════════════════════════════════════════════════════
window.ALGOCRAFT_CONFIG = {
  // Numéro WhatsApp qui reçoit les messages du formulaire de contact.
  // Format international, chiffres seuls, sans « + » ni espaces : ex. Cameroun 2376XXXXXXXX, France 337XXXXXXXX.
  // S'il est rempli, le formulaire ouvre WhatsApp avec le message déjà rédigé (prioritaire sur le reste).
  WHATSAPP_NUMERO: "237650310354",

  // Adresse (URL) du service qui reçoit le formulaire de contact — pas une adresse e-mail seule.
  // FormSubmit : https://formsubmit.co/ajax/votre-adresse — au premier message envoyé, FormSubmit écrit
  // à cette adresse pour confirmer : cliquez sur le lien d'activation, sinon rien n'est transmis.
  // Formspree : https://formspree.io/f/xxxxxxx
  // Laisser vide : le formulaire ouvre la messagerie du visiteur vers CONTACT_EMAIL.
  FORMULAIRE_ENDPOINT: "https://formsubmit.co/ajax/zuteuhenrywilliam@gmail.com",

  // Adresse e-mail de l'équipe (utilisée si FORMULAIRE_ENDPOINT est vide).
  CONTACT_EMAIL: "zuteuhenrywilliam@gmail.com",

  // Lien de téléchargement de l'installateur. Il pointe vers la dernière « Release » GitHub :
  // publiez une nouvelle Release avec un fichier nommé exactement Setup_AlgoCraft.exe et le lien suit tout seul.
  LIEN_TELECHARGEMENT: "https://github.com/Zut17/AlgoCraft/releases/latest/download/Setup_AlgoCraft.exe"
};
