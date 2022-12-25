import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { logError } from "@cayde/common/log";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Latency test."),
    execute: async (int: ChatInputCommandInteraction<CacheType>) => {
        int.reply("Pong!").catch(logError);
    },
};
