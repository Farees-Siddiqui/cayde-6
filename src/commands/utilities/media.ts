import { AttachmentBuilder, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { logError } from "@cayde/common/log";

const urlOption: string = "url";

export default {
    data: new SlashCommandBuilder()
        .setName("media")
        .setDescription("Upload a file from a link.")
        .addStringOption((option) => option.setName("url").setDescription("The URL to the file.").setRequired(true)),
    execute: async (int: ChatInputCommandInteraction<CacheType>) => {
        const url: string = int.options.getString(urlOption, true);
        const f = new AttachmentBuilder(url);

        await int
            .reply({
                files: [f],
            })
            .catch(logError);
    },
};
