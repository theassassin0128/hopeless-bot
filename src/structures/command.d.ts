// types for commands
import {
  APIApplicationCommand,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  Message,
  MessageContextMenuCommandInteraction,
  PermissionResolvable,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import {
  CommandCategory,
  CommandOptions,
  PrefixObjectStructure,
  SlashObjectStructure,
  ContextObjectStructure,
  SubCommand,
} from "./shared.d.ts";
import { DiscordBot } from "@lib/DiscordBot.js";

// BaseCommandStructure to use in loadCommands and syncCommands function
export interface BaseCommandStructure {
  options: CommandOptions;
  prefix?: PrefixObjectStructure;
  slash?: SlashObjectStructure;
  context?: ContextObjectStructure;
}

// CommandStructure to use in command modules
export interface CommandStructure {
  options: CommandOptions;
  prefix?: PrefixObjectStructure;
  slash?: SlashObjectStructure;
}

// PrefixCommandStructure to use in prefix command collection
export interface PrefixCommandStructure {
  category?: CommandCategory;
  cooldown?: number;
  premium?: boolean;
  guildOnly?: boolean;
  devOnly?: boolean;
  voiceChannelOnly?: boolean;
  botPermissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string;
  disabled?: boolean;
  minArgsCount?: number;
  subcommands: SubCommand[];
  execute: (
    client: DiscordBot,
    message: Message,
    args: string[],
    data: object,
  ) => Promise<any>;
}

// SlashCommandStructure to use in slash command collection
export interface SlashCommandStructure {
  category?: CommandCategory;
  cooldown?: number;
  premium?: boolean;
  guildOnly?: boolean;
  devOnly?: boolean;
  voiceChannelOnly?: boolean;
  botPermissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
  data: APIApplicationCommand;
  ephemeral?: boolean;
  usage?: string;
  disabled?: boolean;
  global?: boolean;
  execute: (
    client: DiscordBot,
    interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction,
    data: object,
  ) => Promise<any>;
}
