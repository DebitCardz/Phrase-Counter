import { getModelForClass } from "@typegoose/typegoose";
import { Message, MessageEmbed, User } from "discord.js";
import { Connection } from "mongoose";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";

export default class BalanceCommand extends BotCommand {
	constructor() {
		super("balance", "Get the amount of money you have", { aliases: ["bal", "money", "cash"] });
	}

	async execute(message: Message, args: string[], db: Connection) : Promise<void> {

		const model = getModelForClass(Gamer, { existingConnection: db });

		let user;
		// other person
		if(args.length >= 1) user = message.mentions.users.first();
		// self
		else user = message.author;

		if(!user) {
			message.channel.send(`Sorry! ${args[0]} isn't a valid user.`);
			return;
		}

		const existingUser = await model.findOne({ user_id: user.id });

		if(existingUser) message.channel.send(this.balanceEmbed(user, existingUser.cash));
		else message.channel.send(this.balanceEmbed(user, 0));
	}

	/**
	 * Display a specific users balance in an embed.
	 * @param user
	 * @param balance 
	 */
	balanceEmbed(user: User, balance: number) : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setAuthor(`${user.username}'s cash.`, user.displayAvatarURL({ dynamic: true }));
		embed.addField(`Cash:`, `${user} has \$${balance}.`);
		embed.setTimestamp();
	
		return embed;
	}
} 