import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../../lib/bot";
import BotCommand from "../../lib/command";

export default class PingCommand extends BotCommand {
	constructor() {
		super("ping", "Pong!", { category: "General" });
	}

	async execute(bot: Bot, message: Message, args: string[]) {
		// Pong!
		message.channel.send(this.pingEmbed(message.client.ws.ping));
	}

	pingEmbed(ping: number) : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setDescription(`Pong! **${ping}ms**.`);
		embed.setColor("GREEN");
		return embed;
	}
}