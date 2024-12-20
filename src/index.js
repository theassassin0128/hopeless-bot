require("dotenv").config();
require("module-alias/register");

const { GatewayIntentBits, Partials } = require("discord.js");
const { DiscordBot } = require("@lib/DiscordBot.js");

// initializing the client
const client = new DiscordBot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildModeration,  
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution, 
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember, 
  ],
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  failIfNotExists: true,
  autoReconnect: true,
  disabledEvents: ["TYPING_START"],
  restTimeOffset: 0,
});

client.build().catch((error) => {
  throw error;
});

// exporting the client for other use
module.exports = client;
