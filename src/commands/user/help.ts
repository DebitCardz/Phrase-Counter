import { Message } from "discord.js";
import { bot } from "../../index";
import BotCommand from "../../lib/command";

export default class HelpCommand extends BotCommand {
	
	constructor() {
		super("help", "Displays a help message.", { aliases: ["support"], category: "General" });
	}

	async execute(message: Message, args: string[]) {
		const embed = bot.helpEmbed;
		embed.setAuthor(`Help Menu`, message.author.displayAvatarURL({ dynamic: true }));
		embed.setTimestamp();
		message.channel.send(embed);
	}
}