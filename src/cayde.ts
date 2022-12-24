import { CacheType, Events, Interaction, REST, Routes } from "discord.js";
import { CommandClient } from "@cayde/common/client";
import { log, Severity } from "@cayde/common/log";

const cayde = new CommandClient({
    intents: ["DirectMessages", "Guilds", "GuildMessages", "MessageContent"],
    shards: "auto",
});

cayde.on(Events.ClientReady, async () => {
    cayde.registerCommands("./dist/commands");
    const commands = cayde.getCommandData();
    log(`Sending PUT request for ${commands.length} commands...`);

    // Should only run when DISCORD_TOKEN is defined anyway
    if (!process.env["DISCORD_TOKEN"]) return;

    const rest = new REST({ version: "10" }).setToken(process.env["DISCORD_TOKEN"]);
    try {
        await rest.put(
            Routes.applicationGuildCommands("694828817457479731", "799141153260961802"),
            {
                body: commands,
            }
        );
        log("PUT request sent successfully.");
    } catch (e) {
        log(`Error with PUT request: ${(e as Error).message}`, Severity.ERROR);
    }
});

cayde.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;
    if (cayde.commandExists(interaction.commandName))
        await cayde.executeCommand(interaction.commandName, interaction);
});

cayde.login(process.env["DISCORD_TOKEN"]).catch((err: any) => {
    log(`Unable to log into Discord: ${err}`, Severity.ERROR);
});
