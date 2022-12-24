import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "discord.js";

const diceRollString = "rolls";

export default {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Simulates dice rolls.")
        .addStringOption((opt) =>
            opt
                .setName(diceRollString)
                .setDescription("The max dice roll. Split multiple rolls by whitespace.")
                .setRequired(true)
        ),
    execute: async (int: ChatInputCommandInteraction<CacheType>) => {
        const rolls = int.options.getString(diceRollString, true).trim().split(/\s+/);
        if (rolls.filter((val) => Number.parseInt(val) <= 1).length != 0) {
            int.reply("I can't roll a dice with a value of 1 or less.");
            return;
        }

        int.reply(
            `Rolling: ${rolls.join(", ")}\nResults: ${rolls
                .map((roll) => Math.floor(Math.random() * Number.parseInt(roll) + 1).toString())
                .reduce((x, y) => `${x}, ${y}`)}`
        );
    },
};
