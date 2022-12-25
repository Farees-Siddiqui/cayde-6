import { AttachmentBuilder, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { logError } from "@cayde/common/log";

const urlOption: string = "url";

export default {
    data: new SlashCommandBuilder()
        .setName("media")
        .setDescription("Upload a file from an HTTP(S) link.")
        .addStringOption((option) => option.setName("url").setDescription("The URL to the file.").setRequired(true)),
    execute: async (int: ChatInputCommandInteraction<CacheType>) => {
        const url: string = int.options.getString(urlOption, true);
        if (!url.startsWith("http")) {
            await int.reply("I can only accept an HTTP or HTTPS link, guardian.").catch(logError);
            return;
        }

        await int
            .reply({
                files: [new AttachmentBuilder(url)],
            })
            .catch(logError);
    },
};
