import { Message } from "discord.js";
import { bot } from "../../index";
import BotCommand from "../../lib/command";

export default class HelpCommand extends BotCommand {
	
	constructor() {
		super("help", "Displays a help message.", { aliases: ["support"], category: "General" });
	}

	async execute(message: Message, args: string[]) {
		message.channel.send(bot.helpEmbed);
	}
}