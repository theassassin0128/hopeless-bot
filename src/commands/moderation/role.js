const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "moderation",
    cooldown: 0,
    premium: false,
    guildOnly: false,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: [
      "SendMessages",
      "ManageRoles",
      "ModerateMembers",
      "ReadMessageHistory",
    ],
    userPermissions: ["SendMessages", "ModerateMembers"],
  },
  prefix: {
    name: "role",
    description: "Give | Remove role(s) from server members",
    aliases: [],
    usage: "",
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("role")
      .setDescription("Give | Remove role(s) from server members")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .addSubcommand((option) =>
        option
          .setName("give")
          .setDescription("Gives a role to a user.")
          .addRoleOption((option) =>
            option.setName("role").setDescription("The role to give.").setRequired(true),
          )
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user to give the role.")
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("remove")
          .setDescription("Removes a role from a user.")
          .addRoleOption((option) =>
            option
              .setName("role")
              .setDescription("The role to remove.")
              .setRequired(true),
          )
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user to remove the role.")
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("multiple")
          .setDescription("Role command for multiple users.")
          .addStringOption((option) =>
            option
              .setName("action")
              .setDescription("Pick an action")
              .setRequired(true)
              .addChoices(
                { name: "Give", value: "give" },
                {
                  name: "Remove",
                  value: "remove",
                },
              ),
          )
          .addRoleOption((option) =>
            option.setName("role").setDescription("The role to gives.").setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName("type")
              .setDescription("Pick a type")
              .setRequired(true)
              .addChoices(
                {
                  name: "All Members",
                  value: "all",
                },
                {
                  name: "Humans",
                  value: "humans",
                },
                { name: "Bots", value: "bots" },
              ),
          ),
      ),

    usage:
      "[subcommand]: <give|remove|multiple> [role]: <role> [target|type]: <GuildMember|type>",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const { options, user, guild } = interaction;
      const role = await guild.roles.fetch(options.getRole("role")?.id);
      const target = options.getUser("target")
        ? (await guild.members.fetch()).get(options.getUser("target").id)
        : null;
      const bot = await guild.members.fetchMe();
      const fetchedUser = (await guild.members.fetch()).get(user.id);
      const action = options.getString("action");
      const type = options.getString("type");
      const subcommand = options.getSubcommand();
      let memberArray = [];

      if (role.position >= bot.roles.highest.position) {
        interaction.reply({
          content: `I am not allowed to manage this role | ${role}`,
          ephemeral: true,
        });
        return;
      }

      if (
        !fetchedUser.id == guild.ownerId &&
        fetchedUser.roles.highest.position < role.position
      ) {
        interaction.reply({
          content: `You are not allowed to manage this role | ${role}`,
          ephemeral: true,
        });
        return;
      }

      switch (subcommand) {
        case "give":
          {
            await target.roles.add(role);
            interaction.reply({
              content: `${role} | Role given to ${target}.`,
              ephemeral: true,
            });
          }
          break;
        case "remove":
          {
            await target.roles.remove(role);
            interaction.reply({
              content: `${role} | Role removed from ${target}.`,
              ephemeral: true,
            });
          }
          break;
        case "multiple":
          {
            const allMembers = await guild.members.fetch();
            allMembers.forEach((member) => {
              switch (type) {
                case "all":
                  memberArray.push(member);
                  break;
                case "humans":
                  if (!member.user.bot) memberArray.push(member);
                  break;
                case "bots":
                  if (member.user.bot) memberArray.push(member);
                  break;
              }
            });
            switch (action) {
              case "give":
                {
                  memberArray.forEach((member) => {
                    member.roles.add(role);
                  });
                  interaction.reply({
                    content: `${role} | Given the role to selected members.`,
                    ephemeral: true,
                  });
                }
                break;
              case "remove":
                {
                  memberArray.forEach((member) => {
                    member.roles.remove(role);
                  });
                  interaction.reply({
                    content: `${role} | Removed the role from selected members.`,
                    ephemeral: true,
                  });
                }
                break;
            }
          }
          break;
      }
    },
  },
};
