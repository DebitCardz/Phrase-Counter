import { Message } from "discord.js";
import { Bot } from "../../lib/bot";
import BotCommand from "../../lib/command";

export default class HelpCommand extends BotCommand {
	
	constructor() {
		super("help", "Displays a help message.", { aliases: ["support"], category: "General" });
	}

	async execute(bot: Bot, message: Message, args: string[]) {
		const embed = bot.helpEmbed;
		embed.setAuthor(`Help Menu`, message.author.displayAvatarURL({ dynamic: true }));
		embed.setTimestamp();
		message.channel.send(embed);
	}
}