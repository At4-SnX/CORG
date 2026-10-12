import { config, texts } from '../config.js';
import { MessageFlags } from 'discord.js';
import { asEdit, buildNotice, buildPanel } from '../ui.js';
import { capitalize, field, generateNigend, modal } from '../utils.js';
import * as store from '../store.js';

export const buildIdentificationPanel = () => buildPanel('identification', texts.identification, 'identification:open');

// Lettres (accents inclus), espaces, tirets, apostrophes
const NAME_REGEX = /^[\p{L}][\p{L}' -]*$/u;
const NICKNAME_MAX = 32;

/** Format du pseudo : {Initiale prénom} {Nom} 「{NIGEND}」 */
export function formatNickname(prenom, nom, nigend) {
  const suffix = ` 「${nigend}」`;
  const initiale = prenom.trim().charAt(0).toUpperCase();
  const base = `${initiale} `;
  const nomMax = NICKNAME_MAX - base.length - suffix.length;
  return `${base}${capitalize(nom).slice(0, nomMax)}${suffix}`;
}

export async function handleIdentification(interaction) {
  // 1) Clic sur le bouton -> formulaire (ou rappel du NIGEND existant)
  if (interaction.isButton() && interaction.customId === 'identification:open') {
    const existing = store.getByUser(interaction.user.id);
    if (existing) {
      await interaction.reply(buildNotice('Déjà identifié', `Vous êtes déjà enregistré sous le NIGEND **${existing.nigend}**.`));
      return true;
    }
    await interaction.showModal(
      modal('identification:submit', 'Identification', [
        field({ id: 'prenom', label: 'Prénom RP', max: 30 }),
        field({ id: 'nom', label: 'Nom RP', max: 30 }),
      ]),
    );
    return true;
  }

  // 2) Envoi -> NIGEND + renommage
  if (interaction.isModalSubmit() && interaction.customId === 'identification:submit') {
    const prenom = interaction.fields.getTextInputValue('prenom').trim();
    const nom = interaction.fields.getTextInputValue('nom').trim();

    if (!NAME_REGEX.test(prenom) || !NAME_REGEX.test(nom)) {
      await interaction.reply(buildNotice('Identité invalide', 'Le nom et le prénom ne doivent contenir que des lettres, espaces, tirets ou apostrophes.'));
      return true;
    }
    if (store.getByUser(interaction.user.id)) {
      await interaction.reply(buildNotice('Déjà identifié', 'Vous possédez déjà un NIGEND.'));
      return true;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const nigend = generateNigend(config.nigendPrefix, store.isTaken);
    const nickname = formatNickname(prenom, nom, nigend);

    try {
      await interaction.member.setNickname(nickname, 'Identification NIGEND');
    } catch {
      await interaction.editReply(
        asEdit(buildNotice('Erreur', 'Impossible de modifier votre pseudo (permissions ou rôle supérieur à celui du bot). Contactez un responsable.')),
      );
      return true;
    }

    store.register(interaction.user.id, { nigend, prenom, nom });

    if (config.roles.identifie) {
      await interaction.member.roles.add(config.roles.identifie).catch(() => null);
    }

    await interaction.editReply(
      asEdit(buildNotice('Identification validée', `Bienvenue, **${nickname}**.\nVotre NIGEND est le **${nigend}**.`)),
    );
    return true;
  }
  return false;
}
