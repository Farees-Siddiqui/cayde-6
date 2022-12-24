import { readdirSync } from "fs";
import { resolve } from "path";
import {
    CacheType,
    ChatInputCommandInteraction,
    Client,
    ClientOptions,
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
    SlashCommandBuilder,
} from "discord.js";
import { log, Severity } from "@cayde/common/log";

export interface Command {
    data: SlashCommandBuilder;
    execute: (msg: ChatInputCommandInteraction<CacheType>) => Promise<void>;
}

export class CommandClient extends Client {
    private readonly commandMap: Map<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commandMap = new Map();
    }

    registerCommands(path: string): void {
        log("Loading commands...");
        this._scanCommandDir(path);
    }

    getCommandData(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
        return Array.from(this.commandMap.values()).map((cmd) => cmd.data.toJSON());
    }

    commandExists(name: string): boolean {
        return this.commandMap.has(name.toLowerCase());
    }

    async executeCommand(name: string, int: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await this.commandMap.get(name.toLowerCase())?.execute(int);
    }

    private _scanCommandDir(path: string): void {
        const entries = readdirSync(path, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                log(`Checking directory ${path}/${entry.name}.`);
                this._scanCommandDir(resolve(`${path}/${entry.name}`));
                continue;
            }

            if (!entry.name.endsWith(".js")) continue;

            try {
                const cmd: Command = require(`${path}/${entry.name}`).default;
                const cmdName: string = cmd.data.name.toLowerCase();
                if (this.commandExists(cmdName)) {
                    log(
                        `A command already exists with the name "${cmdName}, consider renaming it.`,
                        Severity.WARN
                    );
                    continue;
                }

                this.commandMap.set(cmdName, cmd);
                log(`Successfully loaded command ${cmdName}.`);
            } catch (e) {
                log(
                    `Unable to register command from ${entry.name}: ${(e as Error).message}.`,
                    Severity.ERROR
                );
            }
        }
    }
}
