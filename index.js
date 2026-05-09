require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {

    console.log(`Online: ${client.user.tag}`);

    const guild = client.guilds.cache.first();

    await guild.commands.create({
        name: 'painel',
        description: 'Painel militar'
    });

    await guild.commands.create({
        name: 'ticket',
        description: 'Sistema ticket'
    });

});

client.on('guildMemberAdd', member => {

    const canal = member.guild.channels.cache.find(
        c => c.name === '👋┃bem-vindo'
    );

    if (!canal) return;

    const embed = new EmbedBuilder()
        .setTitle('🎖️ Bem-vindo ao Exército')
        .setDescription(`
Leia os canais básicos para começar.

📘 Como entrar:
• Leia as regras
• Abra ticket
• Faça treinamento
• Veja a hierarquia

🎖️ Hierarquia:
Recruta
Soldado
Cabo
Sargento
Tenente
Capitão
Major
        `)
        .setColor('DarkBlue');

    canal.send({
        content: `${member}`,
        embeds: [embed]
    });

});

client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'painel') {

            const embed = new EmbedBuilder()
                .setTitle('🎖️ Painel Militar')
                .setDescription(`
Bem-vindo ao sistema militar.

📘 Informações:
• Regras
• Treinamentos
• Hierarquia
• Recrutamento
                `)
                .setColor('Blue');

            await interaction.reply({
                embeds: [embed]
            });

        }

        if (interaction.commandName === 'ticket') {

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('abrir_ticket')
                        .setLabel('🎫 Abrir Ticket')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.reply({
                content: 'Clique abaixo.',
                components: [row]
            });

        }

    }

    if (interaction.isButton()) {

        if (interaction.customId === 'abrir_ticket') {

            const canal = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                        ]
                    }
                ]
            });

            canal.send(`
🎫 Ticket criado.

Explique seu recrutamento.
            `);

            await interaction.reply({
                content: `Ticket criado: ${canal}`,
                ephemeral: true
            });

        }

    }

});

client.login(process.env.TOKEN);
