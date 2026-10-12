import { randomInt } from 'node:crypto';
import { ActionRowBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const truncate = (str, max) => (str.length > max ? `${str.slice(0, max - 1)}…` : str);

/** "dUPONT" -> "Dupont" (première lettre en majuscule, le reste en minuscule) */
export const capitalize = (str) => {
  const s = str.trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Génère un NIGEND de 6 chiffres commençant par le préfixe (2 chiffres). */
export function generateNigend(prefix, isTaken) {
  for (let i = 0; i < 20000; i++) {
    const nigend = `${prefix}${String(randomInt(0, 10000)).padStart(4, '0')}`;
    if (!isTaken(nigend)) return nigend;
  }
  throw new Error('Plus aucun NIGEND disponible pour ce préfixe.');
}

/** Raccourci pour créer un champ de modal. */
export function field({ id, label, style = TextInputStyle.Short, required = true, min, max, placeholder }) {
  const input = new TextInputBuilder().setCustomId(id).setLabel(label).setStyle(style).setRequired(required);
  if (min) input.setMinLength(min);
  if (max) input.setMaxLength(max);
  if (placeholder) input.setPlaceholder(placeholder);
  return new ActionRowBuilder().addComponents(input);
}

export const modal = (customId, title, rows) => new ModalBuilder().setCustomId(customId).setTitle(title).addComponents(...rows);

export async function fetchForum(guild, id) {
  const channel = await guild.channels.fetch(id).catch(() => null);
  if (!channel || channel.type !== ChannelType.GuildForum) {
    throw new Error(`Le salon ${id} est introuvable ou n'est pas un forum.`);
  }
  return channel;
}

export { TextInputStyle };
