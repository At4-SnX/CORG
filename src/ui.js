import {
  AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder,
  MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder,
} from 'discord.js';
import { assets, emojis, theme } from './config.js';

/** Flag à passer pour tout message en Components V2. */
export const V2 = MessageFlags.IsComponentsV2;
export const V2_EPHEMERAL = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral;

const text = (content) => new TextDisplayBuilder().setContent(content);
const divider = () => new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small);

/**
 * Panneau interactif : bannière + titre + description + bouton.
 * @param {'appel17'|'iggn'|'identification'} key  clé dans config.assets / config.texts
 */
export function buildPanel(key, content, customId) {
  const asset = assets[key];

  const container = new ContainerBuilder()
    .setAccentColor(theme.color)
    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(`attachment://${asset.name}`)),
    )
    .addTextDisplayComponents(text(`### ${emojis.exc}**__${content.title}__**\n${content.description}`))
    .addSeparatorComponents(divider())
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(customId).setLabel(content.button).setStyle(ButtonStyle.Primary),
      ),
    );

  return {
    components: [container],
    files: [new AttachmentBuilder(asset.file, { name: asset.name })],
    flags: V2,
  };
}

/**
 * Fiche d'information (post de forum, confirmation…).
 * @param {string} title
 * @param {Array<[string,string]>} fields  paires [libellé, valeur]
 */
export function buildCard(title, fields, footer = theme.footer) {
  const body = fields.map(([k, v]) => `**${k}**\n${v || '—'}`).join('\n\n');
  return new ContainerBuilder()
    .setAccentColor(theme.color)
    .addTextDisplayComponents(text(`## ${title}`))
    .addSeparatorComponents(divider())
    .addTextDisplayComponents(text(body))
    .addSeparatorComponents(divider())
    .addTextDisplayComponents(text(`-# ${footer}`));
}

/** Message simple (réponses éphémères). */
export function buildNotice(title, message) {
  const container = new ContainerBuilder()
    .setAccentColor(theme.color)
    .addTextDisplayComponents(text(`### ${title}\n${message}`));
  return { components: [container], flags: V2_EPHEMERAL };
}

/** Adapte un message (reply) pour editReply : pas de flag éphémère, V2 conservé. */
export const asEdit = (payload) => ({ components: payload.components, flags: V2 });
