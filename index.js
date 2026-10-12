import {
  ActivityType, Client, Events, GatewayIntentBits, MessageFlags,
  PermissionFlagsBits, SlashCommandBuilder,
} from 'discord.js';
import { config, stream } from './src/config.js';
import { asEdit, buildNotice } from './src/ui.js';
import { buildAppel17Panel, handleAppel17 } from './src/features/appel17.js';
import { buildIggnPanel, handleIggn } from './src/features/iggn.js';
import { buildIdentificationPanel, handleIdentification } from './src/features/identification.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const panels = {
  appel17: buildAppel17Panel,
  iggn: buildIggnPanel,
  identification: buildIdentificationPanel,
};

const setupCommand = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Envoie les panneaux CORG / IGGN / Identification dans ce salon')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((o) =>
    o.setName('panneau')
      .setDescription('Panneau à envoyer (tous par défaut)')
      .addChoices(
        { name: 'Appel 17', value: 'appel17' },
        { name: 'IGGN', value: 'iggn' },
        { name: 'Identification', value: 'identification' },
      ),
  );

client.once(Events.ClientReady, async (c) => {
  // Statut : en stream « Gendarmerie Nationale »
  c.user.setPresence({
    status: 'online',
    activities: [{ name: stream.name, type: ActivityType.Streaming, url: stream.url }],
  });

  const guild = await c.guilds.fetch(config.guildId);
  await guild.commands.set([setupCommand.toJSON()]);
  console.log(`[BOT] Connecté en tant que ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === 'setup') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const choice = interaction.options.getString('panneau');
      const keys = choice ? [choice] : Object.keys(panels);
      for (const key of keys) await interaction.channel.send(panels[key]());
      await interaction.editReply('Panneau(x) envoyé(s).');
      return;
    }

    for (const handler of [handleAppel17, handleIggn, handleIdentification]) {
      if (await handler(interaction)) return;
    }
  } catch (err) {
    console.error('[ERREUR]', err);
    const payload = buildNotice('Erreur', 'Une erreur est survenue. Merci de réessayer ou de contacter un responsable.');
    if (interaction.deferred || interaction.replied) await interaction.editReply(asEdit(payload)).catch(() => null);
    else await interaction.reply(payload).catch(() => null);
  }
});

client.login(config.token);
