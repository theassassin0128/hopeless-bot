const {
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓Replies with an embed containing information.")
        .setDMPermission(true),
    category: "misc",
    usage: "/ping",
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        const apiPing = ((interaction.createdAt - Date.now()) / 2).toFixed(0);
        const wsPing = (client.ws.ping / 2).toFixed(0);
        try {
            await interaction.deferReply({});

            const days = Math.floor(client.uptime / 86400000);
            const hours = Math.floor(client.uptime / 3600000) % 24;
            const minutes = Math.floor(client.uptime / 60000) % 60;
            const seconds = Math.floor(client.uptime / 1000) % 60;

            const totalPing = wsPing + apiPing;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTitle("MY RUNTIME STATS")
                .setColor(
                    totalPing <= 400
                        ? client.colors.good
                        : totalPing <= 800
                        ? client.colors.standBy
                        : client.colors.wrong
                )
                .setThumbnail(client.user.displayAvatarURL())
                .addFields([
                    {
                        name: `📡 WS Ping`,
                        value: `\`\`\`yml\n${
                            wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
                        } ${wsPing}ms\`\`\``,
                        inline: true,
                    },
                    {
                        name: `🛰 API Ping`,
                        value: `\`\`\`yml\n${
                            apiPing <= 200 ? "🟢" : apiPing <= 400 ? "🟡" : "🔴"
                        } ${apiPing}ms\`\`\``,
                        inline: true,
                    },
                    {
                        name: `⏲ Uptime`,
                        value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\`\`\``,
                        inline: false,
                    },
                ])
                .setFooter({
                    text: `Powered by ${client.user.username}`,
                });
            return interaction.editReply({
                embeds: [embed],
            });
        } catch (error) {
            throw error;
        }
    },
};