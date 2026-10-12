import { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } from 'discord.js';
import { config, iggnMotifs, texts } from '../config.js';
import { asEdit, buildCard, buildNotice, buildPanel, V2 } from '../ui.js';
import { field, fetchForum, modal, truncate, TextInputStyle } from '../utils.js';

export const buildIggnPanel = () => buildPanel('iggn', texts.iggn, 'iggn:open');

export async function handleIggn(interaction) {
  // 1) Clic sur le bouton -> choix du motif
  if (interaction.isButton() && interaction.customId === 'iggn:open') {
    const select = new StringSelectMenuBuilder()
      .setCustomId('iggn:motif')
      .setPlaceholder('Sélectionnez le motif de la plainte')
      .addOptions(iggnMotifs.map((m, i) => ({ label: m.label, description: m.description, value: String(i) })));

    await interaction.reply({
      content: '**IGGN** — Sélectionnez le motif de votre plainte :',
      components: [new ActionRowBuilder().addComponents(select)],
      flags: MessageFlags.Ephemeral,
    });
    return true;
  }

  // 2) Motif choisi -> formulaire
  if (interaction.isStringSelectMenu() && interaction.customId === 'iggn:motif') {
    const index = interaction.values[0];
    await interaction.showModal(
      modal(`iggn:submit:${index}`, 'Plainte — IGGN', [
        field({ id: 'gendarme', label: 'Gendarme visé (nom RP / NIGEND)', max: 80 }),
        field({ id: 'date', label: 'Date et lieu des faits', max: 100 }),
        field({ id: 'faits', label: 'Description des faits', style: TextInputStyle.Paragraph, max: 1000 }),
        field({ id: 'preuves', label: 'Preuves (liens, captures…)', style: TextInputStyle.Paragraph, required: false, max: 500 }),
      ]),
    );
    return true;
  }

  // 3) Envoi -> post dans le forum IGGN
  if (interaction.isModalSubmit() && interaction.customId.startsWith('iggn:submit:')) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const motif = iggnMotifs[Number(interaction.customId.split(':')[2])]?.label ?? 'Autre';
    const gendarme = interaction.fields.getTextInputValue('gendarme');
    const date = interaction.fields.getTextInputValue('date');
    const faits = interaction.fields.getTextInputValue('faits');
    const preuves = interaction.fields.getTextInputValue('preuves');

    const forum = await fetchForum(interaction.guild, config.forums.iggn);

    const thread = await forum.threads.create({
      name: truncate(`IGGN • ${motif} • ${gendarme}`, 100),
      message: {
        components: [
          buildCard('PLAINTE — IGGN', [
            ['Plaignant', `<@${interaction.user.id}>`],
            ['Gendarme visé', gendarme],
            ['Motif', motif],
            ['Date et lieu des faits', date],
            ['Description des faits', faits],
            ['Preuves', preuves],
            ['Déposée le', `<t:${Math.floor(Date.now() / 1000)}:F>`],
          ]),
        ],
        flags: V2,
      },
    });

    if (config.roles.iggn) {
      await thread.send({
        content: `<@&${config.roles.iggn}>`,
        allowedMentions: { roles: [config.roles.iggn] },
      });
    }

    await interaction.editReply(
      asEdit(buildNotice('Plainte enregistrée', 'Votre plainte a été transmise à l\'Inspection Générale de la Gendarmerie Nationale.')),
    );
    return true;
  }
  return false;
}
