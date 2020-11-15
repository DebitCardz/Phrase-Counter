import { Message } from "discord.js";
import BotCommand from "../../lib/command";

export default class PingCommand extends BotCommand {
	constructor() {
		super("ping", "Pong!");
	}

	async execute(message: Message, args: string[]) {
		// Pong!
		message.channel.send(`Ping! **${message.client.ws.ping}ms**!`);
	}
}