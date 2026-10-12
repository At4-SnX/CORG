import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;

// ─── Vérification des variables obligatoires ───────────────────────────────
const required = ['DISCORD_TOKEN', 'GUILD_ID', 'NIGEND_PREFIX', 'FORUM_APPEL17_ID', 'ROLE_GENDARMERIE_ID', 'FORUM_IGGN_ID'];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  console.error(`[CONFIG] Variables manquantes : ${missing.join(', ')}`);
  process.exit(1);
}
if (!/^\d{2}$/.test(env.NIGEND_PREFIX)) {
  console.error('[CONFIG] NIGEND_PREFIX doit contenir exactement 2 chiffres (ex: 17).');
  process.exit(1);
}

// ─── Configuration technique (variables Railway) ───────────────────────────
export const config = {
  token: env.DISCORD_TOKEN,
  guildId: env.GUILD_ID,
  nigendPrefix: env.NIGEND_PREFIX,
  dataDir: path.resolve(root, env.DATA_DIR || './data'),
  roles: {
    gendarmerie: env.ROLE_GENDARMERIE_ID,
    iggn: env.ROLE_IGGN_ID || null,
    identifie: env.ROLE_IDENTIFIE_ID || null,
  },
  forums: {
    appel17: env.FORUM_APPEL17_ID,
    iggn: env.FORUM_IGGN_ID,
  },
};

// ─── Personnalisation (textes, couleurs, motifs) : modifiable librement ────
export const theme = {
  color: 0x1f3a93, // Bleu Gendarmerie (accent des composants)
  footer: 'Gendarmerie Nationale',
};

export const stream = {
  name: 'Gendarmerie Nationale',
  url: env.STREAM_URL || 'https://www.twitch.tv/gendarmerienationale',
};

export const assets = {
  appel17: { file: path.join(root, 'assets', 'appel17.png'), name: 'appel17.png' },
  iggn: { file: path.join(root, 'assets', 'iggn.png'), name: 'iggn.png' },
  identification: { file: path.join(root, 'assets', 'identification.png'), name: 'identification.png' },
};

// Emojis personnalisés (le bot doit être sur le serveur qui les héberge).
// Format : <:nom:ID>  — remplacez les IDs par ceux de votre serveur si besoin.
export const emojis = {
  exc: '<:exc:1541213944364924999>',
  fleche: '<:fleche:1541035911976853535>',
  engrenage: '<:engrenage:1541036952462032916>',
};

const { fleche, engrenage } = emojis;

// Style : titre en ###, gras + souligné, citations avec flèche, puces engrenage.
export const texts = {
  appel17: {
    title: ' APPEL 17 — CORG',
    description:
      `> ${fleche} Le __**Centre d'Opérations et de Renseignement de la Gendarmerie**__ est joignable en permanence au **__17__**.\n\n` +
      `${engrenage} Vous êtes **__témoin ou victime__** d'un fait nécessitant l'intervention de la **__Gendarmerie Nationale__** ? ` +
      `Cliquez sur le bouton ci-dessous et exposez votre situation à l'**__opérateur du CORG__**.\n\n` +
      `> ${fleche} Tout **__appel abusif ou fantaisiste__** sera sanctionné.`,
    button: 'Appeler le 17',
  },
  iggn: {
    title: ' INSPECTION GÉNÉRALE DE LA GENDARMERIE NATIONALE',
    description:
      `> ${fleche} L'**__IGGN__** est chargée de **__contrôler le comportement des militaires__** de la Gendarmerie Nationale.\n\n` +
      `${engrenage} Vous souhaitez signaler un **__manquement__** ou un **__abus__** ? ` +
      `Déposez votre plainte via le bouton ci-dessous : elle sera **__transmise à l'IGGN__** pour examen.\n\n` +
      `> ${fleche} Toute **__dénonciation mensongère__** pourra faire l'objet de sanctions.`,
    button: 'Déposer une plainte',
  },
  identification: {
    title: ' IDENTIFICATION',
    description:
      `> ${fleche} Tout militaire de la **__Gendarmerie Nationale__** doit s'enregistrer afin d'obtenir son **__NIGEND__**.\n\n` +
      `${engrenage} Cliquez sur le bouton ci-dessous et renseignez votre **__nom et prénom RP__**. ` +
      `Votre **__pseudo sera modifié automatiquement__** avec votre identité de service.\n\n` +
      `> ${fleche} Les informations saisies doivent être **__exactes et cohérentes__**.`,
    button: 'S\'identifier',
  },
};

// Motifs de plainte IGGN (max 25). Ajoutez / retirez des lignes à volonté.
export const iggnMotifs = [
  { label: 'Abus d\'autorité', description: 'Usage excessif ou injustifié des pouvoirs' },
  { label: 'Violences / usage abusif de la force', description: 'Force disproportionnée lors d\'une intervention' },
  { label: 'Comportement irrespectueux', description: 'Insultes, provocation, manque de professionnalisme' },
  { label: 'Corruption / avantages indus', description: 'Faveurs, pots-de-vin, favoritisme' },
  { label: 'Refus de prise de plainte', description: 'Plainte refusée ou ignorée sans motif' },
  { label: 'Abus de service / matériel', description: 'Mauvaise utilisation des moyens de service' },
  { label: 'Fausse déclaration / faux rapport', description: 'Procès-verbal ou rapport mensonger' },
  { label: 'Autre', description: 'Tout autre manquement' },
];
