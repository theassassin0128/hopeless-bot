const colors = require("colors");
const { fetchCommands } = require("./fetchCommands.js");
const { checkForChange } = require("./checkForChanges.js");

/** A fucntion to synchronize Application Commands
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {import("@types/commands").NewCommand[]} newCommands
 * @returns {Promise<void>}
 */
module.exports = async (client) => {
  client.logger.info(colors.yellow("synchronizing application command(s)"));
  /**
   * @param {import("@types/commands").OldCommand[]} oldCommands
   * @param {import("@types/commands").NewCommand[]} newCommands
   */
  const syncCommands = async (oldCommands, newCommands) => {
    const commandsToAdd = newCommands.filter(
      (command) => !oldCommands.some((c) => c.data.name === command.data.name),
    );
    for (const command of commandsToAdd) {
      try {
        if (command.disabled) continue;

        if (command.global) {
          await client.application.commands.create(command.data);
        } else {
          await client.application.commands.create(command.data, guildId);
        }

        console.log(`[${colors.green("ADDED")}] ${colors.magenta(command.data.name)}`);
      } catch (error) {
        errors.push(error);
      }
    }

    const commandsToDelete = oldCommands.filter(
      (command) => !newCommands.some((c) => c.data.name === command.data.name),
    );
    for (const command of commandsToDelete) {
      try {
        await command.data.delete();
        console.log(`[${colors.red("DELETED")}] ${colors.magenta(command.data.name)}`);
      } catch (error) {
        errors.push(error);
      }
    }

    const commandsToModify = newCommands.filter((command) =>
      oldCommands.some((c) => c.data.name === command.data.name),
    );
    for (const newCommand of commandsToModify) {
      try {
        const oldCommand = oldCommands.find((c) => c.data.name === newCommand.data.name);

        if (!newCommand.enabled) {
          await oldCommand.data.delete();

          console.log(
            `[${colors.red("DELETED")}] ${colors.magenta(newCommand.data.name)}`,
          );
          continue;
        }

        if (oldCommand.global !== newCommand?.global) {
          await oldCommand.data.delete();

          if (newCommand?.global) {
            await client.application.commands.create(newCommand.data);
          } else {
            await client.application.commands.create(newCommand.data, guildId);
          }

          console.log(
            `[${colors.yellow("MODIFIED")}] ${colors.magenta(newCommand.data.name)}`,
          );
          continue;
        }

        if (checkForChange(oldCommand, newCommand)) {
          if (newCommand?.global) {
            await client.application.commands.create(newCommand.data);
          } else {
            await client.application.commands.delete(oldCommand.data.id, guildId);
          }

          console.log(
            `[${colors.yellow("MODIFIED")}] ${colors.magenta(newCommand.data.name)}`,
          );
          continue;
        }
      } catch (error) {
        errors.push(error);
      }
    }
  };

  const errors = new Array();
  const { guildId } = client.config;
  const oldCommands = await fetchCommands(client);

  const oldSlashCommands = oldCommands.filter((c) => c.data.type === 1);
  const newSlashCommands = client.newCommands.filter((c) => c.data.type === 1);
  await syncCommands(oldSlashCommands, newSlashCommands);

  const oldContextMenuCommands = oldCommands.filter((c) => c.data.type === (2 || 3));
  const newContextMenuCommands = client.newCommands.filter(
    (c) => c.data.type === (2 || 3),
  );
  await syncCommands(oldContextMenuCommands, newContextMenuCommands);

  console.log(
    `[${colors.cyan("INFO")}] ${colors.green("all application commands are in sync")}`,
  );

  if (errors.length > 0) {
    console.log(
      colors.yellow(
        "[AntiCrash] | [Synchronization_Error_Logs] | [Start] : ===============",
      ),
    );
    for (const error of errors) {
      console.log(colors.red(error));
    }
    console.log(
      colors.yellow(
        "[AntiCrash] | [Synchronization_Error_Logs] | [End] : ===============",
      ),
    );
  }

  return client.logger.info(colors.yellow("synchronization completed"));
};
