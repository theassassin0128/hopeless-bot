const { connect } = require("mongoose");
const colors = require("colors");
const { t } = require("i18next");

/**
 * A function to connect to mongobd throuigh mongoose
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @returns {Promise<void>}
 */
module.exports = async (client) => {
  try {
    await connect(client.config.mongo_uri);
    client.logger.info(
      t("console:database.connected", { db: colors.magenta("mongodb") }),
    );
  } catch (error) {
    throw error;
  }
};