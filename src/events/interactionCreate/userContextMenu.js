const { UserContextMenuCommandInteraction, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,
    rest: false,
    /**
     *
     * @param {Client} client
     * @param {UserContextMenuCommandInteraction} interaction
     * @returns
     */
    async execute(client, interaction) {
        if (!interaction.isUserContextMenuCommand()) return;

        try {
            const command = await client.commands.get(interaction.commandName);

            if (!command) {
                return interaction.reply({
                    content: "This command isn't available.",
                    ephemeral: true,
                });
            }

            if (command.toggleOff) {
                return interaction.reply({
                    content: "This command isn't available right now.",
                    ephemeral: true,
                });
            }

            if (command.devOnly) {
                if (!client.config.devs.includes(interaction.user.id)) {
                    return interaction.reply({
                        content: "Only developers can use this command.",
                        ephemeral: true,
                    });
                }
            }

            if (command.userPermissions?.length) {
                if (
                    !interaction.member.permissions.has(command.userPermissions)
                ) {
                    return interaction.reply({
                        content: `You need \`${command.userPermissions
                            .map((p) => p)
                            .join(", ")}\` permission to use this command.`,
                        ephemeral: true,
                    });
                }
            }

            if (command.botPermissions?.length) {
                if (
                    !interaction.guild.members.me.permissions.has(
                        command.botPermissions
                    )
                ) {
                    return interaction.reply({
                        content: `I need \`${command.botPermissions
                            .map((p) => p)
                            .join(", ")}\` permission to execute this command.`,
                        ephemeral: true,
                    });
                }
            }

            return command.execute(client, interaction);
        } catch (error) {
            if (interaction.replied) {
                interaction.editReply({
                    content: `An error occured while executing the command.`,
                });
            } else {
                interaction.reply({
                    content: `An error occured while executing the command.`,
                    ephemeral: true,
                });
            }

            throw error;
        }
    },
};