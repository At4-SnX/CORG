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

export const texts = {
  appel17: {
    title: 'CENTRE D\'OPÉRATIONS ET DE RENSEIGNEMENT',
    description:
      'Vous êtes **__témoin ou victime__** d\'un fait nécessitant **__l\'intervention de la Gendarmerie__** ?\n' +
      'Composez le__ **17** __en cliquant sur le bouton ci-dessous et **__exposez votre situation à l\'opérateur du CORG.__**\n\n' +
     '-# <:fleche:1541035911976853535> Article 222-16. Les **__appels téléphoniques malveillants réitérés__**, les **__envois réitérés de messages malveillants__** émis par la voie des **__communications électroniques__** ou les **__agressions sonores__** en vue de **__troubler la tranquillité__** d’autrui sont punis d’**__un an d’emprisonnement et de 4 000 euros d’amende__**.',
  iggn: {
    title: 'INSPECTION GÉNÉRALE DE LA GENDARMERIE NATIONALE',
    description:
      'Vous souhaitez signaler le comportement d\'un militaire de la Gendarmerie Nationale ?\n' +
      'Déposez votre plainte via le bouton ci-dessous. Elle sera transmise à l\'IGGN pour examen.\n\n' +
      '> Toute dénonciation mensongère pourra faire l\'objet de sanctions.',
    button: 'Déposer une plainte',
  },
  identification: {
    title: 'IDENTIFICATION',
    description:
      'Nouveau militaire ? Enregistrez-vous afin d\'obtenir votre **NIGEND** et votre identité de service.\n' +
      'Vous devrez renseigner votre **nom et prénom RP**. Votre pseudo sera modifié automatiquement.',
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
