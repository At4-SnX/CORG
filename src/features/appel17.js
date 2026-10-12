import { config, texts } from '../config.js';
import { MessageFlags } from 'discord.js';
import { asEdit, buildCard, buildNotice, buildPanel, V2 } from '../ui.js';
import { field, fetchForum, modal, truncate, TextInputStyle } from '../utils.js';

export const buildAppel17Panel = () => buildPanel('appel17', texts.appel17, 'appel17:open');

export async function handleAppel17(interaction) {
  // 1) Clic sur le bouton -> formulaire
  if (interaction.isButton() && interaction.customId === 'appel17:open') {
    await interaction.showModal(
      modal('appel17:submit', 'Appel 17 — CORG', [
        field({ id: 'nom', label: 'Votre nom et prénom RP', max: 60 }),
        field({ id: 'lieu', label: 'Lieu de l\'incident', max: 100, placeholder: 'Ex : Rue de la République, devant la banque' }),
        field({ id: 'nature', label: 'Nature de l\'urgence', max: 80, placeholder: 'Ex : Cambriolage en cours, accident, agression…' }),
        field({ id: 'details', label: 'Description de la situation', style: TextInputStyle.Paragraph, max: 1000 }),
      ]),
    );
    return true;
  }

  // 2) Envoi du formulaire -> post dans le forum + ping en dessous
  if (interaction.isModalSubmit() && interaction.customId === 'appel17:submit') {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const nom = interaction.fields.getTextInputValue('nom');
    const lieu = interaction.fields.getTextInputValue('lieu');
    const nature = interaction.fields.getTextInputValue('nature');
    const details = interaction.fields.getTextInputValue('details');

    const forum = await fetchForum(interaction.guild, config.forums.appel17);

    const thread = await forum.threads.create({
      name: truncate(`Appel 17 • ${nature} • ${lieu}`, 100),
      message: {
        components: [
          buildCard('APPEL 17 — CORG', [
            ['Appelant', `${nom} (<@${interaction.user.id}>)`],
            ['Lieu', lieu],
            ['Nature', nature],
            ['Description', details],
            ['Reçu le', `<t:${Math.floor(Date.now() / 1000)}:F>`],
          ]),
        ],
        flags: V2,
      },
    });

    // Le ping est envoyé dans un second message, sous le composant V2
    await thread.send({
      content: `<@&${config.roles.gendarmerie}>`,
      allowedMentions: { roles: [config.roles.gendarmerie] },
    });

    await interaction.editReply(
      asEdit(buildNotice('Appel transmis', `Votre appel a bien été reçu par le CORG.\nUne patrouille va être dépêchée : ${thread}`)),
    );
    return true;
  }
  return false;
}
